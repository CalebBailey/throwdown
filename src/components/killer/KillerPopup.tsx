import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface KillerPopupProps {
  show: boolean;
  onComplete?: () => void;
}

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: none;
`;

const PopupContent = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
`;

const Triangle = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  background: ${props => props.theme.colours.highlight};
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  opacity: 0.9;
  rotate: ${(Math.random() * 360)}deg;
`;

const KillerText = styled(motion.h1)`
  position: relative;
  z-index: 10;
  font-size: 72px;
  font-weight: bold;
  color: ${props => props.theme.colours.highlight};
  text-shadow: 
    4px 4px 0px ${props => props.theme.colours.secondary},
    4px 4px 10px rgba(15, 52, 96, 0.8);
  margin: 0;
  letter-spacing: 2px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 56px;
  }
`;

const KillerPopup: React.FC<KillerPopupProps> = ({ show, onComplete }) => {
  React.useEffect(() => {
    if (show && onComplete) {
      // Animation duration: 2 seconds
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <PopupOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PopupContent>
            <Triangle
              initial={{ 
                scale: 0,
                rotate: 0,
                opacity: 0
              }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [0, 10, -5, 0],
                opacity: [0, 0.9, 0.9]
              }}
              exit={{
                scale: 0,
                rotate: 180,
                opacity: 0
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.6, 1]
              }}
            />
            
            <KillerText
              initial={{ 
                scale: 0,
                opacity: 0,
                y: -50
              }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1],
                y: [-50, 0, 0]
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
                y: 50
              }}
              transition={{ 
                delay: 0.3,
                duration: 1.2,
                ease: "easeOut",
                times: [0, 0.6, 1]
              }}
            >
              KILLER!
            </KillerText>
          </PopupContent>
        </PopupOverlay>
      )}
    </AnimatePresence>
  );
};

export default KillerPopup;
