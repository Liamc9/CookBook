import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { FaArrowUp, FaArrowDown, FaPlay, FaPause } from "react-icons/fa";

const SwipeableRecipeViewer = ({ recipeId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

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

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleIngredientsDrawer = () => {
    setShowIngredients(!showIngredients);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!recipeData || !recipeData.steps) {
    return <div className="flex items-center justify-center h-screen">No recipe data found.</div>;
  }

  const renderOverlayButton = () => (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
      onClick={togglePlayPause}
    >
      {isPlaying ? (
        <FaPause className="text-white text-6xl" />
      ) : (
        <FaPlay className="text-white text-6xl" />
      )}
    </div>
  );

  const renderOverviewPage = () => (
    <div className="relative border rounded-lg shadow-lg bg-white max-w-md mx-auto z-50 h-[90%]">
      <div className="relative">
        {recipeData.overviewUrl && (
          <video
            ref={videoRef}
            src={recipeData.overviewUrl}
            controls={false}
            className="w-full border border-gray-300 rounded-md"
          />
        )}
        {renderOverlayButton()}
      </div>
      <div className={`absolute bottom-0 left-0 w-full h-[400px] bg-white p-4 border-t rounded-t-lg transition-transform transform ${showIngredients ? 'translate-y-[20%]' : 'translate-y-[100%]'} z-10`}>
        <div className="flex justify-between items-center ">
          <h3 className="text-xl font-bold">Ingredients</h3>
          <button onClick={toggleIngredientsDrawer} className="focus:outline-none">
            {showIngredients ? <FaArrowDown /> : <FaArrowUp />}
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-4">
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
    <div key={stepIndex} className="relative border rounded-lg shadow-lg bg-white max-w-md mx-auto z-50 h-[90%]">
            <h2 className="text-2xl font-bold mb-4">Step {stepIndex + 1}</h2>

      <div className="relative">
        {step.stepUrl && (
          <video
            ref={videoRef}
            src={step.stepUrl}
            controls={false}
            className="w-full border border-gray-300 rounded-md"
          />
        )}
        {renderOverlayButton()}
      </div>
       <div className={`absolute bottom-0 left-0 w-full h-[400px] bg-white p-4 border-t rounded-t-lg transition-transform transform ${showIngredients ? 'translate-y-[20%]' : 'translate-y-[100%]'} z-10`}>
        <div className="flex justify-between items-center ">
          <h3 className="text-xl font-bold">Descriptions</h3>
          <button onClick={toggleIngredientsDrawer} className="focus:outline-none">
            {showIngredients ? <FaArrowDown /> : <FaArrowUp />}
          </button>
        </div>
        <p>{step.description}</p>
      </div>
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

    return <div className="flex items-center justify-center h-screen">No more steps available</div>;
  };

  return (
    <div {...handlers} className="h-screen overflow-hidden bg-gray-100">
      {renderCurrentPage()}
    </div>
  );
};

export default SwipeableRecipeViewer;
