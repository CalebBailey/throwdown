import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../context/GameContext';

// Standard dartboard segment order (clockwise, starting at top with 20)
const SEGMENT_ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

interface KillerDartboardProps {
  players: Player[];
  currentPlayerId?: string;
  onHitSegment: (segment: number, multiplier: string) => void;
  maxHits?: number; // Add maxHits prop to control how many hits are needed
}

const DartboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BoardSvg = styled.svg`
  max-width: 550px;
  width: 100%;
  height: auto;
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

const PlayerSegmentInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin: 12px 0;
`;

const PlayerSegmentItem = styled.div<{ color: string; isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(30, 30, 30, 0.7);
  padding: 8px 16px;
  border-radius: 10px;
  border: 2px solid ${props => props.isActive ? props.color : 'transparent'};
`;

const PlayerDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

// Define interface for the wrapper component props
interface SegmentItemWrapperProps {
  color: string;
  isActive: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

const StyledPlayerSegmentItem = ({ color, isActive, children, ...props }: SegmentItemWrapperProps) => (
  <PlayerSegmentItem color={color} isActive={isActive} {...props}>
    {children}
  </PlayerSegmentItem>
);

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

const KillerDartboard: React.FC<KillerDartboardProps> = ({ players, currentPlayerId, onHitSegment, maxHits = 3 }) => {
  const [selectedMultiplier, setSelectedMultiplier] = useState<'single' | 'double' | 'triple'>('single');
  
  // Get the current player
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  
  // Create a mapping of segments to player data for easy lookup
  const segmentPlayerMap = players.reduce((map, player) => {
    if (player.segment !== undefined && !player.isEliminated) {
      map[player.segment] = player;
    }
    return map;
  }, {} as Record<number, Player>);
  
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
  const bullseyeOuterColor = '#19304e'; // Lighter navy
  const bullseyeInnerColor = '#0c1e36'; // Dark navy
  
  // Function to get segment subsections based on player hits
  const getSegmentSections = (segmentNumber: number): { sectionFills: string[], canBeTargeted: boolean } => {

    const sectionFills = Array(maxHits).fill('none');
    let canBeTargeted = false;
    
    // If this segment belongs to a player, update section fills based on hits
    const player = segmentPlayerMap[segmentNumber];
    if (player) {
      const currentHits = player.segmentHits || 0;
      
      // Fill sections based on hits/progress (fill from center outward)
      for (let i = 0; i < currentHits && i < maxHits; i++) {
        sectionFills[i] = player.color; // Fill with player's color
      }
      
      // Mark if segment can be targeted by current killer player
      if (currentPlayer?.isKiller && player.id !== currentPlayer?.id && !player.isEliminated) {
        canBeTargeted = true;
      }
    }
    
    return { sectionFills, canBeTargeted };
  };
  
  const isCurrentPlayerSegment = (segmentNumber: number) => {
    return currentPlayer?.segment === segmentNumber;
  };
  
  return (
    <DartboardContainer>
      {/* Player segments info panel */}
      <PlayerSegmentInfo>
        {players.map(player => (
          !player.isEliminated && (
            <StyledPlayerSegmentItem 
              key={player.id} 
              color={player.color}
              isActive={player.id === currentPlayerId}
            >
              <PlayerDot color={player.color} />
              <span>{player.name}: {player.segment}</span>
              {player.isKiller && <span> (Killer)</span>}
            </StyledPlayerSegmentItem>
          )
        ))}
      </PlayerSegmentInfo>
      
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
          
          // Get segment sections data
          const { sectionFills, canBeTargeted } = getSegmentSections(segmentNumber);
          const highlightSegment = isCurrentPlayerSegment(segmentNumber);
          
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
          
          // Add glow effect to current player's segment or targetable segments
          let segmentFilter = 'none';
          if (highlightSegment) {
            segmentFilter = 'url(#playerGlow)';
          } else if (canBeTargeted) {
            // Use player-specific glow filter for targetable segments
            const targetPlayer = segmentPlayerMap[segmentNumber];
            segmentFilter = `url(#targetGlow-${targetPlayer.id})`;
          }
          
          // Calculate section boundaries - dividing the segment into maxHits equal parts
          const sectionRadiusStep = (mainSegmentOuterRadius - innerBullRadius) / maxHits;
          
          return (
            <g key={`segment-${segmentNumber}`}>
              {/* Main segment area - base color */}
              <path 
                d={createArcPath(mainSegmentOuterRadius, innerBullRadius)}
                fill={segmentBaseColor}
                stroke="#222"
                strokeWidth="0.5"
                onClick={() => handleSegmentClick(segmentNumber)}
                style={{ cursor: 'pointer', filter: segmentFilter }}
              />
              
              {/* Section divider lines */}
              {Array.from({ length: maxHits - 1 }).map((_, i) => {
                const radius = innerBullRadius + (i + 1) * sectionRadiusStep;
                const startX = 275 + radius * Math.cos(startRad);
                const startY = 275 + radius * Math.sin(startRad);
                const endX = 275 + radius * Math.cos(endRad);
                const endY = 275 + radius * Math.sin(endRad);
                
                return (
                  <path
                    key={`divider-${segmentNumber}-${i}`}
                    d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
                    stroke="#444"
                    strokeWidth="1"
                    fill="none"
                  />
                );
              })}
              
              {/* Section fill areas - from center outward */}
              {sectionFills.map((fill, i) => {
                if (fill === 'none') return null;
                
                const outerRadius = innerBullRadius + (i + 1) * sectionRadiusStep;
                const innerRadius = innerBullRadius + i * sectionRadiusStep;
                
                return (
                  <path 
                    key={`fill-${segmentNumber}-${i}`}
                    d={createArcPath(outerRadius, innerRadius)}
                    fill={fill}
                    stroke="none"
                    onClick={() => handleSegmentClick(segmentNumber)}
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}
              
              {/* Segment number text - positioned outside the board */}
              <SegmentText 
                x={textX} 
                y={textY}
                style={{
                  filter: highlightSegment ? 'drop-shadow(0 0 3px #fff)' : 'none',
                  fontWeight: segmentPlayerMap[segmentNumber] ? 'bold' : 'normal',
                }}
              >
                {segmentNumber}
              </SegmentText>
            </g>
          );
        })}
        
        {/* Outer bullseye (green) */}
        <circle 
          cx="275" 
          cy="275" 
          r={innerBullRadius} 
          fill={bullseyeOuterColor}
          stroke="#222"
          strokeWidth="0.5"
          style={{ cursor: 'pointer' }}
        />
        
        {/* Inner bullseye (red) */}
        <circle 
          cx="275" 
          cy="275" 
          r={bullseyeRadius} 
          fill={bullseyeInnerColor}
          stroke="#222"
          strokeWidth="0.5"
          style={{ cursor: 'pointer' }}
        />
        
        {/* Highlight effects for segments */}
        <defs>
          {/* Player segment glow */}
          <filter id="playerGlow" x="-30%" y="-30%" width="160%" height="160%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor={currentPlayer?.color || '#FFFFFF'} floodOpacity="0.9" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Create individual glow filters for each player's color */}
          {players.map(player => (
            <filter 
              key={`targetGlow-${player.id}`} 
              id={`targetGlow-${player.id}`} 
              x="-30%" 
              y="-30%" 
              width="160%" 
              height="160%" 
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
            >
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor={player.color} floodOpacity="0.9" result="glow" />
              <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
      </BoardSvg>
      
      <MultiplierSelector>
        <StyledMultiplierButton
          isActive={selectedMultiplier === 'single'}
          onClick={() => setSelectedMultiplier('single')}
        >
          Single (1x)
        </StyledMultiplierButton>
        <StyledMultiplierButton
          isActive={selectedMultiplier === 'double'}
          onClick={() => setSelectedMultiplier('double')}
        >
          Double (2x)
        </StyledMultiplierButton>
        <StyledMultiplierButton
          isActive={selectedMultiplier === 'triple'}
          onClick={() => setSelectedMultiplier('triple')}
        >
          Triple (3x)
        </StyledMultiplierButton>
      </MultiplierSelector>
    </DartboardContainer>
  );
};

export default KillerDartboard;