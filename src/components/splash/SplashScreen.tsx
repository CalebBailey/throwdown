import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/ThrowDownLogoNoBkgd.png';

const SplashContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colours.primary};
  z-index: 9999;
  overflow: hidden;
`;

const Logo = styled(motion.img)`
  width: 80%;
  max-width: 500px;
  z-index: 10;
`;

const Triangle = styled(motion.div)<{ $color: string }>`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  opacity: 0.7;
  background: ${props => props.$color};
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
`;

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    // Animation will play for 3 seconds before calling onComplete
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate random triangles with theme colors
  const triangles = [
    { color: '#1A1A2E', size: 300, x: -150, y: -100, rotate: 45, delay: 0 },
    { color: '#16213E', size: 200, x: 200, y: 150, rotate: 120, delay: 0.2 },
    { color: '#0F3460', size: 250, x: -180, y: 200, rotate: 70, delay: 0.4 },
    { color: '#E94560', size: 150, x: 100, y: -200, rotate: 10, delay: 0.6 },
    { color: '#1F4B8E', size: 180, x: -300, y: 50, rotate: 200, delay: 0.3 },
    { color: '#0F3460', size: 220, x: 250, y: -50, rotate: 160, delay: 0.5 },
    { color: '#1A1A2E', size: 280, x: 50, y: 250, rotate: 30, delay: 0.7 },
    { color: '#16213E', size: 320, x: -80, y: -220, rotate: 100, delay: 0.1 },
  ];

  return (
    <AnimatePresence>
      <SplashContainer
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {triangles.map((triangle, index) => (
          <Triangle
            key={index}
            $color={triangle.color}
            initial={{ 
              width: triangle.size,
              height: triangle.size,
              x: triangle.x, 
              y: triangle.y,
              rotate: triangle.rotate,
              scale: 0,
            }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [triangle.rotate, triangle.rotate + 20, triangle.rotate - 10],
              x: [triangle.x, triangle.x + 50, triangle.x - 30],
              y: [triangle.y, triangle.y - 40, triangle.y + 20],
              opacity: [0, 0.8, 0.6]
            }}
            transition={{ 
              duration: 2.5,
              delay: triangle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        <Logo
          src={logo}
          alt="ThrowDown Logo"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.5, 
            duration: 1, 
            type: "spring",
            stiffness: 120 
          }}
        />
      </SplashContainer>
    </AnimatePresence>
  );
};

export default SplashScreen;