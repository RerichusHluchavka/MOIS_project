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

// Funkce pro získání všech položek
async function getAllItems() {
  try {
    const result = await pool.query('SELECT * FROM inventory_items ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error getting inventory items:', error);
    throw error;
  }
}

// Funkce pro získání položky podle ID
async function getItemById(id) {
  try {
    const result = await pool.query('SELECT * FROM inventory_items WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting inventory item:', error);
    throw error;
  }
}

// Funkce pro vytvoření nové položky
async function createItem(itemData) {
  const { name, quantity } = itemData;
  
  try {
    const result = await pool.query(
      `INSERT INTO inventory_items (name, quantity) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name, quantity || 0]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
}

// Funkce pro aktualizaci položky
async function updateItem(id, itemData) {
  const { name, quantity } = itemData;
  
  try {
    const result = await pool.query(
      `UPDATE inventory_items 
       SET name = $1, quantity = $2 
       WHERE id = $3 
       RETURNING *`,
      [name, quantity, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
}

// Funkce pro smazání položky
async function deleteItem(id) {
  try {
    const result = await pool.query('DELETE FROM inventory_items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}

// Funkce pro zvýšení množství položky
async function increaseQuantity(id, amount) {
  try {
    const result = await pool.query(
      `UPDATE inventory_items 
       SET quantity = quantity + $1 
       WHERE id = $2 
       RETURNING *`,
      [amount, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error increasing item quantity:', error);
    throw error;
  }
}

// Funkce pro snížení množství položky
async function decreaseQuantity(id, amount) {
  try {
    const result = await pool.query(
      `UPDATE inventory_items 
       SET quantity = quantity - $1 
       WHERE id = $2 
       RETURNING *`,
      [amount, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error decreasing item quantity:', error);
    throw error;
  }
}

module.exports = {
  pool,
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  increaseQuantity,
  decreaseQuantity
};