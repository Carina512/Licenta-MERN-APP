// controllers/recipeController.js
const Recipe = require('../models/favorite')
const axios = require('axios');
const HttpError = require('../models/errorModel');

const APP_ID = 'f36a4d90';
const APP_KEY = 'aea1c1ea9d6ed00f32e047821361cbb2';

const generateRecipe = async (req, res) => {
  
  const { search } = req.query;

  try {
    const response = await axios.get(`https://api.edamam.com/search?q=${search}&app_id=${APP_ID}&app_key=${APP_KEY}`);
    res.json(response.data.hits);
  } catch (error) {
    console.error('Failed to fetch recipe', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};



const saveRecipe = async (req, res) => {
  const { label, uri, totalTime, image, ingredientLines, totalNutrients, totalWeight, yield, user } = req.body;

  // Check which fields are null or undefined
  const fields = { label, uri, totalTime, image, ingredientLines, totalNutrients, totalWeight, yield, user };
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      console.log(`Field ${key} is missing:`, value);
    }
  });
  
 

  try {
    const recipe = new Recipe({
      label,
      uri,
      totalTime,
      image,
      ingredientLines,
      totalNutrients,
      totalWeight,
      yield,
      user: user 
    });
    console.log("backend",recipe)
    const savedRecipe = await recipe.save();

    res.status(200).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getRecipeId =  async(req,res,next)=>{
   const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return next(new HttpError("Recipe not found.", 404))
    }

    res.status(200).json(recipe);
  } catch (error) {
    return next(new HttpError(error))
  }
};

//GET ALL RECIPES FOR THE USER LOGGED IN//

const getRecipes = async (req,res) => {
  const { id } = req.params;
  Recipe.find({ user: id })
    .then((recipes) => {
      res.json(recipes);
    })
    .catch((err) => {
      res.send(err);
    });
};

//GET RECIPE BY ID FOR A USER//
const getRecipeByIdForUser = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findOne({ _id: recipeId});

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found for the current user" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//delete recipe from user
const deleteRecipeForUser = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ _id: recipeId});
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found or not authorized to delete" });
    }

    res.status(200).json(deletedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
// @route   GET api/recipes/:recipeId
// @desc    Get one recipe by id
// @access  Public

module.exports = {
  generateRecipe,saveRecipe,getRecipeId,getRecipes,getRecipeByIdForUser,deleteRecipeForUser
};






