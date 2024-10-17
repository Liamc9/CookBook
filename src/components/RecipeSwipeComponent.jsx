import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './RecipeSwipeComponent.css';

const RecipeSwipeComponent = ({ recipe }) => {
  const {
    name,
    cuisine,
    time,
    servings,
    calories,
    steps,
    overviewVideoUrl,
    overviewDescription,
  } = recipe;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStepDescription, setCurrentStepDescription] = useState(overviewDescription);

  const toggleDrawer = (description) => {
    setCurrentStepDescription(description);
    setIsDrawerOpen(!isDrawerOpen);
  };

  const goToOverview = () => {
    document.querySelector('.swiper').swiper.slideTo(0);
    setCurrentStepDescription(overviewDescription);
  };

  const handleSlideChange = (swiper) => {
    document.querySelectorAll('video').forEach((video) => {
      video.pause();
    });
    const activeSlide = swiper.slides[swiper.activeIndex];
    const video = activeSlide.querySelector('video');
    if (video) {
      video.play();
    }
    if (swiper.activeIndex === 0) {
      setCurrentStepDescription(overviewDescription);
    } else {
      setCurrentStepDescription(steps[swiper.activeIndex - 1].description);
    }
  };

  return (
    <div className="recipe-swipe">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        touchStartPreventDefault={false}
        allowTouchMove={!isDrawerOpen}
        onSlideChange={handleSlideChange}
      >
        {/* Overview Slide */}
        <SwiperSlide>
          <div className="recipe-overview">
            <video
              src={overviewVideoUrl}
              className="overview-video"
              playsInline // Add this attribute
              onClick={(e) => {
                e.stopPropagation();
                e.target.paused ? e.target.play() : e.target.pause();
              }}
            />
            <div className="recipe-info">
              <h2 className="recipe-title">{name}</h2>
              <div className="recipe-details-cards">
                <div className="recipe-card">
                  <strong>Cuisine:</strong> {cuisine}
                </div>
                <div className="recipe-card">
                  <strong>Time:</strong> {time} minutes
                </div>
                <div className="recipe-card">
                  <strong>Servings:</strong> {servings}
                </div>
                <div className="recipe-card">
                  <strong>Calories:</strong> {calories} kcal
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Steps Slides */}
        {steps.map((step, index) => (
          <SwiperSlide key={index}>
            <div className="recipe-step">
              <button className="back-button" onClick={goToOverview}>
                Back
              </button>
              <div className="step-indicator">Step {index + 1}</div>
              <video
                src={step.videoUrl}
                className="step-video"
                playsInline // Add this attribute
                onClick={(e) => {
                  e.target.paused ? e.target.play() : e.target.pause();
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Drawer Component */}
      <div
        className={`drawer ${isDrawerOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target.classList.contains('drawer-handle')) {
            setIsDrawerOpen(!isDrawerOpen);
          }
        }}
      >
        <div className="drawer-handle">Swipe up for step details</div>
        {isDrawerOpen && (
          <div className="drawer-content">
            <p>{currentStepDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeSwipeComponent;
