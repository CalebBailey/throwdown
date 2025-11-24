import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../context/GameContext';

// Standard dartboard segment order (clockwise, starting at top with 20)
const SEGMENT_ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

interface ShanghaiDartboardProps {
  currentPlayer: Player;
  currentSegment: number;
  onHitSegment: (segment: number, multiplier: string) => void;
}

const DartboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BoardSvg = styled.svg`
  max-width: 500px;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
`;

const SegmentText = styled.text`
  font-size: 18px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #FFF;
  user-select: none;
`;

const MultiplierSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
  width: 100%;
`;

const MultiplierButton = styled.button<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? '#E94560' : 'rgba(30, 30, 30, 0.7)'};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
  flex: 1;
  max-width: 150px;
  
  &:hover {
    background-color: ${props => !props.isActive && 'rgba(60, 60, 60, 0.7)'};
  }
`;

const CurrentSegmentInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
  background-color: rgba(30, 30, 30, 0.7);
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 18px;
`;

const SegmentHighlight = styled.span`
  color: #E94560;
  font-size: 20px;
`;

// Define interface for the multiplier button wrapper component props
interface MultiplierButtonWrapperProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  [key: string]: any;
}

// Create a wrapper component for MultiplierButton to avoid DOM prop warnings
const StyledMultiplierButton = ({ isActive, children, onClick, ...props }: MultiplierButtonWrapperProps) => (
  <MultiplierButton isActive={isActive} onClick={onClick} {...props}>
    {children}
  </MultiplierButton>
);

const ShanghaiDartboard: React.FC<ShanghaiDartboardProps> = ({ currentPlayer, currentSegment, onHitSegment }) => {
  const [selectedMultiplier, setSelectedMultiplier] = useState<'single' | 'double' | 'triple'>('single');
  
  const handleSegmentClick = (segment: number) => {
    onHitSegment(segment, selectedMultiplier);
  };
  
  // Define dartboard dimensions
  const boardRadius = 220;
  const numberRadius = boardRadius + 30; // Position for numbers outside the board
  const outerDoubleRingInnerRadius = boardRadius - 8;
  const mainSegmentOuterRadius = outerDoubleRingInnerRadius;
  const innerBullRadius = 32; // Outer bullseye
  const bullseyeRadius = 15; // Inner bullseye
  
  // Define colors for the dartboard
  const segmentBaseColor = '#263d5a'; // Dark blue
  const activeSegmentColor = '#E94560'; // Highlighted segment color
  const bullseyeOuterColor = '#19304e'; // Lighter navy
  const bullseyeInnerColor = '#0c1e36'; // Dark navy
  
  // Function to check if a segment is the current active segment
  const isActiveSegment = (segmentNumber: number) => {
    return segmentNumber === currentSegment;
  };
  
  return (
    <DartboardContainer>
      <CurrentSegmentInfo>
        Current Segment: <SegmentHighlight>{currentSegment}</SegmentHighlight>
      </CurrentSegmentInfo>
      
      <BoardSvg viewBox="0 0 550 550" xmlns="http://www.w3.org/2000/svg">
        {/* Board background */}
        <circle cx="275" cy="275" r={boardRadius + 10} fill="#121212" />
        
        {/* Draw all segments - 20 segments total */}
        {SEGMENT_ORDER.map((segmentNumber, index) => {
          // Each segment spans 18 degrees (360 / 20)
          const segmentAngle = 18; // 360 / 20 = 18 degrees per segment
          const startAngle = 270 - 9 + (index * segmentAngle); // Start 9 degrees to the left of vertical
          const endAngle = startAngle + segmentAngle;
          
          // Convert to radians for trigonometric calculations
          const startRad = (startAngle % 360) * Math.PI / 180;
          const endRad = (endAngle % 360) * Math.PI / 180;
          
          // Determine if this segment is active
          const isActive = isActiveSegment(segmentNumber);
          
          // Calculate position for segment number text - outside the board
          const textRad = ((startAngle + endAngle) / 2) * Math.PI / 180;
          const textX = 275 + numberRadius * Math.cos(textRad);
          const textY = 275 + numberRadius * Math.sin(textRad);
          
          // Helper function to create arc path for segments
          const createArcPath = (outerR: number, innerR: number) => {
            const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? "1" : "0";
            
            // Calculate points on outer arc
            const outerStartX = 275 + outerR * Math.cos(startRad);
            const outerStartY = 275 + outerR * Math.sin(startRad);
            const outerEndX = 275 + outerR * Math.cos(endRad);
            const outerEndY = 275 + outerR * Math.sin(endRad);
            
            // Calculate points on inner arc
            const innerStartX = 275 + innerR * Math.cos(startRad);
            const innerStartY = 275 + innerR * Math.sin(startRad);
            const innerEndX = 275 + innerR * Math.cos(endRad);
            const innerEndY = 275 + innerR * Math.sin(endRad);
            
            return `
              M ${outerStartX} ${outerStartY}
              A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}
              L ${innerEndX} ${innerEndY}
              A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
              Z
            `;
          };
          
          // Add glow effect to active segments
          let segmentFilter = 'none';
          let segmentFill = segmentBaseColor;
          
          if (isActive) {
            segmentFilter = 'url(#activeSegmentGlow)';
            segmentFill = activeSegmentColor;
          }
          
          return (
            <g key={`segment-${segmentNumber}`}>
              {/* Main segment area */}
              <path 
                d={createArcPath(mainSegmentOuterRadius, innerBullRadius)}
                fill={segmentFill}
                stroke="#222"
                strokeWidth="0.5"
                onClick={() => handleSegmentClick(segmentNumber)}
                style={{ cursor: isActive ? 'pointer' : 'default', filter: segmentFilter }}
              />
              
              {/* Segment number text - positioned outside the board */}
              <SegmentText 
                x={textX} 
                y={textY}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 3px #fff)' : 'none',
                  fontWeight: isActive ? 'bold' : 'normal',
                  fill: isActive ? '#E94560' : '#FFF'
                }}
              >
                {segmentNumber}
              </SegmentText>
            </g>
          );
        })}
        
        {/* Outer bullseye */}
        <circle 
          cx="275" 
          cy="275" 
          r={innerBullRadius} 
          fill={bullseyeOuterColor}
          stroke="#222"
          strokeWidth="0.5"
          style={{ cursor: 'pointer' }}
          onClick={() => handleSegmentClick(25)} // Bullseye is traditionally 25 points
        />
        
        {/* Inner bullseye */}
        <circle 
          cx="275" 
          cy="275" 
          r={bullseyeRadius} 
          fill={bullseyeInnerColor}
          stroke="#222"
          strokeWidth="0.5"
          style={{ cursor: 'pointer' }}
          onClick={() => handleSegmentClick(50)} // Double bullseye is 50 points
        />
        
        {/* Define filters for highlight effects */}
        <defs>
          {/* Active segment glow */}
          <filter id="activeSegmentGlow" x="-30%" y="-30%" width="160%" height="160%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#E94560" floodOpacity="0.9" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </BoardSvg>
      
      <MultiplierSelector>
        <StyledMultiplierButton
          isActive={selectedMultiplier === 'single'}
          onClick={() => setSelectedMultiplier('single')}
        >
          Single (x1)
        </StyledMultiplierButton>
        <StyledMultiplierButton
          isActive={selectedMultiplier === 'double'}
          onClick={() => setSelectedMultiplier('double')}
        >
          Double (x2)
        </StyledMultiplierButton>
        <StyledMultiplierButton
          isActive={selectedMultiplier === 'triple'}
          onClick={() => setSelectedMultiplier('triple')}
        >
          Triple (x3)
        </StyledMultiplierButton>
      </MultiplierSelector>
    </DartboardContainer>
  );
};

export default ShanghaiDartboard;