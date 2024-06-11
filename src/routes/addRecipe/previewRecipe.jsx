import React from 'react';

const PreviewRecipe = ({ recipeName, caption, imagePreview, overviewFilePreview, ingredients, steps, handleUploadAll, uploading, message, prevStep }) => {
  return (
    <div className="p-6 bg-white max-w-md mx-auto mt-10 mb-20">
      <h2 className="text-2xl font-bold mb-4">Preview and Submit</h2>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Recipe Image</h3>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Recipe"
            className="w-full h-64 border border-gray-300 rounded-md mb-4"
          />
        )}
        <h3 className="text-xl font-bold mb-2">Recipe Name</h3>
        <p>{recipeName}</p>
        <h3 className="text-xl font-bold mb-2">Caption</h3>
        <p>{caption}</p>
        <h3 className="text-xl font-bold mb-2">Overview Video</h3>
        {overviewFilePreview && (
          <video
            src={overviewFilePreview}
            controls
            className="w-full h-64 border border-gray-300 rounded-md mb-4"
          />
        )}
        <h3 className="text-xl font-bold mb-2">Ingredients</h3>
        <ul className="list-disc list-inside">
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>
      <h3 className="text-xl font-bold mb-2">Recipe Steps</h3>
      {steps.map((step, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-lg font-bold">Step {index + 1}</h4>
          {step.preview && (
            <video
              src={step.preview}
              controls
              className="w-full h-64 border border-gray-300 rounded-md mb-4"
            />
          )}
          <p>{step.descriptions.join("\n")}</p>
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={handleUploadAll}
          disabled={uploading}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-300"
        >
          {uploading ? "Uploading..." : "Submit All"}
        </button>
      </div>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default PreviewRecipe;
