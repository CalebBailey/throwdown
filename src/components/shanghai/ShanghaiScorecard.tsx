import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../context/GameContext';
import { motion } from 'framer-motion';

interface ShanghaiScorecardProps {
  players: Player[];
  currentPlayerId?: string;
  currentSegment: number;
}

const ScorecardContainer = styled.div`
  background: linear-gradient(to bottom, rgba(30, 30, 30, 0.7), rgba(40, 40, 40, 0.7));
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 3px;
  color: ${props => props.theme.colours.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Wide screen layout - players in columns, segments in rows
const WideScreenScoreTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none; /* Hide on mobile/portrait */
  }
`;

// Portrait/mobile layout - segments in columns, players in rows
const PortraitScoreGrid = styled.div`
  display: none; /* Hidden by default on wide screens */
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: grid;
    grid-template-columns: auto repeat(9, 1fr) auto;
    gap: 4px;
    margin-bottom: 16px;
    font-size: 12px;
  }
`;

const HeaderCell = styled.th`
  background-color: rgba(20, 20, 20, 0.5);
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
  color: ${props => props.theme.colours.text};
`;

const PlayerHeaderCell = styled(HeaderCell)<{ color: string; isActive?: boolean }>`
  position: relative;
  
  ${props => props.isActive && `
    background-color: rgba(233, 69, 96, 0.2);
    color: ${props.theme.colours.highlight};
  `}
`;

const SegmentCell = styled.td<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(233, 69, 96, 0.2)' : 'rgba(20, 20, 20, 0.5)'};
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  color: ${props => props.isActive ? props.theme.colours.highlight : props.theme.colours.text};
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
`;

const ScoreCell = styled.td<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(233, 69, 96, 0.2)' : 'rgba(20, 20, 20, 0.2)'};
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  color: ${props => props.theme.colours.text};
`;

const TotalScoreCell = styled(ScoreCell)`
  font-weight: bold;
  background-color: rgba(20, 20, 20, 0.5);
`;

// Mobile Components
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

const MobileScoreCell = styled.div<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(233, 69, 96, 0.2)' : 'rgba(20, 20, 20, 0.2)'};
  padding: 8px 4px;
  text-align: center;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
`;

const MobileTotalScoreCell = styled(MobileScoreCell)`
  font-weight: bold;
  background-color: rgba(20, 20, 20, 0.5);
`;

const ShanghaiScorecard: React.FC<ShanghaiScorecardProps> = ({ players, currentPlayerId, currentSegment }) => {
  // Helper function to get the segment score for a player from their throws
  const getSegmentScore = (player: Player, segment: number): number => {
    // For Shanghai, we need to extract scores for each segment from throws
    let score = 0;
    
    // Check if the player has shanghaiSegmentScores and if there's a score for this segment
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
  
  // Get number of singles, doubles, triples hit by a player
  const getHitStatistics = (player: Player) => {
    return {
      singlesHit: player.singlesHit || 0,
      doublesHit: player.doublesHit || 0,
      triplesHit: player.triplesHit || 0,
      shanghaisHit: player.shanghaisHit || 0
    };
  };
  
  // Get highest segment score for a player
  const getHighestSegmentScore = (player: Player): number => {
    if (!player.shanghaiSegmentScores) return 0;
    
    const scores = Object.values(player.shanghaiSegmentScores);
    return scores.length ? Math.max(...scores) : 0;
  };
  
  // Get the best segment (1-9) for a player
  const getBestSegment = (player: Player): number => {
    if (!player.shanghaiSegmentScores) return 0;
    
    let bestSegment = 0;
    let highestScore = 0;
    
    Object.entries(player.shanghaiSegmentScores).forEach(([segment, score]) => {
      if (score > highestScore) {
        highestScore = score;
        bestSegment = parseInt(segment);
      }
    });
    
    return bestSegment;
  };
  
  return (
    <ScorecardContainer>
      <Title>Scorecard</Title>
      
      {/* Wide Screen Layout - Table format with players across top and segments down side */}
      <WideScreenScoreTable>
        <thead>
          <tr>
            <HeaderCell>Segment</HeaderCell>
            {players.map(player => (
              <PlayerHeaderCell 
                key={player.id} 
                color={player.colour}
                isActive={player.id === currentPlayerId}
              >
                {player.name}
              </PlayerHeaderCell>
            ))}
            
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(segment => (
            <tr key={segment}>
              <SegmentCell isActive={segment === currentSegment}>{segment}</SegmentCell>
              
              {/* Player scores for this segment */}
              {players.map(player => (
                <ScoreCell 
                  key={`${player.id}-${segment}`}
                  isActive={player.id === currentPlayerId && segment === currentSegment}
                >
                  {getSegmentScore(player, segment)}
                </ScoreCell>
              ))}
              
            </tr>
          ))}
          
          {/* Total score row */}
          <tr>
            <HeaderCell>Total</HeaderCell>
            {players.map(player => (
              <TotalScoreCell 
                key={`${player.id}-total`} 
                isActive={player.id === currentPlayerId}
              >
                {getTotalScore(player)}
              </TotalScoreCell>
            ))}
          </tr>
        </tbody>
      </WideScreenScoreTable>
      
      {/* Portrait/Mobile Layout - Horizontal format with segments in columns */}
      <PortraitScoreGrid>
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
                <PlayerDot color={player.colour} />
                <div>{player.name}</div>
              </PlayerCell>
              
              {/* Segment scores */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(segment => (
                <MobileScoreCell 
                  key={`${player.id}-${segment}`}
                  isActive={isActive && segment === currentSegment}
                >
                  {getSegmentScore(player, segment)}
                </MobileScoreCell>
              ))}
              
              {/* Total score */}
              <MobileTotalScoreCell isActive={isActive}>
                {getTotalScore(player)}
              </MobileTotalScoreCell>
            </React.Fragment>
          );
        })}
      </PortraitScoreGrid>
    </ScorecardContainer>
  );
};

export default ShanghaiScorecard;