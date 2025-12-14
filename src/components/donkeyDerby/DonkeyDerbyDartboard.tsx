import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../context/GameContext';

const SEGMENT_ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

interface DonkeyDerbyDartboardProps {
  players: Player[];
  currentPlayer: Player;
  onHitSegment: (segment: number, multiplier: 'single' | 'double' | 'triple') => void;
}

const DartboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BoardSvg = styled.svg`
  max-width: 50vh;
  width: 100%;
  max-height: 50vh;
  height: 100%;
  aspect-ratio: 1 / 1;
`;

const SegmentText = styled.text`
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #FFF;
  user-select: none;
`;

const PlayerSegmentInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin: 12px 0;
`;

const PlayerSegmentItem = styled.div<{ color: string; $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(30, 30, 30, 0.7);
  padding: 8px 16px;
  border-radius: 10px;
  border: 2px solid ${props => props.$isActive ? props.color : 'transparent'};
`;

const PlayerDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const MultiplierSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
  width: 120%;
`;

const MultiplierButton = styled.button<{ $isActive: boolean }>`
  background-color: ${props => props.$isActive ? '#E94560' : 'rgba(30, 30, 30, 0.7)'};
  color: ${props => props.theme.colours.text};
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'};
  flex: 1;
  max-width: 150px;
  
  &:hover {
    background-color: ${props => !props.$isActive && 'rgba(60, 60, 60, 0.7)'};
  }
`;

// Define interface for the segment item wrapper component props
interface SegmentItemWrapperProps {
  color: string;
  isActive: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

const StyledPlayerSegmentItem = ({ color, isActive, children, ...props }: SegmentItemWrapperProps) => (
  <PlayerSegmentItem color={color} $isActive={isActive} {...props}>
    {children}
  </PlayerSegmentItem>
);

interface MultiplierButtonWrapperProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  [key: string]: any;
}

const StyledMultiplierButton = ({ isActive, children, onClick, ...props }: MultiplierButtonWrapperProps) => (
  <MultiplierButton $isActive={isActive} onClick={onClick} {...props}>
    {children}
  </MultiplierButton>
);


const DonkeyDerbyDartboard: React.FC<DonkeyDerbyDartboardProps> = ({ players, currentPlayer, onHitSegment }) => {
  const [selectedMultiplier, setSelectedMultiplier] = useState<'single' | 'double' | 'triple'>('single');
  const boardRadius = 220;
  const numberRadius = boardRadius + 26;
  const outerDoubleRingInnerRadius = boardRadius - 8;
  const mainSegmentOuterRadius = outerDoubleRingInnerRadius;
  const innerBullRadius = 32;
  const bullseyeRadius = 15;

  const handleClick = (seg: number) => onHitSegment(seg, selectedMultiplier);
  const segmentBase = '#263d5a';
  const bullOuter = '#19304e';
  const bullInner = '#0c1e36';

  const segmentOwnerMap: Record<number, Player | undefined> = {};
  players.forEach(p => { if (p.segment) segmentOwnerMap[p.segment] = p; });

  return (
    <DartboardContainer>
      <BoardSvg viewBox="0 0 550 550">
        <circle cx="275" cy="275" r={boardRadius + 10} fill="#121212" />
        {SEGMENT_ORDER.map((segmentNumber, index) => {
          const segmentAngle = 18;
          const startAngle = 270 - 9 + (index * segmentAngle);
            const endAngle = startAngle + segmentAngle;
          const startRad = (startAngle % 360) * Math.PI / 180;
          const endRad = (endAngle % 360) * Math.PI / 180;
          const owner = segmentOwnerMap[segmentNumber];
          const isCurrentPlayers = owner && owner.id === currentPlayer.id;
          const textRad = ((startAngle + endAngle) / 2) * Math.PI / 180;
          const textX = 275 + numberRadius * Math.cos(textRad);
          const textY = 275 + numberRadius * Math.sin(textRad);

          const createArcPath = (outerR: number, innerR: number) => {
            const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? '1' : '0';
            const outerStartX = 275 + outerR * Math.cos(startRad);
            const outerStartY = 275 + outerR * Math.sin(startRad);
            const outerEndX = 275 + outerR * Math.cos(endRad);
            const outerEndY = 275 + outerR * Math.sin(endRad);
            const innerStartX = 275 + innerR * Math.cos(startRad);
            const innerStartY = 275 + innerR * Math.sin(startRad);
            const innerEndX = 275 + innerR * Math.cos(endRad);
            const innerEndY = 275 + innerR * Math.sin(endRad);
            return `M ${outerStartX} ${outerStartY} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY} L ${innerEndX} ${innerEndY} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY} Z`;
          };

          const stroke = isCurrentPlayers ? '#ffffffff' : '#222';
          const strokeWidth = isCurrentPlayers ? 3 : 0.5;

          // Determine fill and glow filter
          let fill = segmentBase;
          let segmentFilter = 'none';
          
          if (owner) {
            // Use gradient fill for owned segments
            if (isCurrentPlayers) {
              fill = `url(#gradient-current-${segmentNumber})`;
              segmentFilter = 'url(#currentPlayerGlow)';
            } else {
              fill = `url(#gradient-${owner.id}-${segmentNumber})`;
              segmentFilter = `url(#playerGlow-${owner.id})`;
            }
          }

          return (
            <g key={segmentNumber} onClick={() => handleClick(segmentNumber)} className="cursor-pointer">
              <path 
                d={createArcPath(mainSegmentOuterRadius, innerBullRadius)} 
                fill={fill} 
                stroke={stroke} 
                strokeWidth={strokeWidth}
                style={{ filter: segmentFilter }}
              />
              <SegmentText x={textX} y={textY} className={isCurrentPlayers ? 'text-current-player' : 'text-default'}>{segmentNumber}</SegmentText>
            </g>
          );
        })}
        <circle cx="275" cy="275" r={innerBullRadius} fill={bullOuter} />
        <circle cx="275" cy="275" r={bullseyeRadius} fill={bullInner} />
        
        {/* Glow effects for segments */}
        <defs>
          {/* Animated gradients for each player's segments */}
          {SEGMENT_ORDER.map((segmentNumber, index) => {
            const owner = segmentOwnerMap[segmentNumber];
            if (!owner) return null;
            
            const isCurrentPlayers = owner.id === currentPlayer.id;
            const gradientId = isCurrentPlayers ? `gradient-current-${segmentNumber}` : `gradient-${owner.id}-${segmentNumber}`;
            
            // Calculate the angle for this segment (same as used for positioning)
            const segmentAngle = 18;
            const startAngle = 270 - 9 + (index * segmentAngle);
            const midAngle = startAngle + segmentAngle / 2;
            const angleRad = midAngle * Math.PI / 180;
            
            // Calculate gradient direction based on the segment angle
            // For current player: point outward (toward numbers) - wave moves outward
            // For other players: point inward (toward center) - wave moves inward
            const x1 = isCurrentPlayers ? 50 - 50 * Math.cos(angleRad) : 50 + 50 * Math.cos(angleRad);
            const y1 = isCurrentPlayers ? 50 - 50 * Math.sin(angleRad) : 50 + 50 * Math.sin(angleRad);
            const x2 = isCurrentPlayers ? 50 + 50 * Math.cos(angleRad) : 50 - 50 * Math.cos(angleRad);
            const y2 = isCurrentPlayers ? 50 + 50 * Math.sin(angleRad) : 50 - 50 * Math.sin(angleRad);
            
            return (
              <linearGradient 
                key={gradientId}
                id={gradientId}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
              >
                {isCurrentPlayers ? (
                  // Current player - wave moving outward (center to edge)
                  <>
                    <stop offset="0%" stopColor={owner.colour} stopOpacity="0.3">
                      <animate attributeName="stop-opacity" values="0.3;1;0.9;0.3" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="20%" stopColor={owner.colour} stopOpacity="0.5">
                      <animate attributeName="stop-opacity" values="0.5;0.3;1;0.9;0.5" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="40%" stopColor={owner.colour} stopOpacity="0.7">
                      <animate attributeName="stop-opacity" values="0.7;0.5;0.3;1;0.9;0.7" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="60%" stopColor={owner.colour} stopOpacity="0.9">
                      <animate attributeName="stop-opacity" values="0.9;0.7;0.5;0.3;1;0.9" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="80%" stopColor={owner.colour} stopOpacity="1">
                      <animate attributeName="stop-opacity" values="1;0.9;0.7;0.5;0.3;1" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor={owner.colour} stopOpacity="0.8">
                      <animate attributeName="stop-opacity" values="0.8;1;0.9;0.7;0.5;0.8" dur="2s" repeatCount="indefinite" />
                    </stop>
                  </>
                ) : (
                  // Other players - wave moving inward (edge to center) - reversed animation
                  <>
                    <stop offset="0%" stopColor={owner.colour} stopOpacity="0.8">
                      <animate attributeName="stop-opacity" values="0.8;0.5;0.7;0.9;1;0.8" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="20%" stopColor={owner.colour} stopOpacity="1">
                      <animate attributeName="stop-opacity" values="1;0.3;0.5;0.7;0.9;1" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="40%" stopColor={owner.colour} stopOpacity="0.9">
                      <animate attributeName="stop-opacity" values="0.9;1;0.3;0.5;0.7;0.9" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="60%" stopColor={owner.colour} stopOpacity="0.7">
                      <animate attributeName="stop-opacity" values="0.7;0.9;1;0.3;0.5;0.7" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="80%" stopColor={owner.colour} stopOpacity="0.5">
                      <animate attributeName="stop-opacity" values="0.5;0.7;0.9;1;0.3;0.5" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor={owner.colour} stopOpacity="0.3">
                      <animate attributeName="stop-opacity" values="0.3;0.9;0.5;0.7;1;0.3" dur="2s" repeatCount="indefinite" />
                    </stop>
                  </>
                )}
              </linearGradient>
            );
          })}
          
          {/* Current player segment glow - enhanced and more visible */}
          <filter id="currentPlayerGlow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={currentPlayer.colour} floodOpacity="1" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Create individual glow filters for each player's owned segments - brighter */}
          {players.map(player => (
            <filter 
              key={`playerGlow-${player.id}`} 
              id={`playerGlow-${player.id}`} 
              x="-40%" 
              y="-40%" 
              width="180%" 
              height="180%" 
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
            >
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor={player.colour} floodOpacity="0.9" result="glow" />
              <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
      </BoardSvg>
      
      {/* Player segments info panel */}
      <PlayerSegmentInfo>
        {players.map(player => (
          <StyledPlayerSegmentItem 
            key={player.id} 
            color={player.colour}
            isActive={player.id === currentPlayer.id}
          >
            <PlayerDot color={player.colour} />
            <span>{player.name}: {player.segment}</span>
          </StyledPlayerSegmentItem>
        ))}
      </PlayerSegmentInfo>
      
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

export default DonkeyDerbyDartboard;