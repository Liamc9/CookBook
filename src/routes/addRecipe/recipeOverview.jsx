import React from 'react';
import IngredientInput from './ingredientInput';
import FileInput from './fileInput';

const RecipeOverview = ({ overviewFile, setOverviewFile, overviewFilePreview, ingredients, setIngredients }) => {
  const handleIngredientChange = (index, field, value) => {
    let newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  return (
    <div className="p-6 bg-white max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Add Recipe Overview</h2>
      <FileInput
        file={overviewFile}
        preview={overviewFilePreview}
        onFileChange={(file) => setOverviewFile(file)}
      />
      <h3 className="text-xl font-bold mb-2">Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <IngredientInput
          key={index}
          ingredient={ingredient}
          onIngredientChange={(field, value) => handleIngredientChange(index, field, value)}
          onRemove={() => setIngredients(ingredients.filter((_, i) => i !== index))}
        />
      ))}
      <button
        onClick={() => setIngredients([...ingredients, { amount: "", unit: "", name: "" }])}
        className="rounded bg-custom-brown px-4 py-2 text-white hover:bg-custom-brown mt-2"
      >
        Add Ingredient
      </button>
    </div>
  );
};

export default RecipeOverview;
