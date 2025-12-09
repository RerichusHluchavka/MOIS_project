const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'kitchen-db',
  database: process.env.DB_NAME || 'kitchen_db',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// conenction testing
pool.on('connect', () => {
  console.log(' Connected to PostgreSQL prisoner_db');
});

pool.on('error', (err) => {
  console.error(' PostgreSQL connection error:', err);
});

async function executeInTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Spustí callback funkci a předá jí klienta.
    // Zde se provede vaše specifická logika (např. UPDATE, SELECT).
    const result = await callback(client);

    await client.query('COMMIT');
    return result;

  } catch (error) {
    // Pokud dojde k chybě v callbacku nebo při COMMIT, provedeme ROLLBACK.
    await client.query('ROLLBACK');
    console.error('Database transaction rolled back due to error:', error.message);
    throw error; // Znovu vyhodit chybu, aby se o ní dozvěděla volající funkce

  } finally {
    // Klient je vždy uvolněn zpět do poolu.
    client.release();
  }
}

/*
food table schema:
- food_id SERIAL PRIMARY KEY,
- food_name varchar
*/

// CRUD operace pro jídlo

// Získání všech jídel
async function getAllFood() {
  try {
    const result = await pool.query('SELECT * FROM food ORDER BY food_id;');
    return result.rows;
  } catch (error) {
    console.error('Error getting food:', error);
    throw error;
  }
}

// Získání jídla podle ID
async function getFoodById(foodId) {
  try {
    const result = await pool.query(
      'SELECT * FROM food WHERE food_id = $1;',
      [foodId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting food by ID:', error);
    throw error;
  }
}

// Vytvoření nového jídla
async function createFood(foodData) {
  const { food_name } = foodData;
  try {
    const result = await pool.query(
      'INSERT INTO food (food_name) VALUES ($1) RETURNING *;',
      [food_name]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating food:', error);
    throw error;
  }
}

// Smazání jídla podle ID
async function deleteFood(foodId) {
  try {
    const result = await pool.query(
      'DELETE FROM food WHERE food_id = $1 RETURNING *;',
      [foodId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting food:', error);
    throw error;
  }
}

/*
today_menu table schema:
- food_id integer primary key references food(food_id),
- cost integer
- portions_available integer
*/

// CRUD operace pro dnešní menu

// Získání dnešního menu
async function getTodayMenu() {
  try {
    const result = await pool.query('SELECT * FROM today_menu ORDER BY food_id;');
    return result.rows;
  } catch (error) {
    console.error('Error getting today menu:', error);
    throw error;
  }
}

// Přidání jídla do dnešního menu
async function addFoodToTodayMenu(menuData, token) {
  const { food_id, cost, portions_available } = menuData;

  const updateRow = await executeInTransaction(async (client) => {

    const inventory_items = await getAllInventoryItems(token);
    const inventory_names = inventory_items.data.map(item => item.name);
    console.log(inventory_names);

    const inventoryLookupMap = inventory_items.data.reduce((map, item) => {
      map[item.name] = {
        id: item.item_id,
        unit: item.unit
      };
      return map;
    }, {});

    console.log(inventoryLookupMap)

    const ingredints_info = await client.query(
      `SELECT fi.*, i.name
       FROM food_ingredients fi
       JOIN ingredients i ON fi.ingredient_id = i.ingredient_id
       WHERE fi.food_id = $1;`,
      [food_id]
    );

    const ingredientRows = ingredints_info.rows;
    const names = ingredientRows.map(ingredient => ingredient.name);
    //ingredientRows[0].unit
    //console.log(ingredientRows)
    for (const row of ingredientRows) {
      if (inventory_names.includes(row.name)) {
        let amount_needed = row.portion_amount * portions_available;

        let itemDetails = inventoryLookupMap[row.name];
        const itemId = itemDetails.id;
        const itemUnit = itemDetails.unit;

        if (itemUnit !== row.unit) {
          amount_needed = convertAmount(row.unit, itemUnit, amount_needed);
        }

        const isSufficient = await checkTotalItemQuantity(token, itemId, amount_needed);
        if (isSufficient) {
          console.log("stačí")
        } else {
          console.log("nestačí")
          throw new Error(`Nedostatečné množství '${row.name}' na skladu skladu.`);
        }

        console.log(`ID pro ${row.name}: ${itemId}, Jednotka: ${itemUnit}`);

        await decreaseItemFromStorages(token, itemId, amount_needed);

      } else {
        console.log(row.name + " neexistuje");
        throw new Error(`Ingredient '${row.name}' not found in Inventory Service. Cannot add food to menu.`);
      }
    }

    const result = await client.query(
      `INSERT INTO today_menu (food_id, cost, portions_available)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [food_id, cost, portions_available]
    );
    return result.rows[0];

  })
  return updateRow;
}

// Odebrání jídla z dnešního menu
async function removeFoodFromTodayMenu(foodId) {
  try {
    const result = await pool.query(
      `DELETE FROM today_menu WHERE food_id = $1 RETURNING *;`,
      [foodId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error removing food from today menu:', error);
    throw error;
  }
}

//Aktualizace ceny jídla v dnešním menu
async function updateTodayMenuFoodCost(foodId, newCost) {
  try {
    const result = await pool.query(
      `UPDATE today_menu
        SET cost = $1
        WHERE food_id = $2
        RETURNING *`,
      [newCost, foodId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating food cost in today menu:', error);
    throw error;
  }
}

//Odečtení porcí jídla v dnešním menu
async function decreaseTodayMenuFoodPortions(foodId, amount) {
  const realAmount =
    typeof amount === 'object' && amount !== null
      ? amount.amount
      : amount;

  const updateRow = await executeInTransaction(async (client) => {

    const result = await client.query(
      `UPDATE today_menu
        SET portions_available = portions_available - $1
        WHERE food_id = $2
        RETURNING *`,
      [realAmount, foodId]
    );

    return result.rows[0];
  });

  return updateRow;
}



// Smazání všecj jídel z dnešního menu
async function deleteAllTodayMenu() {
  try {
    const result = await pool.query(
      'DELETE FROM today_menu RETURNING *;'
    );
    return result.rows;
  } catch (error) {
    console.error('Error deleting all today menu:', error);
    throw error;
  }
}

module.exports = {
  getAllFood,
  getFoodById,
  createFood,
  deleteFood,
  getTodayMenu,
  addFoodToTodayMenu,
  removeFoodFromTodayMenu,
  updateTodayMenuFoodCost,
  decreaseTodayMenuFoodPortions,
  deleteAllTodayMenu
};

const axios = require('axios');

async function getAllInventoryItems(userToken) {
  // URL a endpoint, který voláme
  const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3002';
  const endpoint = `${INVENTORY_SERVICE_URL}/items`;

  try {
    // Používáme GET metodu pro získání dat
    const response = await axios.get(endpoint, {
      headers: {
        // Předání autorizace pro Service-to-Service volání
        'Authorization': userToken
      }
    });

    // 2. Získání dat
    // Data jsou obsažena v klíči 'data' objektu response
    return response.data;

  } catch (error) {
    // Zpracování chyb (např. 404 Not Found, 500 Server Error)
    if (error.response) {
      console.error(
        `Chyba při volání inventory-service: Status ${error.response.status}`,
        error.response.data
      );
    } else {
      console.error('Chyba sítě nebo neznámá chyba:', error.message);
      // Vyhození chyby pro další zpracování
      throw new Error('Nepodařilo se získat položky ze skladu.');
    }

  }
}

async function checkTotalItemQuantity(userToken, Itemid, amount) {
  // URL a endpoint, který voláme
  const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3002';
  const endpoint = `${INVENTORY_SERVICE_URL}/storing/item/${Itemid}/total`;

  try {
    // Používáme GET metodu pro získání dat
    const response = await axios.get(endpoint, {
      headers: {
        // Předání autorizace pro Service-to-Service volání
        'Authorization': userToken
      }
    });

    // 2. Získání dat
    // Data jsou obsažena v klíči 'data' objektu response
    console.log("ID:" + Itemid);
    console.log(response.data.data.total_quantity);
    console.log("potřeba:" + amount);

    if (amount <= response.data.data.total_quantity) {
      return true;
    }
    return false;

  } catch (error) {
    if (error.response) {
      console.error(
        `Chyba při volání inventory-service: Status ${error.response.status}`,
        error.response.data
      );
      return false;
    } else {
      console.error('Chyba sítě nebo neznámá chyba:', error.message);
      // Vyhození chyby pro další zpracování
      throw new Error('Nepodařilo se získat položky ze skladu.');
    }
  }
}

async function decreaseItemFromStorages(userToken, itemId, amount) {
  // URL a endpoint, který voláme
  const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3002';
  // Ujistěte se, že používáte správné jméno item_id v routě: ${itemId}
  const endpoint = `${INVENTORY_SERVICE_URL}/storing/storage/item/${itemId}/decreaseFromAll`;

  try {
    const response = await axios.patch(
      endpoint,

      // 2. ARGUMENT: TĚLO POŽADAVKU (DATA)
      { "volume": amount },

      // 3. ARGUMENT: KONFIGURACE (HLAVIČKY)
      {
        headers: {
          'Authorization': userToken // Předání autorizace
        }
      }
    );

    // Vracíme výsledek, nebo jen true/false, podle potřeby
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error(
        `Chyba při volání inventory-service: Status ${error.response.status}`,
        error.response.data
      );
      return false;
    } else {
      console.error('Chyba sítě nebo neznámá chyba:', error.message);
      // Vyhození chyby pro další zpracování
      throw new Error('Nepodařilo se získat položky ze skladu.');
    }
  }
}


function convertAmount(fromUnit, toUnit, amount) {
  if (fromUnit === toUnit) return 1;

  if (fromUnit === 'g' && toUnit === 'kg') return amount * 0.001;
  if (fromUnit === 'kg' && toUnit === 'g') return amount * 1000;
  if (fromUnit === 'l' && toUnit === 'ml') return amount * 1000;
  if (fromUnit === 'ml' && toUnit === 'l') return amount * 0.001;

  // Pokud konverze není známá (např. g -> l), vyvoláme chybu
  throw new Error(`Unit conversion not supported: ${fromUnit} to ${toUnit}`);
}

