const express = require('express');
const cors = require('cors');
const { 
  getAllItems, 
  getItemById, 
  createItem, 
  updateItem,
  deleteItem,
  increaseQuantity,
  decreaseQuantity
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET - všechny položky
app.get('/inventory', async (req, res) => {
  try {
    const items = await getAllItems();
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory items'
    });
  }
});

// GET - položka podle ID
app.get('/inventory/:id', async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory item'
    });
  }
});

// POST - vytvoř novou položku
app.post('/inventory', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    
    // Validace povinných polí
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: name'
      });
    }
    
    const newItem = await createItem({
      name,
      quantity: quantity || 0
    });
    
    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Inventory item created successfully'
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create inventory item'
    });
  }
});

// PUT - aktualizuj položku
app.put('/inventory/:id', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    
    const updatedItem = await updateItem(req.params.id, {
      name,
      quantity
    });
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedItem,
      message: 'Inventory item updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update inventory item'
    });
  }
});

// DELETE - smaž položku
app.delete('/inventory/:id', async (req, res) => {
  try {
    const deletedItem = await deleteItem(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: deletedItem,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete inventory item'
    });
  }
});

// PATCH - zvýš množství
app.patch('/inventory/:id/increase', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number'
      });
    }
    
    const updatedItem = await increaseQuantity(req.params.id, amount);
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedItem,
      message: `Quantity increased by ${amount}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to increase quantity'
    });
  }
});

// PATCH - sniž množství
app.patch('/inventory/:id/decrease', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number'
      });
    }
    
    const updatedItem = await decreaseQuantity(req.params.id, amount);
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedItem,
      message: `Quantity decreased by ${amount}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to decrease quantity'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'inventory-service',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Inventory Service is working!',
    endpoints: {
      'GET /health': 'Service health check',
      'GET /inventory': 'Get all inventory items',
      'GET /inventory/:id': 'Get specific item',
      'POST /inventory': 'Create new item',
      'PUT /inventory/:id': 'Update item',
      'DELETE /inventory/:id': 'Delete item',
      'PATCH /inventory/:id/increase': 'Increase quantity',
      'PATCH /inventory/:id/decrease': 'Decrease quantity'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Inventory service running on http://0.0.0.0:${PORT}`);
  console.log(`📊 PostgreSQL: inventory_db`);
});