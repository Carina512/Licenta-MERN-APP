
import React from 'react';

const RecipeCard = ({ recipes, openModal, closeModal, selectedRecipe, onSave }) => {
  const handleSaveRecipe = (recipe) => {
    if (!recipe) {
      console.error('No recipe selected');
      return;
    }
    onSave(recipe); 
  };

  return (
    <div className="posts__container">
      {recipes.map((recipe) => (
        <div key={recipe.recipe.label} className="post">
          <div >
            <img src={recipe.recipe.image} className="recipe-image" alt={recipe.recipe.label} />
            <div className="recipe-details">
              <h5 className="recipe-title">{recipe.recipe.label}</h5>
              <p>Calories: {recipe.recipe.calories.toFixed(2)}</p>
              <button onClick={() => openModal(recipe)} className="view-ingredients-button">View Ingredients</button>
              
            </div>
          </div>
        </div>
      ))}
      {/* Modal */}
      <div id="exampleModal" className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center" onClick={closeModal}>
        <div className="bg-white rounded-lg p-8"  role="document" >
            <div  onClick={(e) => e.stopPropagation()}>
                <div className="modal-header" button type="button"  data-dismiss="modal" aria-label="Close" >
                    <h5 className="modal-title">Recipe and Cooking instructions</h5>
                    <button onClick={closeModal}>
                    <span>&times;</span>
                    </button>
                </div>
                <div>
                    {selectedRecipe && (
                    <>
                        <h6>Ingredients:</h6>
                        <ul>
                        {selectedRecipe.recipe.ingredientLines.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                        </ul>
                        <h6>Cooking Instructions:</h6>
                        <p>{selectedRecipe.recipe.url}</p>
                        <button onClick={() => handleSaveRecipe(selectedRecipe)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2">Save Recipe</button>
                    </>
                    
                    )}
                </div>
                
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
