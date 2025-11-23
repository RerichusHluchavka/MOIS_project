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
cells table schema:
- cell_id SERIAL PRIMARY KEY,
- cell_number integer,
- type_id integer foreign key references cell_type(type_id),
- capacity integer,
- block varchar


cell_type table schema:
- type_id SERIAL PRIMARY KEY,
- type_name varchar,
- security_level integer
*/

// CRUD operace pro cely

// Získání všech cel
async function getAllCells() {
  try {
    const result = await pool.query('SELECT * FROM cells ORDER BY cell_id;');
    return result.rows;
    } catch (error) {
    console.error('Error getting cells:', error);
    throw error;
    }
}

// Získání cely podle ID
async function getCellById(cellId) {
  try {
    const result = await pool.query(
        `SELECT c.cell_id, c.cell_number, ct.type_name, c.capacity, c.block
            FROM cells c
            JOIN cell_type ct ON c.type_id = ct.type_id
            WHERE c.cell_id = $1;`,
        [cellId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting cell by ID:', error);
    throw error;
  }
}

// Vytvoření nové cely
async function createCell(cellData) {
  const { cell_number, type_id, capacity, block } = cellData;
  try {
    const result = await pool.query(
      `INSERT INTO cells (cell_number, type_id, capacity, block)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [cell_number, type_id, capacity, block]
    );
    return result.rows[0];
  }
  catch (error) {
    console.error('Error creating cell:', error);
    throw error;
  }
}

// Odstranění cely
async function deleteCell(cellId) {
  try {
    const result = await pool.query(
      'DELETE FROM cells WHERE cell_id = $1 RETURNING *;',
      [cellId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting cell:', error);
    throw error;
  }
}

// CRUD operace pro typy cel

// Získání všech typů cel
async function getAllCellTypes() {
  try {
    const result = await pool.query('SELECT * FROM cell_type ORDER BY type_id;');
    return result.rows;
    } catch (error) {
    console.error('Error getting cell types:', error);
    throw error;
    }
}

// Získání typu cely podle ID
async function getCellTypeById(typeId) {
  try {
    const result = await pool.query(
        'SELECT * FROM cell_type WHERE type_id = $1;',
        [typeId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting cell type by ID:', error);
    throw error;
  }
}

// Vytvoření nového typu cely
async function createCellType(typeData) {
  const { type_name, security_level } = typeData; 
  try {
    const result = await pool.query(
      `INSERT INTO cell_type (type_name, security_level)
        VALUES ($1, $2)
        RETURNING *`,
      [type_name, security_level]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating cell type:', error);
    throw error;
  }
}

// Odstranění typu cely
async function deleteCellType(typeId) {
  try {
    const result = await pool.query(
      'DELETE FROM cell_type WHERE type_id = $1 RETURNING *;',
      [typeId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting cell type:', error);
    throw error;
  }
}

// Iformace o cele vězně

// Získání cely vězně podle ID vězně
async function getCellByPrisonerId(prisonerId) {
  try {
    const result = await pool.query(
        `SELECT c.cell_id, c.cell_number, ct.type_name, c.capacity, c.block
            FROM cells c
            JOIN cell_type ct ON c.type_id = ct.type_id
            JOIN prisoners p ON p.cell_id = c.cell_id
            WHERE p.prisoner_id = $1;`,
        [prisonerId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting cell by prisoner ID:', error);
    throw error;
  }
}


module.exports = {
  getAllCells,
  getCellById,
  createCell,
  deleteCell,
  getAllCellTypes,
  getCellTypeById,
  createCellType,
  deleteCellType,
  getCellByPrisonerId
};