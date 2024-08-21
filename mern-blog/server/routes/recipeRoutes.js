// routes/recipes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {generateRecipe,deleteRecipeForUser, saveRecipe,getRecipeId,getRecipes,getRecipeByIdForUser} = require ('../controllers/recipeController');

router.get('/generate', generateRecipe);
router.post('/save',authMiddleware, saveRecipe);
router.get('/:recipeId',authMiddleware, getRecipeId);
router.get('/users/:id',authMiddleware,getRecipes);
router.get('/:recipeId',authMiddleware,getRecipeByIdForUser);
router.delete('/:recipeId',authMiddleware, deleteRecipeForUser);

module.exports = router;
