import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Player } from '../../context/GameContext';

interface KillerScorecardProps {
  players: Player[];
  currentPlayerId?: string;
  maxHits: number;
}

const ScorecardContainer = styled.div`
  background: linear-gradient(to bottom, rgba(30, 30, 30, 0.7), rgba(40, 40, 40, 0.7));
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 8px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Subtitle = styled.div`
  font-size: 0.95rem;
  margin-bottom: 16px;
  opacity: 0.8;
`;

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlayerRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: ${p => p.$active ? 'rgba(233, 69, 96, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border-left: 4px solid ${p => p.$active ? '#E94560' : 'transparent'};
  transition: all 0.2s ease;
`;

const PlayerAvatar = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
`;

const SegmentLabel = styled.div`
  min-width: 38px;
  text-align: center;
  font-weight: 500;
  opacity: 0.9;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  position: relative;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)<{ color: string; isKiller: boolean }>`
  height: 100%;
  background-color: ${props => props.isKiller ? '#E94560' : props.color};
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
  transition: background-color 0.3s ease;
  box-shadow: ${props => props.isKiller ? '0 0 10px rgba(233, 69, 96, 0.8), 0 0 20px rgba(233, 69, 96, 0.4)' : 'none'};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const ScoreLabel = styled.div`
  min-width: 60px;
  text-align: right;
  font-weight: 500;
  opacity: 0.9;
`;

// Wrapper components to avoid DOM prop warnings
interface PlayerRowWrapperProps {
  active: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

interface ProgressBarWrapperProps {
  percentage: number;
  color: string;
  isKiller: boolean;
  [key: string]: any;
}

const StyledPlayerRow = ({ active, children, ...props }: PlayerRowWrapperProps) => (
  <PlayerRow $active={active} {...props}>
    {children}
  </PlayerRow>
);

const StyledProgressBar = ({ percentage, color, isKiller, ...props }: ProgressBarWrapperProps) => (
  <ProgressBar 
    color={color} 
    isKiller={isKiller}
    initial={{ width: 0 }}
    animate={{ width: `${percentage}%` }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    {...props} 
  />
);

const KillerScorecard: React.FC<KillerScorecardProps> = ({ players, currentPlayerId, maxHits }) => {
  // Sort players: active player first, then by killer status, then by eliminated status
  const sortedPlayers = [...players].sort((a, b) => {
    // Current player first
    if (a.id === currentPlayerId) return -1;
    if (b.id === currentPlayerId) return 1;
    
    // Eliminated players last
    if (a.isEliminated && !b.isEliminated) return 1;
    if (!a.isEliminated && b.isEliminated) return -1;
    
    // Killers before non-killers
    if (a.isKiller && !b.isKiller) return -1;
    if (!a.isKiller && b.isKiller) return 1;
    
    // Sort by progress to becoming killer
    return (b.segmentHits || 0) - (a.segmentHits || 0);
  });
  
  return (
    <ScorecardContainer>
      <Title>Player Status</Title>
      <Subtitle>Required: {maxHits} hits</Subtitle>
      
      <PlayerList>
        {sortedPlayers.map(player => {
          const percentage = player.isKiller 
            ? 100 
            : player.isEliminated 
              ? 0 
              : ((player.segmentHits || 0) / maxHits) * 100;
          
          return (
            <StyledPlayerRow
              key={player.id}
              active={player.id === currentPlayerId}
            >
              <PlayerAvatar color={player.colour}>
                {player.name[0]}
              </PlayerAvatar>
              
              <SegmentLabel>{player.segment}</SegmentLabel>
              
              <ProgressTrack>
                <StyledProgressBar 
                  percentage={percentage}
                  color={player.colour}
                  isKiller={player.isKiller || false} 
                />
              </ProgressTrack>
              
              <ScoreLabel>
                {player.segmentHits || 0}/{maxHits}
              </ScoreLabel>
            </StyledPlayerRow>
          );
        })}
      </PlayerList>
    </ScorecardContainer>
  );
};

export default KillerScorecard;