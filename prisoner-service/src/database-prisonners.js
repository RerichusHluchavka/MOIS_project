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
prisoners table schema:
- prisoner_id SERIAL PRIMARY KEY,
- first_name varchar
- last_name varchar
- credits integer
- cell_id integer foreign key references cells(cell_id)
- entry_date date
- release_date date
- danger_level integer
- religion varchar
*/

//CRUD operace pro vězně

// Získání vězně podle ID
async function getPrisonerById(id) {
  try {
    const result = await pool.query('SELECT * FROM prisoners WHERE prisoner_id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting prisoner:', error);
    throw error;
  }
}

// Získání všech vězňů
async function getAllPrisoners() {
  try {
    const result = await pool.query('SELECT * FROM prisoners ORDER BY prisoner_id');
    return result.rows;
  } catch (error) {
    console.error('Error getting prisoners:', error);
    throw error;
  }
}


// Vytvoření nového vězně
async function createPrisoner(prisonerData) {
  const { first_name, last_name, credits, cell_id, entry_date, release_date, danger_level, religion } = prisonerData;
  try {
    const result = await pool.query(
      `INSERT INTO prisoners
        (first_name, last_name, credits, cell_id, entry_date, release_date, danger_level, religion)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
      [first_name, last_name, credits || 0, cell_id, entry_date, release_date, danger_level, religion]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating prisoner:', error);
    throw error;
  }
}

// Aktualizace vězně
async function updatePrisoner(id, prisonerData) {
  const { first_name, last_name, credits, cell_id, entry_date, release_date, danger_level, religion } = prisonerData;
  
  try {
    // First, get current values for fields that aren't provided
    const current = await pool.query(
      'SELECT * FROM prisoners WHERE prisoner_id = $1', 
      [id]
    );
    
    if (current.rows.length === 0) {
      throw new Error('Prisoner not found');
    }

    const currentData = current.rows[0];
    
    const result = await pool.query(
      `UPDATE prisoners
       SET first_name = $1, last_name = $2, credits = $3, cell_id = $4, entry_date = $5, release_date = $6, danger_level = $7, religion = $8
       WHERE prisoner_id = $9
       RETURNING *`,
      [
        first_name !== undefined ? first_name : currentData.first_name,
        last_name !== undefined ? last_name : currentData.last_name,
        credits !== undefined ? credits : currentData.credits,
        cell_id !== undefined ? cell_id : currentData.cell_id,
        entry_date !== undefined ? entry_date : currentData.entry_date,
        release_date !== undefined ? release_date : currentData.release_date,
        danger_level !== undefined ? danger_level : currentData.danger_level,
        religion !== undefined ? religion : currentData.religion,
        id
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating prisoner:', error);
    throw error;
  }
}

//odstranění vězně
async function deletePrisoner(id) {
  try {
    const result = await pool.query('DELETE FROM prisoners WHERE prisoner_id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting prisoner:', error);
    throw error;
  }
}

// Creditové operace pro vězně

// Kredity vězně
async function getPrisonerCredit(id) {
  try {
    const result = await pool.query(
      'SELECT credits FROM prisoners WHERE prisoner_id = $1',
      [id]
    );
    return result.rows[0] ? result.rows[0].credits : null;
  } catch (error) {
    console.error('Error getting prisoner credit:', error);
    throw error;
  }
}

// Navýšení kreditu vězně
async function increasePrisonerCredit(id, amount) {
  try {
    const result = await pool.query(
      `UPDATE prisoners
        SET credits = credits + $1
        WHERE prisoner_id = $2
        RETURNING *`,
      [amount, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error increasing prisoner credit:', error);
    throw error;
  }
}

// Odečtení kreditu vězně
async function decreasePrisonerCredit(id, amount) {
  try {
    const result = await pool.query(
      `UPDATE prisoners
        SET credits = credits - $1
        WHERE prisoner_id = $2
        RETURNING *`,
      [amount, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error decreasing prisoner credit:', error);
    throw error;
  }
}



module.exports = {
  pool,
  getPrisonerById,
  getAllPrisoners,
  createPrisoner,
  updatePrisoner,
  deletePrisoner,
  getPrisonerCredit,
  increasePrisonerCredit,
  decreasePrisonerCredit
};