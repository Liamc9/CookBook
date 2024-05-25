import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const SwipeableRecipeViewer = ({ recipeId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIngredients, setShowIngredients] = useState(false);

  useEffect(() => {
    const fetchRecipeData = async () => {
      setLoading(true);
      try {
        const recipeDoc = doc(db, "recipes", recipeId);
        const recipeSnapshot = await getDoc(recipeDoc);

        if (recipeSnapshot.exists()) {
          setRecipeData(recipeSnapshot.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
      setLoading(false);
    };

    fetchRecipeData();
  }, [recipeId]);

  const handleSwipeLeft = () => {
    if (recipeData && recipeData.steps && currentStep < recipeData.steps.length) {
      setCurrentStep(currentStep + 1);
      setShowIngredients(false); // Hide ingredients when swiping
    }
  };

  const handleSwipeRight = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowIngredients(false); // Hide ingredients when swiping
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipeData || !recipeData.steps) {
    return <div>No recipe data found.</div>;
  }

  const toggleIngredientsDrawer = () => {
    setShowIngredients(!showIngredients);
  };

  const renderOverviewPage = () => (
    <div className="relative border rounded-lg shadow-lg bg-white max-w-md mx-auto mt-20">
      {recipeData.overviewUrl && (
        <video
          src={recipeData.overviewUrl}
          controls
          className="w-full h-64 border border-gray-300 rounded-md"
        />
      )}
      <div className={`absolute bottom-0 left-0 w-full bg-white p-4 border-t rounded-t-lg transition-transform transform ${showIngredients ? 'translate-y-0' : 'translate-y-full'} z-10`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Ingredients</h3>
          <button onClick={toggleIngredientsDrawer} className="focus:outline-none">
            {showIngredients ? <FaArrowDown /> : <FaArrowUp />}
          </button>
        </div>
        <ul className="list-disc list-inside">
          {recipeData.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderStepPage = (step, stepIndex) => (
    <div key={stepIndex} className="relative p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Step {stepIndex + 1}</h2>
      {step.stepUrl && (
        <video
          src={step.stepUrl}
          controls
          className="w-full h-64 border border-gray-300 rounded-md"
        />
      )}
      <h3 className="text-xl font-bold mb-2 mt-4">Descriptions</h3>
     
    </div>
  );

  const renderCurrentPage = () => {
    if (currentStep === 0) {
      return renderOverviewPage();
    }

    const step = recipeData.steps[currentStep - 1];
    if (step) {
      return renderStepPage(step, currentStep - 1);
    }

    return <div>No more steps available</div>;
  };

  return (
    <div {...handlers} className="h-screen overflow-hidden">
      {renderCurrentPage()}
    </div>
  );
};

export default SwipeableRecipeViewer;
