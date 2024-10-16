import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe for the bookmark pop animation
const bookmarkPop = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1.1);
  }
`;

// Styled Components
const BookmarkCheckboxContainer = styled.div`
  display: inline-block;
`;

const HiddenCheckbox = styled.input`
  display: none;
`;

const Label = styled.label`
  cursor: pointer;
`;

const Icon = styled.svg`
  width: 2em;
  height: 2em;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.3s, fill 0.3s;
`;

const IconBack = styled.path`
  stroke: #333;
  transition: transform 0.3s;
`;

const IconCheck = styled.path`
  stroke: #fff;
  stroke-dasharray: 16;
  stroke-dashoffset: 16;
  transition: stroke-dashoffset 0.3s, transform 0.3s;
  transform: translateX(2px);
`;

// Conditional styles when checkbox is checked
const CheckedIcon = styled(Icon)`
  fill: #ff5a5f;
`;

const CheckedIconBack = styled(IconBack)`
  stroke: #ff5a5f;
  transform: scale(1.1);
  animation: ${bookmarkPop} 0.4s ease;
`;

const CheckedIconCheck = styled(IconCheck)`
  stroke-dashoffset: 0;
  transition-delay: 0.2s;
`;

// React Component
const BookmarkCheckbox = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <BookmarkCheckboxContainer>
      <HiddenCheckbox
        type="checkbox"
        id="bookmark-toggle"
        checked={isChecked}
        onChange={handleToggle}
      />
      <Label htmlFor="bookmark-toggle">
        {isChecked ? (
          <CheckedIcon viewBox="0 0 24 24">
            <CheckedIconBack d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            <CheckedIconCheck d="M8 11l3 3 5-5" />
          </CheckedIcon>
        ) : (
          <Icon viewBox="0 0 24 24">
            <IconBack d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            <IconCheck d="M8 11l3 3 5-5" />
          </Icon>
        )}
      </Label>
    </BookmarkCheckboxContainer>
  );
};

export default BookmarkCheckbox;
