const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'inventory-db',
  database: process.env.DB_NAME || 'inventory_db',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL inventory_db');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

/*
items table schema:
- item_id SERIAL PRIMARY KEY,
- name varchar,
- unit varchar,
- quantity integer

storage table schema:
- storage_id SERIAL PRIMARY KEY,
- storage_type  varchar,
- sector varchar
*/


// CRDU operace pro itemy

// Získání všech itemů
async function getAllItems() {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY item_id;');
    return result.rows;
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
}

// Získání itemu podle ID
async function getItemById(itemId) {
  try {
    const result = await pool.query(
      'SELECT * FROM items WHERE item_id = $1;',
      [itemId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting item by ID:', error);
    throw error;
  }
}

// Vytvoření nového itemu
async function createItem(itemData) {
  const { name, unit, quantity } = itemData;
  try {
    const result = await pool.query(
      `INSERT INTO items (name, unit, quantity)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [name, unit, quantity || 0]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

// Aktualizace itemu
async function updateItem(itemId, itemData) {
  const { name, unit, quantity } = itemData;
  try {
    const result = await pool.query(
      `UPDATE items
        SET name = $1, unit = $2, quantity = $3
        WHERE item_id = $4
        RETURNING *`,
      [name, unit, quantity, itemId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

// Odstranění itemu
async function deleteItem(itemId) {
  try {
    const result = await pool.query(
      'DELETE FROM items WHERE item_id = $1 RETURNING *;',
      [itemId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

// CRUD operace pro storage

// Získání všech storage
async function getAllStorages() {
  try {
    const result = await pool.query('SELECT * FROM storage ORDER BY storage_id;');
    return result.rows;
    } catch (error) {
    console.error('Error getting storages:', error);
    throw error;
    }
}
// Získání storage podle ID
async function getStorageById(storageId) {
  try {
    const result = await pool.query(
      'SELECT * FROM storage WHERE storage_id = $1;',
      [storageId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting storage by ID:', error);
    throw error;
  }
}

// Vytvoření nové storage
async function createStorage(storageData) {
  const { storage_type, sector } = storageData;
  try {
    const result = await pool.query(
      `INSERT INTO storage (storage_type, sector)
        VALUES ($1, $2)
        RETURNING *`,
      [storage_type, sector]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating storage:', error);
    throw error;
  }
}

// Aktualizace storage
async function updateStorage(storageId, storageData) {
  const { storage_type, sector } = storageData;
  try {
    const result = await pool.query(
      `UPDATE storage
        SET storage_type = $1, sector = $2
        WHERE storage_id = $3
        RETURNING *`,
      [storage_type, sector, storageId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating storage:', error);
    throw error;
  }
}

// Odstranění storage
async function deleteStorage(storageId) {
  try {
    const result = await pool.query(
      'DELETE FROM storage WHERE storage_id = $1 RETURNING *;',
      [storageId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting storage:', error);
    throw error;
  }
}


module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getAllStorages,
  getStorageById,
  createStorage,
  updateStorage,
  deleteStorage
};