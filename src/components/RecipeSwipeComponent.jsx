import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { VolumeIcon, MuteIcon, ChevronLeftIcon } from '../assets/Icons';
import 'swiper/css';

const RecipeSwipeComponent = ({ recipe }) => {
  const {
    name,
    cuisine,
    time,
    servings,
    calories,
    ingredients,
    steps,
    overviewVideoUrl,
    overviewDescription,
    imageUrl,
  } = recipe;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStepDescription, setCurrentStepDescription] = useState(overviewDescription);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');

  const overviewVideoRef = useRef(null);

  const toggleDrawer = (description) => {
    setCurrentStepDescription(description);
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = (e) => {
    if (e.target.classList.contains('drawer-overlay') || e.target.classList.contains('recipe-swipe-wrapper')) {
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

  const toggleVideoPlayPause = () => {
    if (overviewVideoRef.current) {
      if (overviewVideoRef.current.paused) {
        overviewVideoRef.current.play();
      } else {
        overviewVideoRef.current.pause();
      }
    }
  };

  return (
    <RecipeSwipeWrapper className="recipe-swipe-wrapper" onClick={closeDrawer}>
      {isDrawerOpen && <DrawerOverlay onClick={() => setIsDrawerOpen(false)} />}
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        allowTouchMove={!isDrawerOpen}
        onSlideChange={handleSlideChange}
      >
        <SwiperSlide>
          <RecipeOverview>
            <OverviewVideoContainer onClick={toggleVideoPlayPause}>
              <OverviewVideo
                ref={overviewVideoRef}
                src={overviewVideoUrl}
                playsInline
                muted={isMuted}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
              {!isVideoPlaying && (
                <OverviewImage src={imageUrl} alt={name} />
              )}
            </OverviewVideoContainer>
            <Title>{name}</Title>
            <RecipeInfoCards>
              <RecipeCard>
                <RecipeCardHeader>Cuisine</RecipeCardHeader>
                <RecipeCardContent>{cuisine}</RecipeCardContent>
              </RecipeCard>
              <RecipeCard>
                <RecipeCardHeader>Time</RecipeCardHeader>
                <RecipeCardContent>{time}</RecipeCardContent>
              </RecipeCard>
              <RecipeCard>
                <RecipeCardHeader>Servings</RecipeCardHeader>
                <RecipeCardContent>{servings}</RecipeCardContent>
              </RecipeCard>
              <RecipeCard>
                <RecipeCardHeader>Calories</RecipeCardHeader>
                <RecipeCardContent>{calories} kcal</RecipeCardContent>
              </RecipeCard>
            </RecipeInfoCards>
          </RecipeOverview>
        </SwiperSlide>

        {steps.map((step, index) => (
          <SwiperSlide key={index}>
            <RecipeStep>
              <BackButton onClick={goToOverview}><ChevronLeftIcon className='w-6 h-6' /></BackButton>
              <StepIndicator>Step {index + 1}</StepIndicator>
              <MuteButton onClick={toggleMute}>{isMuted ? <MuteIcon className='w-6 h-6' /> : <VolumeIcon className='w-6 h-6' />}</MuteButton>
              <StepVideo
                src={step.videoUrl}
                playsInline
                muted={isMuted}
                onClick={(e) => (e.target.paused ? e.target.play() : e.target.pause())}
              />
            </RecipeStep>
          </SwiperSlide>
        ))}
      </Swiper>

      <Drawer isOpen={isDrawerOpen}>
        
          <DrawerHandle onClick={() => toggleDrawer(currentStepDescription)}>
          {!isDrawerOpen && (
            <DrawerHandleText>Swipe up for instructions</DrawerHandleText>
          )}
          </DrawerHandle>
        
        {isDrawerOpen && (
          <DrawerContent>
            <Tabs>
              <TabButton
                isActive={activeTab === 'ingredients'}
                onClick={() => setActiveTab('ingredients')}
              >
                Ingredients
              </TabButton>
              <TabButton
                isActive={activeTab === 'steps'}
                onClick={() => setActiveTab('steps')}
              >
                Steps
              </TabButton>
            </Tabs>
            {activeTab === 'ingredients' && (
              <IngredientContent>
                {ingredients.map((ingredient, index) => (
                  <div key={index}>{ingredient}</div>
                ))}
              </IngredientContent>
            )}
            {activeTab === 'steps' && <StepContent>{currentStepDescription}</StepContent>}
          </DrawerContent>
        )}
      </Drawer>
    </RecipeSwipeWrapper>
  );
};

export default RecipeSwipeComponent;

const RecipeSwipeWrapper = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  height: 100svh;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
`;

const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
`;

const RecipeOverview = styled.div`
  width: 100%;
  height: 100%;
`;

const OverviewVideoContainer = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  cursor: pointer;
`;

const OverviewVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OverviewImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 5px;
`;

const RecipeInfoCards = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  background-color: rgba(255, 255, 255, 0.8);
`;

const RecipeCard = styled.div`
  margin: 5px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const RecipeCardHeader = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 5px;
`;

const RecipeCardContent = styled.div`
  font-size: 1em;
  color: #555;
`;

const RecipeStep = styled.div`
  width: 100%;
  height: 100%;
`;

const StepVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Drawer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(80%)')};
  background-color: #fff;
  transition: transform 0.3s ease;
  z-index: 10;
  overflow-y: auto;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
`;

const DrawerHandle = styled.div`
  text-align: center;
  color: #555;
  padding: 15px;
  cursor: pointer;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background-color: #ccc;
    border-radius: 10px;
  }
`;

const DrawerHandleText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #888;
`;

const DrawerContent = styled.div`
  padding: 15px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TabButton = styled.button`
  flex: 1;
  background: ${({ isActive }) => (isActive ? '#555' : '#f0f0f0')};
  color: ${({ isActive }) => (isActive ? '#fff' : '#555')};
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin: 0 5px;

  &:hover {
    background: ${({ isActive }) => (isActive ? '#555' : '#ddd')};
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 1em;
  z-index: 15;
`;

const StepIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 1em;
  z-index: 15;
`;

const MuteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 1em;
  z-index: 15;
`;

const IngredientContent = styled.div`
  display: grid;
  gap: 2px;
`;

const StepContent = styled.div`
  padding: 10px;
  font-size: 1em;
  color: #555;
`;
