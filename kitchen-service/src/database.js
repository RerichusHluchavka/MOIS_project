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

// Získání vězně podle ID
async function getPrisonerById(id) {
  try {
    const result = await pool.query('SELECT * FROM prisoners WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting prisoner:', error);
    throw error;
  }
}

// Získání všech vězňů
async function getAllPrisoners() {
  try {
    const result = await pool.query('SELECT * FROM prisoners ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error getting prisoners:', error);
    throw error;
  }
}

// Vytvoření nového vězně
// ID - auto increment v DB
//TODO: upravit podle změn v schématu DB
async function createPrisoner(prisonerData) {
  const { name, credit } = prisonerData;
  
  try {
    const result = await pool.query(
      `INSERT INTO prisoners ( name, credit) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name, credit || 0]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating prisoner:', error);
    throw error;
  }
}

// Aktualizaci vězně
async function updatePrisoner(id, prisonerData) {
  const { name, credit } = prisonerData;
  
  try {
    const result = await pool.query(
      `UPDATE prisoners 
       SET name = $1, credit = $2 
       WHERE id = $3 
       RETURNING *`,
      [name, credit || 0, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating prisoner:', error);
    throw error;
  }
}

module.exports = {
  pool,
  getPrisonerById,
  getAllPrisoners,
  createPrisoner,
  updatePrisoner
};