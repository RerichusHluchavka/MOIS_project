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
storing table schema:
- stoagege_id integer foreign key references storage(storage_id),
- item_id integer foreign key references items(item_id),
- volume integer,
- consumption_date date
*/

// CRUD operace pro storing

// Získání všech storing záznamů
async function getAllStoring() {
  try {
    const result = await pool.query('SELECT * FROM storing ORDER BY storage_id, item_id;');
    return result.rows;
    } catch (error) {
    console.error('Error getting storing records:', error);
    throw error;
    }
}

// Získání všech storing záznamů pro konkrétní storage ID
async function getStoringByStorageId(storageId) {
  try {
    const result = await pool.query(
      'SELECT * FROM storing WHERE storage_id = $1 ORDER BY item_id;',
      [storageId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting storing records by storage ID:', error);
    throw error;
  }
}

// získání všech storing záznamů pro konkrétní item ID
async function getStoringByItemId(itemId) {
  try {
    const result = await pool.query(
      'SELECT * FROM storing WHERE item_id = $1 ORDER BY storage_id;',
      [itemId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting storing records by item ID:', error);
    throw error;
  }
}

// získání celkového množství konkrétního itemu ve všech storage, včetně jednotky itemu 
async function getTotalItemQuantity(itemId) {
  try {
    const result = await pool.query(
      `SELECT SUM(s.volume) AS total_quantity, i.unit
        FROM storing s
        JOIN items i ON s.item_id = i.item_id
        WHERE s.item_id = $1
        GROUP BY i.unit;`,
      [itemId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error getting total item quantity:', error);
    throw error;
  }
}

// Přidání nového storing záznamu
async function addStoringRecord(storingData) {
  const { storage_id, item_id, volume, consumption_date } = storingData;
  try {
    const result = await pool.query(
      `INSERT INTO storing (storage_id, item_id, volume, consumption_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [storage_id, item_id, volume, consumption_date]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding storing record:', error);
    throw error;
  }
}

// Odstranění storing záznamu
async function deleteStoringRecord(storageId, itemId) {
  try {
    const result = await pool.query(
      'DELETE FROM storing WHERE storage_id = $1 AND item_id = $2 RETURNING *;',
      [storageId, itemId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting storing record:', error);
    throw error;
  }
}

// Navýšení množství itemu v konkrétní storage
async function increaseItemVolume(storageId, itemId, amount) {
  try {
    const result = await pool.query(
      `UPDATE storing
        SET volume = volume + $1
        WHERE storage_id = $2 AND item_id = $3
        RETURNING *`,
      [amount, storageId, itemId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error increasing item volume:', error);
    throw error;
  }
}

// Odečtení množství itemu v konkrétní storage
async function decreaseItemVolume(storageId, itemId, amount) {
  try {
    const result = await pool.query(
      `UPDATE storing
        SET volume = volume - $1
        WHERE storage_id = $2 AND item_id = $3
        RETURNING *`,
      [amount, storageId, itemId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error decreasing item volume:', error);
    throw error;
  }
}

module.exports = {
    getAllStoring,
    getStoringByStorageId,
    getStoringByItemId,
    getTotalItemQuantity,
    addStoringRecord,
    deleteStoringRecord,
    increaseItemVolume,
    decreaseItemVolume
};