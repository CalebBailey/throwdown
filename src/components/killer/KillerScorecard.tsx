import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTarget, FiX } from 'react-icons/fi';
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
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlayerName = styled.div<{ isKiller: boolean }>`
  font-weight: ${props => props.isKiller ? 'bold' : 'normal'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const KillerIndicator = styled.span`
  color: #E94560;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const PlayerSegment = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SegmentNumber = styled.span<{ active: boolean }>`
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? '#E94560' : 'inherit'};
  padding: 2px 4px;
  border-radius: 3px;
  background-color: ${props => props.active ? 'rgba(233, 69, 96, 0.1)' : 'transparent'};
`;

const ProgressContainer = styled.div`
  margin-top: 4px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressLabel = styled.div`
  position: absolute;
  right: 4px;
  top: -18px;
  font-size: 0.7rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1px 4px;
  border-radius: 3px;
  color: rgba(255, 255, 255, 0.8);
`;

const PlayerColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 12px;
  flex-shrink: 0;
`;

const PlayerDetails = styled.div`
  flex-grow: 1;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  font-size: 0.8rem;
  color: #E94560;
  font-weight: bold;
`;

const EliminatedIndicator = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  background-color: rgba(233, 69, 96, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 5;
`;

const ProgressBar = styled.div<{ progress: number; isKiller: boolean }>`
  height: 100%;
  width: ${props => `${props.progress * 100}%`};
  background: ${props => props.isKiller 
    ? 'linear-gradient(to right, #E94560, #FF7B92)' 
    : 'linear-gradient(to right, #4E8397, #6BB3C8)'};
  border-radius: 4px;
  transition: width 0.5s ease, background-color 0.5s ease;
  position: relative;
`;

const HitIndicators = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 4px;
  justify-content: flex-end;
`;

const HitDot = styled.div<{ active: boolean, color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.color : 'rgba(255, 255, 255, 0.2)'};
  transition: background-color 0.3s ease;
`;

const PlayerItem = styled(motion.div)<{ isActive: boolean; isEliminated: boolean }>`
  padding: 12px;
  border-radius: 10px;
  background-color: ${props => props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 15, 15, 0.5)'};
  border: 1px solid ${props => props.isActive ? 'rgba(233, 69, 96, 0.5)' : 'transparent'};
  display: flex;
  align-items: center;
  position: relative;
  opacity: ${props => props.isEliminated ? 0.5 : 1};
  
  ${props => props.isEliminated && `
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      z-index: 1;
    }
  `}
`;

// Wrapper components to avoid DOM prop warnings
interface PlayerNameWrapperProps {
  isKiller: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

interface ProgressBarWrapperProps {
  progress: number;
  isKiller: boolean;
  [key: string]: any;
}

interface PlayerItemWrapperProps {
  isActive: boolean;
  isEliminated: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

interface SegmentNumberWrapperProps {
  active: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

interface HitDotWrapperProps {
  active: boolean;
  color: string;
  [key: string]: any;
}

const StyledPlayerName = ({ isKiller, children, ...props }: PlayerNameWrapperProps) => (
  <PlayerName isKiller={isKiller} {...props}>
    {children}
  </PlayerName>
);

const StyledProgressBar = ({ progress, isKiller, ...props }: ProgressBarWrapperProps) => (
  <ProgressBar progress={progress} isKiller={isKiller} {...props} />
);

const StyledPlayerItem = ({ isActive, isEliminated, children, ...props }: PlayerItemWrapperProps) => (
  <PlayerItem 
    isActive={isActive} 
    isEliminated={isEliminated} 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </PlayerItem>
);

const StyledSegmentNumber = ({ active, children, ...props }: SegmentNumberWrapperProps) => (
  <SegmentNumber active={active} {...props}>
    {children}
  </SegmentNumber>
);

const StyledHitDot = ({ active, color, ...props}: HitDotWrapperProps) => (
  <HitDot active={active} color={color} {...props} />
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
      
      <PlayerList>
        {sortedPlayers.map(player => (
          <StyledPlayerItem
            key={player.id}
            isActive={player.id === currentPlayerId}
            isEliminated={player.isEliminated || false}
          >
            <PlayerColor color={player.color} />
            
            <PlayerDetails>
              <StyledPlayerName isKiller={player.isKiller || false}>
                {player.name}
                {player.isKiller && (
                  <KillerIndicator>
                    <FiTarget /> Killer
                  </KillerIndicator>
                )}
              </StyledPlayerName>
              
              <PlayerSegment>
                Segment: <StyledSegmentNumber active={player.id === currentPlayerId}>{player.segment}</StyledSegmentNumber>
              </PlayerSegment>
              
              {!player.isKiller ? (
                // Progress to become a killer
                <ProgressContainer>
                  <ProgressLabel>
                    {player.segmentHits || 0}/{maxHits}
                  </ProgressLabel>
                  <StyledProgressBar 
                    progress={(player.segmentHits || 0) / maxHits} 
                    isKiller={false} 
                  />
                  <HitIndicators>
                    {Array.from({ length: maxHits }).map((_, i) => (
                      <StyledHitDot 
                        key={i} 
                        active={(player.segmentHits || 0) > i}
                        color={player.color}
                      />
                    ))}
                  </HitIndicators>
                </ProgressContainer>
              ) : (
                // Status indicator for killers
                <StatusIndicator>
                  <FiTarget /> Hunting
                </StatusIndicator>
              )}
            </PlayerDetails>
            
            {player.isEliminated && (
              <EliminatedIndicator>
                <FiX /> Out
              </EliminatedIndicator>
            )}
          </StyledPlayerItem>
        ))}
      </PlayerList>
    </ScorecardContainer>
  );
};

export default KillerScorecard;