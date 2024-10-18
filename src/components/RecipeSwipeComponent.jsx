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
  const [isMuted, setIsMuted] = useState(false);

  const toggleDrawer = (description) => {
    setCurrentStepDescription(description);
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = (e) => {
    if (e.target.classList.contains('drawer-overlay')) {
      setIsDrawerOpen(false);
    }
  };

  const goToOverview = () => {
    document.querySelector('.swiper').swiper.slideTo(0);
    setCurrentStepDescription(overviewDescription);
  };

  const handleSlideChange = (swiper) => {
    document.querySelectorAll('video').forEach((video) => video.pause());
    const activeSlide = swiper.slides[swiper.activeIndex];
    const video = activeSlide.querySelector('video');
    if (video) {
      video.play();
    }
    setCurrentStepDescription(swiper.activeIndex === 0 ? overviewDescription : steps[swiper.activeIndex - 1].description);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    document.querySelectorAll('video').forEach((video) => (video.muted = !isMuted));
  };

  return (
    <div className="recipe-swipe">
      {isDrawerOpen && <div className="drawer-overlay" onClick={closeDrawer}></div>}
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        allowTouchMove={!isDrawerOpen}
        onSlideChange={handleSlideChange}
      >
        <SwiperSlide>
          <div className="recipe-overview">
            <video
              src={overviewVideoUrl}
              className="overview-video"
              playsInline
              muted={isMuted}
              onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
            />
                <div className='title'>{name}</div>
            <div className="recipe-info-cards">
             
              <div className="recipe-card">
                <div className="recipe-card-header">Cuisine</div>
                <div className="recipe-card-content">{cuisine}</div>
              </div>
              <div className="recipe-card">
                <div className="recipe-card-header">Time</div>
                <div className="recipe-card-content">{time}</div>
              </div>
              <div className="recipe-card">
                <div className="recipe-card-header">Servings</div>
                <div className="recipe-card-content">{servings}</div>
              </div>
              <div className="recipe-card">
                <div className="recipe-card-header">Calories</div>
                <div className="recipe-card-content">{calories} kcal</div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {steps.map((step, index) => (
          <SwiperSlide key={index}>
            <div className="recipe-step">
              <button className="back-button" onClick={goToOverview}>Back</button>
              <div className="step-indicator">Step {index + 1}</div>
              <button className="mute-button" onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
              <video
                src={step.videoUrl}
                className="step-video"
                playsInline
                muted={isMuted}
                onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={`drawer ${isDrawerOpen ? 'open' : ''}`} onClick={(e) => e.target.classList.contains('drawer-handle') && toggleDrawer(currentStepDescription)}>
        <div className="drawer-handle">Swipe up for step details</div>
        {isDrawerOpen && <div className="drawer-content"><p>{currentStepDescription}</p></div>}
      </div>
    </div>
  );
};

export default RecipeSwipeComponent;