// RecipeForm.js
import React, { useState } from 'react';
import axios from 'axios';

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/recipes', { ingredients });
      console.log('Recipes saved:', response.data);
      // Handle success, e.g., show a success message
    } catch (error) {
      console.error('Error saving recipes:', error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      <button type="submit">Generate Recipes</button>
    </form>
  );
};

export default RecipeForm;
