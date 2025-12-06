const express = require('express');
const app = express();
const port = 3005;
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(cors());

// Načtení klíče z proměnné prostředí (důležité pro bezpečnost)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Endpoint pro vytvoření platebního záměru
app.post('/create-payment', express.json(), async (req, res) => {
  const { amount, prisonerId, orderId } = req.body; // Příjem dat z hlavního kontejneru

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Vždy v nejmenší jednotce (např. centy)
      currency: 'czk',
      metadata: { 
        order_id: orderId,
        prisonerId: prisonerId
       }, // Důležité pro zpětnou identifikaci
    });

    // Frontend potřebuje jen tento klíč pro dokončení platby
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Musíte raw body potřebovat pro ověření podpisu
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Ověření, že zpráva přišla skutečně ze Stripe
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Zpracování události
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const finalAmount = paymentIntent.amount;
    const prisonerId = paymentIntent.metadata.prisonerId;
    console.log(finalAmount);
    console.log(prisonerId);
    const JWT_SECRET = 'jwt-secret-key-change-in-production';

    // ZDE MUSÍTE:
    // 1. Získat order_id z metadata (paymentIntent.metadata.order_id)
    // 2. Aktualizovat stav objednávky v DB (např. na "Zaplaceno")
    // 1. VYTVOŘENÍ SERVISNÍHO JWT TOKENU
    const serviceToken = jwt.sign(
      {
        serviceId: 'payment-service', // Identifikace volající služby
        role: 'payment',
        scope: 'payment' // Omezení práv (jen navýšení kreditů)
      },

      JWT_SECRET,
      { expiresIn: '5m' } // Token platí jen krátce
    );

    // 2. ZAVOLÁNÍ SLUŽBY `prisoner-service` S TOKENEM
    try {
      const url = `http://prisoner-service:3001/prisoners/${prisonerId}/credit/increase`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // PŘEDÁNÍ SERVISNÍHO TOKENU
          'Authorization': `Bearer ${serviceToken}`
        },
        body: JSON.stringify({
          amount: Math.floor(finalAmount/100)
        })
      });

      if (response.ok) {
        console.log(`ÚSPĚCH: Kredity pro ${prisonerId} navýšeny o ${finalAmount/100} CZK.`);
      } else {
        console.error(`CHYBA VOLÁNÍ PRISONER SERVICE: ${response.status} - ${response.statusText}`);
      }
    } catch (fetchError) {
      console.error("CHYBA PŘI KOMUNIKACI s prisoner-service:", fetchError);
    }

    console.log(`Platba pro objednávku ${paymentIntent.metadata.order_id} úspěšná!`);

  } else {
    // Ostatní události (selhání, refundace, atd.)
    console.log(`Zpracování neznámé události: ${event.type}`);
  }

  res.json({ received: true }); // Vždy vrátit 200 OK
});

app.listen(port, () => {
  console.log(`Payment service listening at http://localhost:${port}`);
});