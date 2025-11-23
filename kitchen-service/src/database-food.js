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
async function addFoodToTodayMenu(menuData) {
  const { food_id, cost, portions_available } = menuData;
  try {
    const result = await pool.query(
      `INSERT INTO today_menu (food_id, cost, portions_available)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [food_id, cost, portions_available]
    );
    return result.rows[0];
  }
    catch (error) {
    console.error('Error adding food to today menu:', error);
    throw error;
    }
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
  try {
    const result = await pool.query(
      `UPDATE today_menu
        SET portions_available = portions_available - $1
        WHERE food_id = $2
        RETURNING *`,
      [amount, foodId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error decreasing food portions in today menu:', error);
    throw error;
  }
}

//Navýšení porcí jídla v dnešním menu
async function increaseTodayMenuFoodPortions(foodId, amount) {
  try {
    const result = await pool.query(
      `UPDATE today_menu
        SET portions_available = portions_available + $1
        WHERE food_id = $2
        RETURNING *`,
      [amount, foodId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error increasing food portions in today menu:', error);
    throw error;
  }
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
  increaseTodayMenuFoodPortions,
  deleteAllTodayMenu
};