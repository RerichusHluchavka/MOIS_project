import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Deklarujeme globální proměnnou Stripe, aby ji TypeScript poznal
declare const Stripe: any;

@Component({
    selector: 'app-credit-charge-modal',
    templateUrl: './credit-charge-modal.component.html',
    imports: [
        IonicModule,
        FormsModule,
        CommonModule
    ]
})
export class CreditChargeModalComponent {

    @Input() prisonerId!: number;
    public amount: number = 0; // Částka v kreditech
    public isProcessing: boolean = false;
    public stripeError: string | null = null;

    private stripe: any; // Instance Stripe

    // Změňte tento klíč na VÁŠ VEŘEJNÝ KLÍČ (pk_live_... nebo pk_test_...)
    private stripePublicKey = 'pk_test_51Sa0nlE0c1OU1d2KDCJz4PNau0CbLX0STqXEzqhKucDQfIYeEZFNkkRL60wdQvquWGkivcARpEjUsl9G5qzKokyb004VI2LTr1';

    // Místo pro držení elementů Stripe
    private cardElement: any;

    constructor(
        private modalController: ModalController,
        private http: HttpClient
    ) { }

    ngOnInit() {
        // 1. Inicializace Stripe s veřejným klíčem
        this.stripe = Stripe(this.stripePublicKey);

        //TODO vyhrát si se styly
        const style = {
            base: {
                // Změna barvy písma na světlou
                color: '#ffffff',

                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',

                // Změna barvy placeholderu na světlejší šedou
                '::placeholder': {
                    color: '#BABABA'
                },
            },
            invalid: {
                // Styl pro neplatné vstupy
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        // 2. Vytvoření a připojení platebních elementů
        const elements = this.stripe.elements();

        // Vytvoříme element pro sběr údajů karty
        this.cardElement = elements.create('card', {
            style: style, 
            hidePostalCode: true
        });       

         // Připojíme element k HTML kontejneru (viz bod B)
        this.cardElement.mount('#card-element');

        // Zachycení chyb pro lepší UX
        this.cardElement.on('change', (event: any) => {
            this.stripeError = event.error ? event.error.message : null;
        });
    }

    private readonly API_URL = 'http://localhost/api';

    async startStripeCheckout() {
        if (this.amount <= 0) return;
        this.isProcessing = true;
        this.stripeError = null;

        try {
            
            // 1. Volání backendu pro vytvoření Payment Intent
            const response = await this.http.post<any>(`${this.API_URL}/payments/create-payment`, {
                amount: this.amount * 100, // Frontend posílá částku v CZK centech
                prisonerId: this.prisonerId,
                orderId: `CRG-${Date.now()}` // Unikátní ID objednávky
            }).toPromise();

            const clientSecret = response.clientSecret;

            // 2. Potvrzení platby pomocí klíče Client Secret
            const { paymentIntent, error } = await this.stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: this.cardElement, // Použijeme data z Card Elementu
                    }
                }
            );

            if (error) {
                // Zobrazí chyby, které se vyskytly během 3D Secure nebo zpracování
                this.stripeError = error.message;
                this.isProcessing = false;

            } else if (paymentIntent.status === 'succeeded') {
                // Platba je dokončena. Další akce se odehrají na backendu (Webhook)
                this.handleSuccessfulPayment(this.amount);
            }

        } catch (apiError: any) {
            console.log(apiError.error);
            this.stripeError = apiError.error.error || 'Chyba při komunikaci s API.';
            this.isProcessing = false;
        }
    }

    handleSuccessfulPayment(amount: number) {
        // Zavření modalu. Kredity budou připsány AŽ po obdržení Webhooku
        this.modalController.dismiss({ success: true, amount: amount }, 'success');
    }

    onCancel() {
        this.modalController.dismiss(null, 'cancel');
    }
}