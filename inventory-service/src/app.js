const express = require('express');
const { authenticateToken } = require('../auth-middleware');
const { createRouteHandler } = require('./routeHandler');



const { 
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
} = require('./database-items-storage');



const app = express();
const PORT = process.env.PORT || 3002;

//Middleware
app.use(express.json());

// Routes pro items

// GET - všechny itemy
app.get('/items', authenticateToken(['admin', 'inventory', 'kitchen']), 
  createRouteHandler({
    getDataFn: () => getAllItems(),
    notFoundError: 'No items found',
    serverError: 'Failed to fetch items',
    includeCount: true
  })
);

// GET - informace o itemu podle ID
app.get('/items/:id', authenticateToken(['admin', 'inventory', 'kitchen']), 
  createRouteHandler({
    getDataFn: (req) => getItemById(req.params.id),
    notFoundError: 'Item not found',
    serverError: 'Failed to fetch item'
  })
);

// POST - vytvoření nového itemu
app.post('/items', authenticateToken(['admin', 'inventory']), 
  createRouteHandler({
    getDataFn: (req) => createItem(req.body),
    serverError: 'Failed to create item',
    successMessage: 'Item created successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// PUT - aktualizace itemu
app.put('/items/:id', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => updateItem(req.params.id, req.body),
    notFoundError: 'Item not found',
    serverError: 'Failed to update item',
    successMessage: 'Item updated successfully'
  })
);

// DELETE - smazání itemu
app.delete('/items/:id', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => deleteItem(req.params.id),
    notFoundError: 'Item not found',
    serverError: 'Failed to delete item',
    successMessage: 'Item deleted successfully',
    skipNotFoundCheck: true
  })
);

// Routes pro storages

// GET - všechny storage
app.get('/storages', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: () => getAllStorages(),
    notFoundError: 'No storages found',
    serverError: 'Failed to fetch storages',
    includeCount: true
  })
);

// GET - informace o storage podle ID
app.get('/storages/:id', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => getStorageById(req.params.id),
    notFoundError: 'Storage not found',
    serverError: 'Failed to fetch storage'
  })
);

// POST - vytvoření nové storage
app.post('/storages', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => createStorage(req.body),
    serverError: 'Failed to create storage',
    successMessage: 'Storage created successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// PUT - aktualizace storage
app.put('/storages/:id', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => updateStorage(req.params.id, req.body),
    notFoundError: 'Storage not found',
    serverError: 'Failed to update storage',
    successMessage: 'Storage updated successfully'
  })
);

// DELETE - smazání storage
app.delete('/storages/:id', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => deleteStorage(req.params.id),
    notFoundError: 'Storage not found',
    serverError: 'Failed to delete storage',
    successMessage: 'Storage deleted successfully',
    skipNotFoundCheck: true
  })
);

const{
  getAllStoring,
  getStoringByStorageId,
  getStoringByItemId,
  getTotalItemQuantity,
  addStoringRecord,
  deleteStoringRecord,
  increaseItemVolume,
  decreaseItemVolume
} = require('./database-storing');

// Routes pro storing

// GET - všechny storing záznamy
app.get('/storing', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: () => getAllStoring(),
    notFoundError: 'No storing records found',
    serverError: 'Failed to fetch storing records',
    includeCount: true
  })
);

// GET - storing záznamy podle storage ID
app.get('/storing/storage/:storageId', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => getStoringByStorageId(req.params.storageId),
    notFoundError: 'No storing records found for this storage',
    serverError: 'Failed to fetch storing records for this storage',
    includeCount: true
  })
);

// GET - storing záznamy podle item ID
app.get('/storing/item/:itemId', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => getStoringByItemId(req.params.itemId),
    notFoundError: 'No storing records found for this item',
    serverError: 'Failed to fetch storing records for this item',
    includeCount: true
  })
);

// GET - celkové množství konkrétního itemu napříč všemi storage
app.get('/storing/item/:itemId/total', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => getTotalItemQuantity(req.params.itemId),
    notFoundError: 'No quantity found for this item',
    serverError: 'Failed to fetch total quantity for this item'
  })
);

// POST - přidání nového storing záznamu
app.post('/storing', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => addStoringRecord(req.body),
    serverError: 'Failed to add storing record',
    successMessage: 'Storing record added successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - smazání storing záznamu
app.delete('/storing/storage/:storageId/item/:itemId', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => deleteStoringRecord(req.params.storageId, req.params.itemId),
    notFoundError: 'Storing record not found',
    serverError: 'Failed to delete storing record',
    successMessage: 'Storing record deleted successfully',
    skipNotFoundCheck: true
  })
);

// PATCH - zvýšení množství itemu ve storing záznamu
app.patch('/storing/storage/:storageId/item/:itemId/increase', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => increaseItemVolume(req.params.storageId, req.params.itemId, req.body.volume),
    notFoundError: 'Storing record not found',
    serverError: 'Failed to increase item volume',
    successMessage: 'Item volume increased successfully'
  })
);

// PATCH - snížení množství itemu ve storing záznamu
app.patch('/storing/storage/:storageId/item/:itemId/decrease', authenticateToken(['admin', 'inventory']),
  createRouteHandler({
    getDataFn: (req) => decreaseItemVolume(req.params.storageId, req.params.itemId, req.body.volume),
    notFoundError: 'Storing record not found',
    serverError: 'Failed to decrease item volume',
    successMessage: 'Item volume decreased successfully'
  })
);


app.get('/health', (req, res) => {
  res.json({ status: 'Inventory service OK' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Inventory service running on http://0.0.0.0:${PORT}`);
  console.log(`📊 PostgreSQL: inventory_db`);
});