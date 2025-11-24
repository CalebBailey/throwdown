import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget } from 'react-icons/fi';

interface GameRestoredBannerProps {
  show: boolean;
}

const Banner = styled(motion.div)`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colours.highlight};
  color: ${props => props.theme.colours.text};
  padding: ${props => props.theme.space.md} ${props => props.theme.space.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  font-weight: 500;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.sm};
    padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
    top: 10px;
  }
`;

const GameRestoredBanner: React.FC<GameRestoredBannerProps> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <Banner
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <FiTarget /> Game restored from previous session
        </Banner>
      )}
    </AnimatePresence>
  );
};

export default GameRestoredBanner;
