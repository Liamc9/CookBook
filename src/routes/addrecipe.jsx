import React, { useState } from 'react';
import { storage, db } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

// Mock ingredient suggestions
const ingredientSuggestions = [
  "Flour",
  "Sugar",
  "Salt",
  "Butter",
  "Eggs",
  "Milk",
  "Baking Powder",
  "Vanilla Extract",
];

const AddRecipe = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [overviewFile, setOverviewFile] = useState(null);
  const [overviewFilePreview, setOverviewFilePreview] = useState(null);
  const [ingredients, setIngredients] = useState([{ amount: "", unit: "", name: "" }]);
  const [files, setFiles] = useState([null, null, null, null]);
  const [filePreviews, setFilePreviews] = useState([null, null, null, null]);
  const [descriptions, setDescriptions] = useState([[""], [""], [""], [""]]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFileChange = (file, index) => {
    if (index === 'overview') {
      setOverviewFile(file);
      const previewURL = URL.createObjectURL(file);
      setOverviewFilePreview(previewURL);
    } else {
      let newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);

      const previewURL = URL.createObjectURL(file);
      let newFilePreviews = [...filePreviews];
      newFilePreviews[index] = previewURL;
      setFilePreviews(newFilePreviews);
    }
  };

  const onDescriptionChange = (text, stepIndex, descIndex) => {
    let newDescriptions = [...descriptions];
    newDescriptions[stepIndex][descIndex] = text;
    setDescriptions(newDescriptions);
  };

  const addDescriptionField = (stepIndex) => {
    if (descriptions[stepIndex].length < 5) {
      let newDescriptions = [...descriptions];
      newDescriptions[stepIndex].push("");
      setDescriptions(newDescriptions);
    }
  };

  const removeDescriptionField = (stepIndex, descIndex) => {
    let newDescriptions = [...descriptions];
    newDescriptions[stepIndex].splice(descIndex, 1);
    setDescriptions(newDescriptions);
  };

  const handleUploadAll = async () => {
    if (files.some(file => file === null) || !overviewFile) {
      setMessage("Please upload all files before submitting.");
      return;
    }
    setUploading(true);
    try {
      // Upload overview file
      const overviewUrl = await uploadFileAndGetURL(overviewFile);
      
      // Upload recipe step files
      const steps = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const description = descriptions[i].join("\n");
        const stepUrl = await uploadFileAndGetURL(file);
        steps.push({ stepUrl, description });
      }

      // Save the complete recipe to Firestore
      const recipeDoc = doc(db, "recipes", overviewFile.name);
      await setDoc(recipeDoc, {
        overviewUrl,
        ingredients,
        steps,
        uploadedAt: new Date()
      });

      setMessage("All files uploaded successfully and URLs stored in Firestore.");
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage("Error uploading files. Please try again.");
    }
    setUploading(false);
  };

  const uploadFileAndGetURL = async (file) => {
    const fileRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const handleIngredientChange = (index, field, value) => {
    let newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const renderBeginPage = () => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Recipe Uploader</h1>
        <button
          onClick={nextStep}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Begin Recipe
        </button>
      </div>
    </div>
  );

  const renderOverviewPage = () => (
    <div className="p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto mt-10 mb-20">
      <h2 className="text-2xl font-bold mb-4">Add Recipe Overview</h2>
      <div className="mb-4">
        {overviewFilePreview ? (
          <video
            src={overviewFilePreview}
            controls
            className="w-full h-64 border border-gray-300 rounded-md"
          />
        ) : (
          <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex items-center justify-center text-gray-500">
            <span>Click to upload an overview video</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => onFileChange(e.target.files[0], 'overview')}
              className="hidden"
            />
          </label>
        )}
      </div>
      <h3 className="text-xl font-bold mb-2">Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="mb-2 flex items-center space-x-2">
          <input
            type="number"
            value={ingredient.amount}
            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
            placeholder="Amount"
            className="p-2 border rounded-md w-20"
          />
          <select
            value={ingredient.unit}
            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Unit</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="tsp">tsp</option>
            <option value="tbsp">tbsp</option>
          </select>
          <div className="relative flex-grow">
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              placeholder="Ingredient"
              className="p-2 border rounded-md w-full"
              list={`ingredient-suggestions-${index}`}
            />
            <datalist id={`ingredient-suggestions-${index}`}>
              {ingredientSuggestions.map((suggestion, i) => (
                <option key={i} value={suggestion} />
              ))}
            </datalist>
          </div>
          <button
            onClick={() => {
              let newIngredients = ingredients.filter((_, i) => i !== index);
              setIngredients(newIngredients);
            }}
            className="ml-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => setIngredients([...ingredients, { amount: "", unit: "", name: "" }])}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 mt-2"
      >
        Add Ingredient
      </button>
      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderFormStep = () => {
    return (
      <div className="p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto mt-10 mb-20">
        <div className="mb-4">
          {filePreviews[currentStep - 2] ? (
            <video
              src={filePreviews[currentStep - 2]}
              controls
              className="w-full h-64 border border-gray-300 rounded-md"
            />
          ) : (
            <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex items-center justify-center text-gray-500">
              <span>Click to upload a video</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => onFileChange(e.target.files[0], currentStep - 2)}
                className="hidden"
              />
            </label>
          )}
        </div>
        {descriptions[currentStep - 2].map((desc, index) => (
          <div key={index} className="mb-4">
            <textarea
              placeholder={`Description ${index + 1}`}
              value={desc}
              onChange={(e) => onDescriptionChange(e.target.value, currentStep - 2, index)}
              className="mt-2 p-2 w-full h-24 border rounded-md resize-none"
            />
            {descriptions[currentStep - 2].length > 1 && (
              <button
                onClick={() => removeDescriptionField(currentStep - 2, index)}
                className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 mt-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {descriptions[currentStep - 2].length < 5 && (
          <button
            onClick={() => addDescriptionField(currentStep - 2)}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 mt-2"
          >
            Add Description
          </button>
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={prevStep}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderPreviewPage = () => (
    <div className="p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto mt-10 mb-20">
      <h2 className="text-2xl font-bold mb-4">Preview and Submit</h2>
      <div className="mb-4">
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
      {files.map((file, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-lg font-bold">Step {index + 1}</h4>
          {filePreviews[index] && (
            <video
              src={filePreviews[index]}
              controls
              className="w-full h-64 border border-gray-300 rounded-md mb-4"
            />
          )}
          <p>{descriptions[index].join("\n")}</p>
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBeginPage();
      case 1:
        return renderOverviewPage();
      case 2:
      case 3:
      case 4:
      case 5:
        return renderFormStep();
      case 6:
        return renderPreviewPage();
      default:
        return renderBeginPage();
    }
  };

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
};

export default AddRecipe;
