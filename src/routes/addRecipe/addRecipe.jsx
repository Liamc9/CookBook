import React, { useState } from 'react';
import { storage, db } from "../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import RecipeDetails from './recipeDetails';
import RecipeOverview from './recipeOverview';
import RecipeStep from './recipeStep';
import PreviewRecipe from './previewRecipe';

const AddRecipe = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipeName, setRecipeName] = useState("");
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [overviewFile, setOverviewFile] = useState(null);
  const [overviewFilePreview, setOverviewFilePreview] = useState(null);
  const [ingredients, setIngredients] = useState([{ amount: "", unit: "", name: "" }]);
  const [steps, setSteps] = useState([
    { file: null, preview: null, descriptions: [""] },
    { file: null, preview: null, descriptions: [""] },
    { file: null, preview: null, descriptions: [""] },
    { file: null, preview: null, descriptions: [""] },
  ]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const nextStep = () => {
    if (currentStep < 7) {
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
      setOverviewFilePreview(URL.createObjectURL(file));
    } else if (index === 'image') {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      let newSteps = [...steps];
      newSteps[index].file = file;
      newSteps[index].preview = URL.createObjectURL(file);
      setSteps(newSteps);
    }
  };

  const onDescriptionChange = (text, stepIndex, descIndex) => {
    let newSteps = [...steps];
    newSteps[stepIndex].descriptions[descIndex] = text;
    setSteps(newSteps);
  };

  const addDescriptionField = (stepIndex) => {
    let newSteps = [...steps];
    newSteps[stepIndex].descriptions.push("");
    setSteps(newSteps);
  };

  const removeDescriptionField = (stepIndex, descIndex) => {
    let newSteps = [...steps];
    newSteps[stepIndex].descriptions.splice(descIndex, 1);
    setSteps(newSteps);
  };

  const handleUploadAll = async () => {
    if (steps.some(step => step.file === null) || !overviewFile || !imageFile) {
      setMessage("Please upload all files before submitting.");
      return;
    }
    setUploading(true);
    try {
      const imageUrl = await uploadFileAndGetURL(imageFile);
      const overviewUrl = await uploadFileAndGetURL(overviewFile);

      const uploadedSteps = await Promise.all(steps.map(async (step, index) => {
        const stepUrl = await uploadFileAndGetURL(step.file);
        return {
          stepUrl,
          description: step.descriptions.join("\n"),
        };
      }));

      await addDoc(collection(db, 'recipes'), {
        recipeName,
        caption,
        imageUrl,
        overviewUrl,
        ingredients,
        steps: uploadedSteps,
        uploadedAt: new Date(),
        userId: user.uid
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Press Begin To Start Uploading Your Recipe!</h1>
              <button
                onClick={nextStep}
                className="rounded bg-custom-brown px-4 py-2 text-white hover:bg-custom-brown"
              >
                Begin Recipe
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className='mb-20 mx-4'>
          <RecipeDetails
            recipeName={recipeName}
            setRecipeName={setRecipeName}
            caption={caption}
            setCaption={setCaption}
            imageFile={imageFile}
            setImageFile={(file) => onFileChange(file, 'image')}
            imagePreview={imagePreview}
          />
          <div className="flex justify-between mt-4 mx-4">
              <button
                onClick={prevStep}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="rounded bg-custom-brown px-4 py-2 text-white hover:bg-custom-brown"
              >
                Next
              </button>
            </div>
            </div>
        );
      case 2:
        return (
          <div className='mb-20 mx-4'>
          <RecipeOverview
            overviewFile={overviewFile}
            setOverviewFile={(file) => onFileChange(file, 'overview')}
            overviewFilePreview={overviewFilePreview}
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
           <div className="flex justify-between mt-4">
              <button
                onClick={prevStep}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="rounded bg-custom-brown px-4 py-2 text-white hover:bg-custom-brown"
              >
                Next
              </button>
            </div>
            </div>
        );
      case 3:
      case 4:
      case 5:
      case 6:
        return (
          <div className='mb-20 ,x-4'>
          <RecipeStep
            step={steps[currentStep - 3]}
            index={currentStep - 3}
            onFileChange={onFileChange}
            onDescriptionChange={onDescriptionChange}
            addDescriptionField={addDescriptionField}
            removeDescriptionField={removeDescriptionField}
          />
          <div className="flex justify-between mt-4">
          <button
            onClick={prevStep}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            className="rounded bg-custom-brown px-4 py-2 text-white hover:bg-custom-brown"
          >
            Next
          </button>
        </div>
        </div>
        );
      case 7:
        return (
          <div className='mb-20 mx-4'>
          <PreviewRecipe
            recipeName={recipeName}
            caption={caption}
            imagePreview={imagePreview}
            overviewFilePreview={overviewFilePreview}
            ingredients={ingredients}
            steps={steps}
            handleUploadAll={handleUploadAll}
            uploading={uploading}
            message={message}
          />
          <div className="flex justify-between mt-4">
          <button
            onClick={prevStep}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Previous
          </button>
        </div>
        </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
};

export default AddRecipe;
