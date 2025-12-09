const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'prisoner-db',
  database: process.env.DB_NAME || 'prisoner_db',
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

prisoner_allergens table schema:
- prisoner_id integer foreign key references prisoners(prisoner_id),
- allergen_id integer foreign key references allergens(allergen_id),
- severity varchar - low, Medium, High
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

// Získání alergenů pro vězně podle ID vězně
async function getAllergensByPrisonerId(prisonerId) {
  try {
    const result = await pool.query(
      `SELECT a.allergen_id, a.allergen_name, pa.severity
       FROM allergens a
       JOIN prisoner_allergens pa ON a.allergen_id = pa.allergen_id
       WHERE pa.prisoner_id = $1
       ORDER BY a.allergen_id;`,
      [prisonerId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting allergens for prisoner:', error);
    throw error;
  }
}

// Přidání nového alergenu pro vězně
async function addAllergenToPrisoner(prisonerId, allergenId, severity) {
  try {
    const result = await pool.query(
      `INSERT INTO prisoner_allergens (prisoner_id, allergen_id, severity)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [prisonerId, allergenId, severity]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding allergen to prisoner:', error);
    throw error;
  }
}

// Odebrání alergenu od vězně
async function removeAllergenFromPrisoner(prisonerId, allergenId) {
  try {
    const result = await pool.query(
      `DELETE FROM prisoner_allergens
       WHERE prisoner_id = $1 AND allergen_id = $2
       RETURNING *;`,
      [prisonerId, allergenId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error removing allergen from prisoner:', error);
    throw error;
  }
}

module.exports = {
  getAllAllergens,
  getAllergensByPrisonerId,
  addAllergenToPrisoner,
  removeAllergenFromPrisoner
};
