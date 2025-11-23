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
ingredients table schema:
- ingredient_id SERIAL PRIMARY KEY,
- name varchar
*/

// CRUD operace pro ingredience

// Získání všech ingrediencí
async function getAllIngredients() {
  try {
    const result = await pool.query('SELECT * FROM ingredients ORDER BY ingredient_id;');
    return result.rows;
    } catch (error) {
    console.error('Error getting ingredients:', error);
    throw error;
    }
}

// Získání ingredience podle ID
async function getIngredientById(ingredientId) {
  try {
    const result = await pool.query(
        'SELECT * FROM ingredients WHERE ingredient_id = $1;',
        [ingredientId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting ingredient by ID:', error);
    throw error;
  }
}

// Vytvoření nové ingredience
async function createIngredient(ingredientData) {
  const { name } = ingredientData;
    try {
    const result = await pool.query(
        'INSERT INTO ingredients (name) VALUES ($1) RETURNING *;',
        [name]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating ingredient:', error);
    throw error;
  }
}

// Smazání ingredience podle ID
async function deleteIngredientById(ingredientId) {
  try {
    const result = await pool.query(
      'DELETE FROM ingredients WHERE ingredient_id = $1 RETURNING *;',
      [ingredientId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting ingredient by ID:', error);
    throw error;
  }
}

/*
food_ingredients table schema:
- ingredient_id integer REFERENCES ingredients(ingredient_id),
- food_id integer REFERENCES food(food_id),
- unit varchar,
- portion_amount integer
*/

// Získání ingrediencí pro dané jídlo podle ID jídla
async function getIngredientsByFoodId(foodId) {
  try {
    const result = await pool.query(
      `SELECT fi.*, i.name
       FROM food_ingredients fi
       JOIN ingredients i ON fi.ingredient_id = i.ingredient_id
       WHERE fi.food_id = $1;`,
        [foodId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting ingredients for food:', error);
    throw error;
  }
}

// Přidání ingredience k jídlu
async function addIngredientToFood(foodId, ingredientId, unit, portionAmount) {
  try {
    const result = await pool.query(
      `INSERT INTO food_ingredients (food_id, ingredient_id, unit, portion_amount)
       VALUES ($1, $2, $3, $4)
         RETURNING *;`,
        [foodId, ingredientId, unit, portionAmount]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding ingredient to food:', error);
    throw error;
  }
}

// Odebrání ingredience z jídla
async function removeIngredientFromFood(foodId, ingredientId) {
  try {
    const result = await pool.query(
      `DELETE FROM food_ingredients
       WHERE food_id = $1 AND ingredient_id = $2
            RETURNING *;`,
        [foodId, ingredientId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error removing ingredient from food:', error);
    throw error;
  }
}

//Aktualizace portion amount ingredience v jídle
async function updateIngredientPortionInFood(foodId, ingredientId, newPortionAmount) {
  try {
    const result = await pool.query(
      `UPDATE food_ingredients
       SET portion_amount = $3
         WHERE food_id = $1 AND ingredient_id = $2
            RETURNING *;`,
        [foodId, ingredientId, newPortionAmount]
    );
    return result.rows[0];
    } catch (error) {
    console.error('Error updating ingredient portion in food:', error);
    throw error;
    }
}

// Aktualizace jednotky ingredience v jídle
async function updateIngredientUnitInFood(foodId, ingredientId, newUnit) {
  try {
    const result = await pool.query(
        `UPDATE food_ingredients
            SET unit = $3
            WHERE food_id = $1 AND ingredient_id = $2
            RETURNING *;`,
        [foodId, ingredientId, newUnit]
    );
    return result.rows[0];
    } catch (error) {
    console.error('Error updating ingredient unit in food:', error);
    throw error;
    }
}

module.exports = {
    getAllIngredients,
    getIngredientById,
    createIngredient,
    deleteIngredientById,
    getIngredientsByFoodId,
    addIngredientToFood,
    removeIngredientFromFood,
    updateIngredientPortionInFood,
    updateIngredientUnitInFood
};