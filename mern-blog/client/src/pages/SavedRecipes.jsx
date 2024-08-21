import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const SavedRecipesPage = () => {
  const { currentUser } = useContext(UserContext);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/users/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        setSavedRecipes(response.data);
      } catch (error) {
        console.error('Failed to fetch saved recipes:', error);
      }
    };

    fetchSavedRecipes();
  }, [currentUser]);
  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Saved Recipes</h1>
      <div className="grid grid-cols-1 gap-4">
        {savedRecipes.map(recipe => (
          <div key={recipe._id} className="w-full p-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{recipe.label}</h3>
                <p>Total Time: {recipe.totalTime} minutes</p>
                <p>Total Weight: {recipe.totalWeight}</p>
                <p>Ingredients:</p>
                <ul>
                  {recipe.ingredientLines.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <p>Nutrients:</p>
                <ul>
                  <li>Carbohydrates: {recipe.totalNutrients.CHOCDF.quantity} {recipe.totalNutrients.CHOCDF.unit}</li>
                  <li>Calories: {recipe.totalNutrients.ENERC_KCAL.quantity} {recipe.totalNutrients.ENERC_KCAL.unit}</li>
                  <li>Fat: {recipe.totalNutrients.FAT.quantity} {recipe.totalNutrients.FAT.unit}</li>
                  <li>Protein: {recipe.totalNutrients.PROCNT.quantity} {recipe.totalNutrients.PROCNT.unit}</li>
                  <li>Fiber: {recipe.totalNutrients.FIBTG.quantity} {recipe.totalNutrients.FIBTG.unit}</li>
                </ul>
                <button
                  onClick={() => deleteRecipe(recipe._id)}
                  className="mt-4 bg-red-500"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRecipesPage;
