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
  }  catch (error) {
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

module.exports = {
getAllAllergens,
getAllergenById,
createAllergen,
deleteAllergenById,
getAllergensByIngredientId,
addAllergenToIngredient,
removeAllergenFromIngredient,
getIngredientsByAllergenId
};