import React from 'react';
import styled from 'styled-components';
import { Player } from '../../context/GameContext';

interface ShanghaiScorecardProps {
  players: Player[];
  currentPlayerId?: string;
  currentSegment: number;
}

const ScorecardContainer = styled.div`
  background: linear-gradient(to bottom, rgba(30, 30, 30, 0.7), rgba(40, 40, 40, 0.7));
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: auto repeat(9, 1fr) auto;
  gap: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 12px;
  }
`;

const HeaderCell = styled.div`
  background-color: rgba(20, 20, 20, 0.5);
  padding: 8px 4px;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
`;

const SegmentCell = styled(HeaderCell)<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(233, 69, 96, 0.2)' : 'rgba(20, 20, 20, 0.5)'};
  color: ${props => props.isActive ? props.theme.colors.highlight : props.theme.colors.text};
`;

const PlayerCell = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: ${props => props.isActive ? 'rgba(233, 69, 96, 0.2)' : 'rgba(20, 20, 20, 0.3)'};
  border-radius: 4px;
`;

const PlayerDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const ScoreCell = styled.div<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(233, 69, 96, 0.2)' : 'rgba(20, 20, 20, 0.2)'};
  padding: 8px 4px;
  text-align: center;
  border-radius: 4px;
  transition: background-color 0.3s ease;
`;

const TotalScoreCell = styled(ScoreCell)`
  font-weight: bold;
  background-color: rgba(20, 20, 20, 0.5);
`;

const ShanghaiScorecard: React.FC<ShanghaiScorecardProps> = ({ players, currentPlayerId, currentSegment }) => {
  // Helper function to get the segment score for a player from their throws
  const getSegmentScore = (player: Player, segment: number): number => {
    // For Shanghai, we need to extract scores for each segment from throws
    let score = 0;
    
    // Each throw array corresponds to a turn
    // Look at all turns that have segments data
    if (player.shanghaiSegmentScores && player.shanghaiSegmentScores[segment]) {
      score = player.shanghaiSegmentScores[segment];
    }
    
    return score;
  };
  
  // Get total score for a player across all segments
  const getTotalScore = (player: Player): number => {
    if (!player.shanghaiSegmentScores) return 0;
    
    return Object.values(player.shanghaiSegmentScores).reduce((total, score) => total + score, 0);
  };
  
  return (
    <ScorecardContainer>
      <Title>Shanghai Scorecard</Title>
      
      <ScoreGrid>
        {/* Header row with segment numbers */}
        <HeaderCell>Player</HeaderCell>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(segment => (
          <SegmentCell key={segment} isActive={segment === currentSegment}>
            {segment}
          </SegmentCell>
        ))}
        <HeaderCell>Total</HeaderCell>
        
        {/* Player rows */}
        {players.map(player => {
          const isActive = player.id === currentPlayerId;
          
          return (
            <React.Fragment key={player.id}>
              {/* Player name */}
              <PlayerCell isActive={isActive}>
                <PlayerDot color={player.color} />
                <div>{player.name}</div>
              </PlayerCell>
              
              {/* Segment scores */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(segment => (
                <ScoreCell 
                  key={`${player.id}-${segment}`}
                  isActive={isActive && segment === currentSegment}
                >
                  {getSegmentScore(player, segment)}
                </ScoreCell>
              ))}
              
              {/* Total score */}
              <TotalScoreCell isActive={isActive}>
                {getTotalScore(player)}
              </TotalScoreCell>
            </React.Fragment>
          );
        })}
      </ScoreGrid>
    </ScorecardContainer>
  );
};

export default ShanghaiScorecard;