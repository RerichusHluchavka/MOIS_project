const express = require('express');
const { authenticateToken } = require('../auth-middleware');
const { createRouteHandler } = require('./routeHandler');

const { 
  getPrisonerById,
  getAllPrisoners,
  createPrisoner,
  updatePrisoner,
  deletePrisoner,
  getPrisonerCredit,
  increasePrisonerCredit,
  decreasePrisonerCredit
} = require('./database-prisonners');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes for prisoners

// GET - všichni vězni
app.get('/prisoners', authenticateToken(['admin', 'prison']), 
  createRouteHandler({
    getDataFn: () => getAllPrisoners(),
    notFoundError: 'No prisoners found',
    serverError: 'Failed to fetch prisoners',
    includeCount: true
  })
);

// GET - informace o vězni podle ID
app.get('/prisoners/:id', authenticateToken(['admin', 'prison']), 
  createRouteHandler({
    getDataFn: (req) => getPrisonerById(req.params.id),
    notFoundError: 'Prisoner not found',
    serverError: 'Failed to fetch prisoner'
  })
);

// POST - vytvoření nového vězně
app.post('/prisoners', authenticateToken(['admin', 'prison']), 
  createRouteHandler({
    getDataFn: (req) => createPrisoner(req.body),
    serverError: 'Failed to create prisoner',
    successMessage: 'Prisoner created successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// PUT - aktualizace vězně
app.put('/prisoners/:id', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => updatePrisoner(req.params.id, req.body),
    notFoundError: 'Prisoner not found',
    serverError: 'Failed to update prisoner',
    successMessage: 'Prisoner updated successfully'
  })
);

// DELETE - odstranění vězně
app.delete('/prisoners/:id', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => deletePrisoner(req.params.id),
    notFoundError: 'Prisoner not found',
    serverError: 'Failed to delete prisoner',
    successMessage: 'Prisoner deleted successfully',
    skipNotFoundCheck: true
  })
);

// GET - kredit vězně
app.get('/prisoners/:id/credit', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => getPrisonerCredit(req.params.id),
    notFoundError: 'Prisoner not found',
    serverError: 'Failed to fetch prisoner credit'
  })
);

// PATCH - zvýšení kreditu vězně
app.patch('/prisoners/:id/credit/increase', authenticateToken(['admin', 'prison', 'payment']),
  createRouteHandler({
    getDataFn: (req) => increasePrisonerCredit(req.params.id, req.body.amount),
    notFoundError: 'Prisoner not found',
    serverError: 'Failed to increase prisoner credit',
    successMessage: 'Prisoner credit increased successfully'
  })
);

// PATCH - snížení kreditu vězně
app.patch('/prisoners/:id/credit/decrease', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => decreasePrisonerCredit(req.params.id, req.body.amount),
    notFoundError: 'Prisoner not found',
    serverError: 'Failed to decrease prisoner credit',
    successMessage: 'Prisoner credit decreased successfully'
  })
);

// Routes for cells and cell types
const {
  getAllCells,
  getCellById,
  createCell,
  deleteCell,
  getAllCellTypes,
  getCellTypeById,
  createCellType,
  deleteCellType,
  getCellByPrisonerId
} = require('./database-cells');

// GET - všechny cely
app.get('/cells', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: () => getAllCells(),
    notFoundError: 'No cells found',
    serverError: 'Failed to fetch cells',
    includeCount: true
  })
);

// GET - informace o cele podle ID
app.get('/cells/:id', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => getCellById(req.params.id),
    notFoundError: 'Cell not found',
    serverError: 'Failed to fetch cell'
  })
);

// POST - vytvoření nové cely
app.post('/cells', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => createCell(req.body),
    serverError: 'Failed to create cell',
    successMessage: 'Cell created successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - odstranění cely
app.delete('/cells/:id', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => deleteCell(req.params.id),
    notFoundError: 'Cell not found',
    serverError: 'Failed to delete cell',
    successMessage: 'Cell deleted successfully',
    skipNotFoundCheck: true
  })
);

// GET - všechny typy cel
app.get('/cell-types', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: () => getAllCellTypes(),
    notFoundError: 'No cell types found',
    serverError: 'Failed to fetch cell types',
    includeCount: true
  })
);

// GET - informace o typu cely podle ID
app.get('/cell-types/:id', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => getCellTypeById(req.params.id),
    notFoundError: 'Cell type not found',
    serverError: 'Failed to fetch cell type'
  })
);

// POST - vytvoření nového typu cely
app.post('/cell-types', authenticateToken(['admin' ,'prison']),
  createRouteHandler({
    getDataFn: (req) => createCellType(req.body),
    serverError: 'Failed to create cell type',
    successMessage: 'Cell type created successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - odstranění typu cely
app.delete('/cell-types/:id', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => deleteCellType(req.params.id),
    notFoundError: 'Cell type not found',
    serverError: 'Failed to delete cell type',
    successMessage: 'Cell type deleted successfully',
    skipNotFoundCheck: true
  })
);

// GET - informace o cele vězně podle ID vězně
app.get('/prisoners/:id/cell', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => getCellByPrisonerId(req.params.id),
    notFoundError: 'Cell for prisoner not found',
    serverError: 'Failed to fetch cell for prisoner'
  })
);

//Routes for allergens

const {
  getAllAllergens,
  getAllergensByPrisonerId,
  addAllergenToPrisoner,
  removeAllergenFromPrisoner
} = require('./database-allergens');

// GET - všechny alergeny
app.get('/allergens', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: () => getAllAllergens(),
    notFoundError: 'No allergens found',
    serverError: 'Failed to fetch allergens',
    includeCount: true
  })
);

// GET - alergeny vězně podle ID vězně
app.get('/prisoners/:id/allergens', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => getAllergensByPrisonerId(req.params.id),
    notFoundError: 'No allergens found for prisoner',
    serverError: 'Failed to fetch allergens for prisoner',
    includeCount: true
  })
);

// POST - přidání alergenu vězni
app.post('/prisoners/:id/allergens', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => addAllergenToPrisoner(req.params.id, req.body.allergen_id, req.body.severity),
    serverError: 'Failed to add allergen to prisoner',  
    successMessage: 'Allergen added to prisoner successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - odebrání alergenu vězni
app.delete('/prisoners/:id/allergens/:allergenId', authenticateToken(['admin', 'prison']),
  createRouteHandler({
    getDataFn: (req) => removeAllergenFromPrisoner(req.params.id, req.params.allergenId),
    notFoundError: 'Allergen for prisoner not found',
    serverError: 'Failed to remove allergen from prisoner',
    successMessage: 'Allergen removed from prisoner successfully',
    skipNotFoundCheck: true
  })
);


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