// IMPORTS
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { ClockIcon, HeartIcon, ForkAndKnifeIcon } from '../assets/Icons';
import BookmarkCheckbox from './Bookmark';

// CREATE FUNCTION
export default function CookbookCard({ recipe }) {
  // STATE VARIABLES
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  // Destructure the recipe object for easier access
  const {
    title,
    imageUrl,
    videoUrl,
    chef,
    time,
    cuisine,
    likes,
    profilePic,
  } = recipe;

  // EVENT HANDLERS        
  const handleImageClick = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoClick = () => {
    setIsVideoPlaying(false);
  };

  // Inline styles
  const cardContainerStyle = {
    position: 'relative',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    backgroundColor: '#bfdbfe', // Tailwind's bg-blue-200
    aspectRatio: '6 / 5',
  };

  const chefNameStyle = {
    position: 'absolute',
    top: '0.5rem', // Tailwind's top-2
    left: '0.5rem', // Tailwind's left-2
    fontWeight: '600', // Tailwind's font-semibold
    color: '#ffffff', // Tailwind's text-white
    fontSize: '1.125rem', // Tailwind's text-lg
    zIndex: 20,
  };

  const likesStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    fontWeight: '600',
    color: '#ffffff',
    fontSize: '1.125rem',
    zIndex: 20,
    textAlign: 'center',
  };

  const imageContainerStyle = {
    height: '70%',
    overflow: 'hidden',
    position: 'relative',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: 'pointer',
  };

  const videoWrapperStyle = {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  };

  const contentStyle = {
    height: '100%',
    backgroundColor: '#ffffff',
    padding: '0.5rem'
  };

  const titleStyle = {
    fontWeight: '600',
    fontSize: '1.25rem', // Tailwind's text-xl
    textAlign: 'left',
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Tailwind's grid-cols-2
    gap: '0.5rem', // Tailwind's gap-2
  };

  const gridItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const iconStyle = {
    width: '2rem', // Tailwind's w-8
    height: '2rem', // Tailwind's h-8
  };

  const textStyle = {
    fontWeight: '600',
    fontSize: '1.125rem', // Tailwind's text-lg
    textAlign: 'center',
  };

  // HTML
  return (
    <div style={cardContainerStyle}>
      <div style={chefNameStyle}>{chef}</div>
      <div style={likesStyle}>
        <BookmarkCheckbox style={{ width: '2.5rem', height: '2.5rem' }} />
        <p>{likes}</p>
      </div>
      <div style={imageContainerStyle}>
        {isVideoPlaying ? (
          <div onClick={handleVideoClick} style={videoWrapperStyle}>
            <ReactPlayer
              url={videoUrl}
              playing
              controls={false}
              width="100%"
              height="100%"
            />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            style={imageStyle}
            onClick={handleImageClick}
          />
        )}
      </div>
      <div style={contentStyle}>
        <p style={titleStyle}>{title}</p>
        <div style={gridContainerStyle}>
          <div style={gridItemStyle}>
            <ClockIcon className="w-6 h-6" />
            <p style={textStyle}>{time}</p>
          </div>
          <div style={gridItemStyle}>
            <ForkAndKnifeIcon className="w-6 h-6" />
            <p style={textStyle}>{cuisine}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
