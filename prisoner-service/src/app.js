const express = require('express');
const cors = require('cors');

const { 
  getAllPrisoners, 
  getPrisonerById, 
  createPrisoner, 
  updatePrisoner 
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET - všechny vězně
app.get('/prisoners', async (req, res) => {
  try {
    const prisoners = await getAllPrisoners();
    res.json({
      success: true,
      data: prisoners,
      count: prisoners.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prisoners'
    });
  }
});

// GET - vězeň podle ID
app.get('/prisoners/:id', async (req, res) => {
  try {
    const prisoner = await getPrisonerById(req.params.id);
    
    if (!prisoner) {
      return res.status(404).json({
        success: false,
        error: 'Prisoner not found'
      });
    }
    
    res.json({
      success: true,
      data: prisoner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prisoner'
    });
  }
});

// POST - vytvoř nového vězně
app.post('/prisoners', async (req, res) => {
  try {
    const { name, credit } = req.body;
    
    // Validace povinných polí
    if (!name || !credit) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields:  name or credit'
      });
    }
    
    const newPrisoner = await createPrisoner({
      name,
      credit
    });
    
    res.status(201).json({
      success: true,
      data: newPrisoner,
      message: 'Prisoner created successfully'
    });
  } catch (error) {
    if (error.code === '23505') { // unique violation
      res.status(400).json({
        success: false,
        error: 'Prisoner with this ID already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create prisoner'
      });
    }
  }
});

// PUT - aktualizuj vězně
app.put('/prisoners/:id', async (req, res) => {
  try {
    const { name, credit } = req.body;
    
    const updatedPrisoner = await updatePrisoner(req.params.id, {
      name,
      credit
    });
    
    if (!updatedPrisoner) {
      return res.status(404).json({
        success: false,
        error: 'Prisoner not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedPrisoner,
      message: 'Prisoner updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update prisoner'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'prisoner-service',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Prisoner service running on port http://0.0.0.0:${PORT}`);
  console.log(`PostgreSQL: prisoner_db`);
});