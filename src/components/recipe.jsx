import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { FaArrowUp, FaArrowDown, FaPlay, FaPause } from "react-icons/fa";
import debounce from 'lodash.debounce';

const RecipeViewer = ({ recipeId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragging, setDragging] = useState(false);
  const carouselRef = useRef(null);
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

  const handleDragStart = (event) => {
    setDragStartX(event.clientX || event.touches[0].clientX);
    setDragging(true);
  };

  const handleDragEnd = (event) => {
    if (dragStartX !== null) {
      const dragEndX = event.clientX || (event.changedTouches && event.changedTouches[0].clientX);
      const dragDistance = dragStartX - dragEndX;

      if (dragDistance > 50) {
        handleNextStep();
      } else if (dragDistance < -50) {
        handlePreviousStep();
      }

      setDragStartX(null);
      setDragging(false);
      snapToCurrentStep();
    }
  };

  const snapToCurrentStep = useCallback(debounce(() => {
    if (carouselRef.current) {
      const stepWidth = carouselRef.current.clientWidth;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newStep = Math.round(scrollPosition / stepWidth);
      setCurrentStep(newStep);
      const scrollTo = stepWidth * newStep;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, 100), []);

  useEffect(() => {
    if (!dragging) {
      snapToCurrentStep();
    }
  }, [currentStep, dragging, snapToCurrentStep]);

  useEffect(() => {
    const handleResize = () => {
      snapToCurrentStep();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [snapToCurrentStep]);

  const handleNextStep = () => {
    if (recipeData && recipeData.steps && currentStep < recipeData.steps.length) {
      setCurrentStep(currentStep + 1);
      setShowIngredients(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowIngredients(false);
    }
  };

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
        <div className="flex justify-between items-center">
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Descriptions</h3>
          <button onClick={toggleIngredientsDrawer} className="focus:outline-none">
            {showIngredients ? <FaArrowDown /> : <FaArrowUp />}
          </button>
        </div>
        <p>{step.description}</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-gray-100 flex flex-col items-center">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto no-scrollbar w-full max-w-md mx-auto"
        onMouseDown={handleDragStart}
        onMouseMove={(e) => e.preventDefault()}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => setDragStartX(null)}
        onTouchStart={(e) => handleDragStart(e)}
        onTouchMove={(e) => e.preventDefault()}
        onTouchEnd={(e) => handleDragEnd(e)}
      >
        <div className="flex-shrink-0 w-full">
          {renderOverviewPage()}
        </div>
        {recipeData.steps.map((step, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            {renderStepPage(step, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeViewer;
