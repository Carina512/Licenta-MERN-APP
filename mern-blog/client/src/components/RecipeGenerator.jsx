// RecipeGenerator.js
import { useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import axios from "axios";
import RecipeCard from './RecipeCard';
import { UserContext } from '../context/userContext'

const RecipeGenerator = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token;

  const generateRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/generate?search=${search}`);
      console.log('Response:', response.data); 
      if (response.data.length > 0) {
        setRecipes(response.data);
      } else {
        console.log('No recipes found'); 
      }
    } catch (error) {
      console.error('Failed to fetch recipe', error); 
    }
  };
  
  const openModal = (recipe) => {
    console.log("reteta", recipe);
    setSelectedRecipe(recipe);
    document.getElementById('exampleModal').classList.remove('hidden');
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    document.getElementById('exampleModal').classList.add('hidden');
  };
  const saveRecipe = async () => {
    setError('');
    try {
      if (!selectedRecipe) {
        console.error('No recipe selected');
        setError('No recipe selected');
        return;
      }
    const { label, uri, totalTime, image, ingredientLines, totalNutrients, totalWeight, yield: recipeYield } = selectedRecipe.recipe;

    const recipeData = {
        label: label,
        uri: uri,
        totalTime: totalTime,
        image: image,
        ingredientLines: ingredientLines,
        totalNutrients: totalNutrients,
        totalWeight: totalWeight,
        yield: recipeYield,
        user: currentUser?.id
    };
      await axios.post(`http://localhost:5000/api/recipes/save`, recipeData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
      //console.log('Recipe saved:', response.data);
      navigate('/saved-recipes');
    } catch (error) {
      console.error('Failed to save recipe', error);
      setError('Failed to save recipe');
    }
  };


  return (
    <div className="container mx-auto mt-8">
      <div className="input-container flex justify-center mb-4  border-black-600">
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="search-input"
        />
        <button 
          onClick={generateRecipe} 
          className="generate-button ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded">
          Generate Recipe
        </button>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {recipes.length === 0 ? (
        <p className="text-center">No recipes found</p>
      ) : (
        <RecipeCard
          recipes={recipes}
          openModal={openModal}
          closeModal={closeModal}
          selectedRecipe={selectedRecipe}
          onSave={saveRecipe} 
        />
      )}
    </div>
  );
};

export default RecipeGenerator;