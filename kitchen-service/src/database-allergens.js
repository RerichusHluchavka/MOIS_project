const { Pool } = require('pg');
require('dotenv').config();
const axios = require('axios');
const { response } = require('express');

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
allergens table schema:
- allergen_id integer PRIMARY KEY,
- allergen_name varchar
*/

// CRUD operace pro alergeny

// Získání všech alergenů
async function getAllAllergens() {
  try {
    const result = await pool.query('SELECT * FROM allergens ORDER BY allergen_id;');
    return result.rows;
  } catch (error) {
    console.error('Error getting allergens:', error);
    throw error;
  }
}

// Získání alergenu podle ID
async function getAllergenById(allergenId) {
  try {
    const result = await pool.query(
      'SELECT * FROM allergens WHERE allergen_id = $1;',
      [allergenId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting allergen by ID:', error);
    throw error;
  }
}

// Vytvoření nového alergenu
async function createAllergen(allergenData) {
  const { allergen_name } = allergenData;
  try {
    const result = await pool.query(
      'INSERT INTO allergens (allergen_name) VALUES ($1) RETURNING *;',
      [allergen_name]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating allergen:', error);
    throw error;
  }
}

// Smazání alergenu podle ID
async function deleteAllergenById(allergenId) {
  try {
    const result = await pool.query(
      'DELETE FROM allergens WHERE allergen_id = $1 RETURNING *;',
      [allergenId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting allergen by ID:', error);
    throw error;
  }
}

/*
ingredient_allergens table schema:
- ingredient_id integer REFERENCES ingredients(ingredient_id),
- allergen_id integer REFERENCES allergens(allergen_id)
*/

// CRUD operace pro vazbu ingrediencí a alergenů

// Získání alergenů pro ingredienci podle ID ingredience
async function getAllergensByIngredientId(ingredientId) {
  try {
    const result = await pool.query(
      `SELECT a.allergen_id, a.allergen_name
            FROM allergens a
            JOIN ingredient_allergens ia ON a.allergen_id = ia.allergen_id
            WHERE ia.ingredient_id = $1
            ORDER BY a.allergen_id;`,
      [ingredientId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting allergens for ingredient:', error);
    throw error;
  }
}

// Přidání alergenu k ingredienci
async function addAllergenToIngredient(ingredientId, allergenId) {
  try {
    const result = await pool.query(
      `INSERT INTO ingredient_allergens (ingredient_id, allergen_id)
            VALUES ($1, $2)
            RETURNING *;`,
      [ingredientId, allergenId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding allergen to ingredient:', error);
    throw error;
  }
}

// Odebrání alergenu od ingredience
async function removeAllergenFromIngredient(ingredientId, allergenId) {
  try {
    const result = await pool.query(
      `DELETE FROM ingredient_allergens
            WHERE ingredient_id = $1 AND allergen_id = $2
            RETURNING *;`,
      [ingredientId, allergenId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error removing allergen from ingredient:', error);
    throw error;
  }
}

// Získání všech ingrediencí podle alergenu
async function getIngredientsByAllergenId(allergenId) {
  try {
    const result = await pool.query(
      `SELECT i.ingredient_id, i.name
            FROM ingredients i
            JOIN ingredient_allergens ia ON i.ingredient_id = ia.ingredient_id
            WHERE ia.allergen_id = $1
            ORDER BY i.ingredient_id;`,
      [allergenId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting ingredients for allergen:', error);
    throw error;
  }
}


async function isPrisonerAllergicToFood(foodId, prisonerId, token) {
  const response = await executeInTransaction(async (client) => {

    const prisoner_data = await getPrisonersAllergens(token, prisonerId);
    console.log(prisoner_data);

    if (prisoner_data.count <= 0) {
      console.log("žádné allergeny");
      return { "data": 0, "message": "není na jídlo allergický" };
    }

    const prissoner_allergens_id = prisoner_data.data.map(item => item.allergen_id);
    console.log(prissoner_allergens_id);



    const food_ingredients = await client.query(
      `SELECT fi.*, i.name
       FROM food_ingredients fi
       JOIN ingredients i ON fi.ingredient_id = i.ingredient_id
       WHERE fi.food_id = $1;`,
      [foodId]
    );

    const ingredientRows = food_ingredients.rows;

    const ingreintIds = ingredientRows.map(ingredient => ingredient.ingredient_id);

    console.log(ingreintIds);

    let result = [];

    for (const id of ingreintIds) {
      let ingredient_allergens = await getAllergensByIngredientId(id);
      console.log(ingredient_allergens)
      for (let index = 0; index < ingredient_allergens.length; index++) {
        let ingredient_allergen_id = ingredient_allergens[index].allergen_id;
        if (prissoner_allergens_id.includes(ingredient_allergen_id)) {
          result.push({
            allergenId: ingredient_allergen_id,
          });
        }
      }
    }

    if (result.length === 0) {
      return 0;
    }
    console.log(result)
    return result;
  })
  return response;
}

module.exports = {
  getAllAllergens,
  getAllergenById,
  createAllergen,
  deleteAllergenById,
  getAllergensByIngredientId,
  addAllergenToIngredient,
  removeAllergenFromIngredient,
  getIngredientsByAllergenId,
  isPrisonerAllergicToFood
};

async function getPrisonersAllergens(userToken, prisonerId) {
  // URL a endpoint, který voláme
  const INVENTORY_SERVICE_URL = process.env.PRISONER_SERVICE_URL || 'http://prisoner-service:3001';
  // Ujistěte se, že používáte správné jméno item_id v routě: ${itemId}
  const endpoint = `${INVENTORY_SERVICE_URL}/prisoners/${prisonerId}/allergens`;
  console.log("ID:   " + prisonerId);
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
    if (error.response) {
      console.error(
        `Chyba při volání prisoner-service: Status ${error.response.status}`,
        error.response.data
      );
      response.count = -1
      return response;
    } else {
      console.error('Chyba sítě nebo neznámá chyba:', error.message);
      // Vyhození chyby pro další zpracování
      throw new Error('Nepodařilo se získat allergeny.');
    }
  }
}