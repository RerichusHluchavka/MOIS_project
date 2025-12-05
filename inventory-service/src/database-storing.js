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

async function executeInTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Spustí callback funkci a předá jí klienta.
    // Zde se provede vaše specifická logika (např. UPDATE, SELECT).
    const result = await callback(client);

    await client.query('COMMIT');
    return result;

  } catch (error) {
    // Pokud dojde k chybě v callbacku nebo při COMMIT, provedeme ROLLBACK.
    await client.query('ROLLBACK');
    console.error('Database transaction rolled back due to error:', error.message);
    throw error; // Znovu vyhodit chybu, aby se o ní dozvěděla volající funkce

  } finally {
    // Klient je vždy uvolněn zpět do poolu.
    client.release();
  }
}

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
  const updateRow = await executeInTransaction(async (client) => {

      const result = await client.query(
        `UPDATE storing
        SET volume = volume + $1
        WHERE storage_id = $2 AND item_id = $3
        AND $1 >= 0
        RETURNING *`,
        [amount, storageId, itemId]
      );
      return result.rows[0];

  })
  return updateRow;
}

// Odečtení množství itemu v konkrétní storage
async function decreaseItemVolume(storageId, itemId, amount) {
  const updateRow = await executeInTransaction(async (client) => {

    const result = await client.query(
      `UPDATE storing
        SET volume = volume - $1
        WHERE storage_id = $2 AND item_id = $3
        AND volume >= $1
        RETURNING *`,
      [amount, storageId, itemId]
    );

    if (result.rowCount === 0) {
      throw new Error('Insufficient stock or item not found.');
    }

    return result.rows[0];
  })
  return updateRow;
}

module.exports = {
  getAllStoring,
  getStoringByStorageId,
  getStoringByItemId,
  getTotalItemQuantity,
  addStoringRecord,
  deleteStoringRecord,
  increaseItemVolume,
  decreaseItemVolume,
  decreaseInventoryAcrossStorages
};

async function decreaseInventoryAcrossStorages(itemId, amountToDecrease) {
    if (amountToDecrease <= 0) {
        throw new HttpError("Amount to decrease must be greater than zero.", 400);
    }

    // Celou operaci obalíme do transakce pro zajištění atomicity
    return executeInTransaction(async (client) => {
        let remainingAmount = amountToDecrease;
        
        // 1. Získání a zamykání relevantních záznamů
        // Zde použijeme SELECT FOR UPDATE, abychom zamkli všechny relevantní záznamy 
        // a zabránili souběžným změnám. Řadíme podle storage_id (nebo jiného kritéria).
        const result = await client.query(
            `SELECT storage_id, volume, item_id
             FROM storing
             WHERE item_id = $1 AND volume > 0
             ORDER BY storage_id ASC
             FOR UPDATE;`, // Zamykání řádků do konce transakce
            [itemId]
        );

        const storageRecords = result.rows;

        // 2. Kontrola celkové dostupnosti (jednoduchá agregace na straně serveru)
        const totalAvailable = storageRecords.reduce((sum, record) => sum + record.volume, 0);

        if (totalAvailable < amountToDecrease) {
            // Chyba: Nedostatečné zásoby. Spustí se ROLLBACK.
            throw new HttpError(`Insufficient total inventory for item ID ${itemId}. Requested: ${amountToDecrease}, Available: ${totalAvailable}`, 409);
        }

        const updatedRecords = [];

        // 3. Postupné odebírání ze záznamů
        for (const record of storageRecords) {
            if (remainingAmount <= 0) break; // Pokud jsme již odebrali vše, ukončíme cyklus

            const amountToTake = Math.min(record.volume, remainingAmount); // Vezmi menší z: co je k dispozici vs. co potřebujeme
            const newVolume = record.volume - amountToTake;

            // A. UPDATE aktuálního záznamu
            const updateResult = await client.query(
                `UPDATE storing
                 SET volume = $1
                 WHERE storage_id = $2 AND item_id = $3
                 RETURNING storage_id, volume;`,
                [newVolume, record.storage_id, itemId]
            );

            remainingAmount -= amountToTake; // Snížíme zbývající potřebné množství
            updatedRecords.push(updateResult.rows[0]);
        }
        
        // Funkce executeInTransaction se postará o COMMIT, protože nedošlo k vyhození chyby.
        return updatedRecords;
    });
}