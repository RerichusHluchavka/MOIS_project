const express = require('express');
const { authenticateToken } = require('../auth-middleware');
const { createRouteHandler } = require('./routeHandler');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());

const {
  getAllFood,
  getFoodById,
  createFood,
  deleteFood,
  getTodayMenu,
  addFoodToTodayMenu,
  removeFoodFromTodayMenu,
  updateTodayMenuFoodCost,
  decreaseTodayMenuFoodPortions,
  increaseTodayMenuFoodPortions,
  deleteAllTodayMenu
} = require('./database-food');

// Routes for food

// GET - všechno jídlo
app.get('/food', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: () => getAllFood(),
    notFoundError: 'No food items found',
    serverError: 'Failed to fetch food items',
    includeCount: true
  })
);

// GET - jídlo podle ID
app.get('/food/:id', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => getFoodById(req.params.id),
    notFoundError: 'Food item not found',
    serverError: 'Failed to fetch food item'
  })
);

// POST - vytvoření nového jídla
app.post('/food', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => createFood(req.body),
    serverError: 'Failed to create food item',
    successMessage: 'Food item created successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - smazání jídla podle ID
app.delete('/food/:id', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => deleteFood(req.params.id),
    notFoundError: 'Food item not found',
    serverError: 'Failed to delete food item',
    successMessage: 'Food item deleted successfully',
    skipNotFoundCheck: true
  })
);

// Routes for today's menu

// GET - dnešní menu
app.get('/today-menu', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: () => getTodayMenu(),
    notFoundError: 'Today\'s menu is empty',
    serverError: 'Failed to fetch today\'s menu',
    includeCount: true
  })
);

// POST - přidání jídla do dnešního menu
app.post('/today-menu', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => addFoodToTodayMenu(req.body),
    serverError: 'Failed to add food to today\'s menu',
    successMessage: 'Food added to today\'s menu successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - odstranění jídla z dnešního menu
app.delete('/today-menu/:foodId', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => removeFoodFromTodayMenu(req.params.foodId),
    notFoundError: 'Food item not found in today\'s menu',
    serverError: 'Failed to remove food from today\'s menu',
    successMessage: 'Food removed from today\'s menu successfully',
    skipNotFoundCheck: true
  })
);

// PUT - aktualizace ceny jídla v dnešním menu
app.put('/today-menu/:foodId/cost', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => updateTodayMenuFoodCost(req.params.foodId, req.body),
    notFoundError: 'Food item not found in today\'s menu',
    serverError: 'Failed to update food cost in today\'s menu',
    successMessage: 'Food cost updated successfully'
  })
);

// PATCH - snížení počtu porcí jídla v dnešním menu
app.patch('/today-menu/:foodId/decrease-portions', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => decreaseTodayMenuFoodPortions(req.params.foodId, req.body),
    notFoundError: 'Food item not found in today\'s menu',
    serverError: 'Failed to decrease food portions in today\'s menu',
    successMessage: 'Food portions decreased successfully'
  })
);

// PATCH - zvýšení počtu porcí jídla v dnešním menu
app.patch('/today-menu/:foodId/increase-portions', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => increaseTodayMenuFoodPortions(req.params.foodId, req.body),
    notFoundError: 'Food item not found in today\'s menu',
    serverError: 'Failed to increase food portions in today\'s menu',
    successMessage: 'Food portions increased successfully'
  })
);

// DELETE - smazání celého dnešního menu
app.delete('/today-menu', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: () => deleteAllTodayMenu(),
    serverError: 'Failed to delete today\'s menu',
    successMessage: 'Today\'s menu deleted successfully',
    skipNotFoundCheck: true
  })
);

const{
  getAllIngredients,
  getIngredientById,
  createIngredient,
  deleteIngredientById,
  getIngredientsByFoodId,
  addIngredientToFood,
  removeIngredientFromFood,
  updateIngredientPortionInFood,
  updateIngredientUnitInFood
} = require('./database-ingredients');

// Routes for ingredients

// GET - všechny ingredience
app.get('/ingredients', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: () => getAllIngredients(),
    notFoundError: 'No ingredients found',
    serverError: 'Failed to fetch ingredients',
    includeCount: true
  })
);

// GET - ingredience podle ID
app.get('/ingredients/:id', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => getIngredientById(req.params.id),
    notFoundError: 'Ingredient not found',
    serverError: 'Failed to fetch ingredient'
  })
);

// POST - vytvoření nové ingredience
app.post('/ingredients', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => createIngredient(req.body),
    serverError: 'Failed to create ingredient',
    successMessage: 'Ingredient created successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - odstranění ingredience podle ID
app.delete('/ingredients/:id', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => deleteIngredientById(req.params.id),
    notFoundError: 'Ingredient not found',
    serverError: 'Failed to delete ingredient',
    successMessage: 'Ingredient deleted successfully',
    skipNotFoundCheck: true
  })
);

// GET - všechny ingredience pro konkrétní jídlo
app.get('/food/:foodId/ingredients', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => getIngredientsByFoodId(req.params.foodId),
    notFoundError: 'No ingredients found for this food item',
    serverError: 'Failed to fetch ingredients for food item',
    includeCount: true
  })
);

// POST - přidání ingredience do jídla
app.post('/food/:foodId/ingredients', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => addIngredientToFood(req.params.foodId, req.body),
    serverError: 'Failed to add ingredient to food item',
    successMessage: 'Ingredient added to food item successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - odstranění ingredience z jídla
app.delete('/food/:foodId/ingredients/:ingredientId', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => removeIngredientFromFood(req.params.foodId, req.params.ingredientId),
    notFoundError: 'Ingredient not found in food item',
    serverError: 'Failed to remove ingredient from food item',
    successMessage: 'Ingredient removed from food item successfully',
    skipNotFoundCheck: true
  })
);

// PUT - aktualizace množství porce ingredience v jídle
app.put('/food/:foodId/ingredients/:ingredientId/portion', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => updateIngredientPortionInFood(req.params.foodId, req.params.ingredientId, req.body),
    notFoundError: 'Ingredient not found in food item',
    serverError: 'Failed to update ingredient portion in food item',
    successMessage: 'Ingredient portion updated successfully'
  })
);

// PUT - aktualizace jednotky ingredience v jídle
app.put('/food/:foodId/ingredients/:ingredientId/unit', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => updateIngredientUnitInFood(req.params.foodId, req.params.ingredientId, req.body),
    notFoundError: 'Ingredient not found in food item',
    serverError: 'Failed to update ingredient unit in food item',
    successMessage: 'Ingredient unit updated successfully'
  })
);

const{
getAllAllergens,
getAllergenById,
createAllergen,
deleteAllergenById,
getAllergensByIngredientId,
addAllergenToIngredient,
removeAllergenFromIngredient,
getIngredientsByAllergenId
} = require('./database-allergens');

// Routes for allergens

// GET - všechny alergeny
app.get('/allergens', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: () => getAllAllergens(),
    notFoundError: 'No allergens found',
    serverError: 'Failed to fetch allergens',
    includeCount: true
  })
);

// GET - alergen podle ID
app.get('/allergens/:id', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => getAllergenById(req.params.id),
    notFoundError: 'Allergen not found',
    serverError: 'Failed to fetch allergen'
  })
);

// POST - vytvoření nového alergenu
app.post('/allergens', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => createAllergen(req.body),
    serverError: 'Failed to create allergen',
    successMessage: 'Allergen created successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - odstranění alergenu podle ID
app.delete('/allergens/:id', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => deleteAllergenById(req.params.id),
    notFoundError: 'Allergen not found',
    serverError: 'Failed to delete allergen',
    successMessage: 'Allergen deleted successfully',
    skipNotFoundCheck: true
  })
);

// GET - všechny alergeny pro konkrétní ingredienci
app.get('/ingredients/:ingredientId/allergens', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => getAllergensByIngredientId(req.params.ingredientId),
    notFoundError: 'No allergens found for this ingredient',
    serverError: 'Failed to fetch allergens for ingredient',
    includeCount: true
  })
);

// POST - přidání alergenu do ingredience
app.post('/ingredients/:ingredientId/allergens', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => addAllergenToIngredient(req.params.ingredientId, req.body),
    serverError: 'Failed to add allergen to ingredient',
    successMessage: 'Allergen added to ingredient successfully',
    successCode: 201,
    skipNotFoundCheck: true
  })
);

// DELETE - odstranění alergenu z ingredience
app.delete('/ingredients/:ingredientId/allergens/:allergenId', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => removeAllergenFromIngredient(req.params.ingredientId, req.params.allergenId),
    notFoundError: 'Allergen not found in ingredient',
    serverError: 'Failed to remove allergen from ingredient',
    successMessage: 'Allergen removed from ingredient successfully',
    skipNotFoundCheck: true
  })
);

// GET - všechny ingredience obsahující konkrétní alergen
app.get('/allergens/:allergenId/ingredients', authenticateToken(['admin', 'kitchen']),
  createRouteHandler({
    getDataFn: (req) => getIngredientsByAllergenId(req.params.allergenId),
    notFoundError: 'No ingredients found for this allergen',
    serverError: 'Failed to fetch ingredients for allergen',
    includeCount: true
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
app.listen(PORT, () => {
  console.log(`Prisoner service running on port ${PORT}`);
  console.log(`PostgreSQL: prisoner_db`);
});