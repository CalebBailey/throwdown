import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CirclePicker, ColorResult } from 'react-color';
import { motion, AnimatePresence } from 'framer-motion';

interface ColourPickerPopupProps {
  isOpen: boolean;
  currentColour: string;
  onColourChange: (colour: string) => void;
  onClose: () => void;
  anchorPosition: { top: number; left: number } | null;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const PopupContainer = styled(motion.div)<{ top: number; left: number }>`
  position: fixed;
  bottom: calc(100vh - ${props => props.top}px);
  left: ${props => props.left}px;
  z-index: 1000;
  transform: translateX(-50%);
  padding-bottom: 12px;
`;

const SpeechBubble = styled.div`
  background: rgba(22, 33, 62, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.theme.colours.highlight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.space.md};
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
  width: fit-content;
  
  /* Speech bubble tail - outer border */
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid ${props => props.theme.colours.highlight};
  }
  
  /* Speech bubble tail - inner fill */
  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid rgba(22, 33, 62, 0.95);
    z-index: 1;
  }
`;

const PickerTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colours.text};
  margin-bottom: ${props => props.theme.space.sm};
  text-align: center;
  font-weight: 500;
`;

const StyledCirclePicker = styled.div`
  .circle-picker {
    justify-content: center !important;
  }
  
  /* Override react-colour default styles */
  span > div {
    border-radius: 50% !important;
    
    transition: transform 0.2s ease-in-out !important;
    
    &:hover {
      transform: scale(1.15) !important;
    }
  }
`;

// Predefined colour palette
const COLOURS = [
  '#E94560', // Red (highlight)
  '#FF6B6B', // Coral red
  '#FFA500', // Orange
  '#FFD700', // Gold
  '#90EE90', // Light green
  '#4CAF50', // Green
  '#00CED1', // Turquoise
  '#1E90FF', // Dodger blue
  '#6A5ACD', // Slate blue
  '#9370DB', // Medium purple
  '#FF69B4', // Hot pink
  '#FF1493', // Deep pink
  '#C0C0C0', // Silver
  '#FFFFFF', // White
];

export const ColourPickerPopup: React.FC<ColourPickerPopupProps> = ({
  isOpen,
  currentColour,
  onColourChange,
  onClose,
  anchorPosition,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleColourChange = (colour: ColorResult) => {
    onColourChange(colour.hex);
  };

  if (!anchorPosition) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <PopupContainer
            ref={popupRef}
            top={anchorPosition.top}
            left={anchorPosition.left}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <SpeechBubble>
              <PickerTitle>Choose a colour</PickerTitle>
              <StyledCirclePicker>
                <CirclePicker
                  color={currentColour}
                  colors={COLOURS}
                  onChangeComplete={handleColourChange}
                  width="280px"
                  circleSize={28}
                  circleSpacing={8}
                />
              </StyledCirclePicker>
            </SpeechBubble>
          </PopupContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default ColourPickerPopup;
