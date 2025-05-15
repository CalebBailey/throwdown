import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiTarget, FiHome, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import Layout from '../../shared/Layout';
import Button from '../../shared/Button';
import { useGameContext } from '../../../context/GameContext';

// Styled components for the summary page
const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background-color: rgba(30, 30, 30, 0.5);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const SummaryContainer = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto 2rem;
`;

const SummaryHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const GameTitle = styled.h2`
  color: ${props => props.theme.colors.highlight};
  margin-bottom: 0.5rem;
`;

const GameDate = styled.div`
  opacity: 0.7;
  font-size: 0.9rem;
`;

const WinnerCard = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const WinnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const WinnerAvatar = styled.div<{ color: string }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  font-weight: bold;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

const WinnerStats = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-top: 1rem;
  }
`;

const WinnerName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const WinnerScore = styled.div`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: rgba(20, 20, 20, 0.5);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatIcon = styled.div`
  background-color: rgba(233, 69, 96, 0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.highlight};
    font-size: 1.25rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const PlayerListHeader = styled.h3`
  margin: 1.5rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.highlight};
  }
`;

const PlayerList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const PlayerCard = styled(motion.div)<{ $isWinner?: boolean }>`
  background-color: ${props => props.$isWinner ? 'rgba(233, 69, 96, 0.15)' : 'rgba(30, 30, 30, 0.5)'};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  border: ${props => props.$isWinner ? '1px solid rgba(233, 69, 96, 0.3)' : 'none'};
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const PlayerDot = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.color};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 20px;
    height: 20px;
  }
`;

const PlayerDetails = styled.div`
  flex: 1;
`;

const PlayerName = styled.div`
  font-weight: bold;
`;

const PlayerRank = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const PlayerScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 0.5rem;
`;

const DartTypeStat = styled.div`
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(20, 20, 20, 0.5);
  border-radius: 6px;
  padding: 4px;
`;

const DartTypeLabel = styled.div`
  opacity: 0.7;
  margin-bottom: 2px;
`;

const DartTypeValue = styled.div`
  font-weight: bold;
`;

const ScoresTable = styled.div`
  display: grid;
  grid-template-columns: auto repeat(9, 1fr);
  gap: 4px;
  margin: 1rem 0;
  font-size: 0.9rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.75rem;
  }
`;

const ScoreHeader = styled.div`
  background-color: rgba(20, 20, 20, 0.7);
  padding: 8px 4px;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
`;

const ScoreSegment = styled(ScoreHeader)<{ $isHighest?: boolean }>`
  background-color: ${props => props.$isHighest ? 'rgba(233, 69, 96, 0.2)' : 'rgba(20, 20, 20, 0.5)'};
  color: ${props => props.$isHighest ? props.theme.colors.highlight : props.theme.colors.text};
  font-weight: ${props => props.$isHighest ? 'bold' : 'normal'};
`;

const ScoreTotal = styled(ScoreHeader)`
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// Main component
const ShanghaiGameSummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [currentDate] = useState(new Date());
  
  // Format current date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);
  
  // Sort players by score
  const sortedPlayers = [...state.players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const winner = sortedPlayers[0];
  
  // Helper function to get the segment score for a player from their throws
  const getSegmentScore = (player: any, segment: number): number => {
    if (player.shanghaiSegmentScores && player.shanghaiSegmentScores[segment]) {
      return player.shanghaiSegmentScores[segment];
    }
    return 0;
  };
  
  // Calculate game statistics
  const calculateGameStats = () => {
    const totalDarts = state.players.reduce((sum, player) => sum + player.throws.flat().length, 0);
    const totalScore = state.players.reduce((sum, player) => sum + (player.score || 0), 0);
    const highestSegmentScore = state.players.reduce((highest, player) => {
      if (!player.shanghaiSegmentScores) return highest;
      
      const playerHighest = Object.values(player.shanghaiSegmentScores).reduce(
        (max, score) => Math.max(max, score), 0
      );
      return Math.max(highest, playerHighest);
    }, 0);
    
    return {
      totalDarts,
      totalScore,
      highestSegmentScore
    };
  };
  
  // Handle navigating back to the games screen
  const handleBackToGames = () => {
    navigate('/games');
  };
  
  // Handle starting a new game with the same players
  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
    dispatch({
      type: 'START_GAME',
      gameType: 'shanghai',
      gameOptions: state.gameOptions
    });
    navigate('/shanghai');
  };
  
  // Handle going back home
  const handleGoHome = () => {
    navigate('/');
  };
  
  // Get the best segment for a player (segment with highest score)
  const getBestSegment = (player: any): number => {
    if (!player.shanghaiSegmentScores) return 0;
    
    let bestSegment = 0;
    let highestScore = 0;
    
    Object.entries(player.shanghaiSegmentScores).forEach(([segment, score]) => {
      if (score > highestScore) {
        highestScore = score as number;
        bestSegment = parseInt(segment);
      }
    });
    
    return bestSegment;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Game statistics
  const gameStats = calculateGameStats();
  
  return (
    <Layout>
      <SummaryContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeaderBar>
          <Title>
            <FiBarChart2 />
            <span>Game Summary</span>
          </Title>
          <Button
            variant="text"
            startIcon={<FiArrowLeft />}
            onClick={handleBackToGames}
          >
            Back to Games
          </Button>
        </HeaderBar>
        
        <SummaryHeader>
          <motion.div variants={itemVariants}>
            <GameTitle>Shanghai Game</GameTitle>
            <GameDate>{formattedDate}</GameDate>
          </motion.div>
        </SummaryHeader>
        
        {/* Winner Section */}
        {winner && (
          <WinnerCard variants={itemVariants}>
            <WinnerInfo>
              <WinnerAvatar color={winner.color}>
                {winner.name.charAt(0).toUpperCase()}
              </WinnerAvatar>
              <div>
                <WinnerName>{winner.name} Wins!</WinnerName>
                <WinnerScore>Score: {winner.score} points</WinnerScore>
              </div>
            </WinnerInfo>
            
            <WinnerStats>
              <StatGrid>
                <StatCard>
                  <StatLabel>Singles</StatLabel>
                  <StatValue>{winner.singlesHit || 0}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Doubles</StatLabel>
                  <StatValue>{winner.doublesHit || 0}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Triples</StatLabel>
                  <StatValue>{winner.triplesHit || 0}</StatValue>
                </StatCard>
              </StatGrid>
            </WinnerStats>
          </WinnerCard>
        )}
        
        {/* Game Statistics */}
        <motion.div variants={itemVariants}>
          <PlayerListHeader>
            <FiTrendingUp />
            <span>Game Statistics</span>
          </PlayerListHeader>
          
          <StatGrid>
            <StatCard>
              <StatIcon>
                <FiTarget />
              </StatIcon>
              <StatLabel>Total Darts</StatLabel>
              <StatValue>{gameStats.totalDarts}</StatValue>
            </StatCard>
            <StatCard>
              <StatIcon>
                <FiBarChart2 />
              </StatIcon>
              <StatLabel>Total Score</StatLabel>
              <StatValue>{gameStats.totalScore}</StatValue>
            </StatCard>
            <StatCard>
              <StatIcon>
                <FiTrendingUp />
              </StatIcon>
              <StatLabel>Highest Segment Score</StatLabel>
              <StatValue>{gameStats.highestSegmentScore}</StatValue>
            </StatCard>
          </StatGrid>
        </motion.div>
        
        {/* All Players */}
        <motion.div variants={itemVariants}>
          <PlayerListHeader>
            <FiTarget />
            <span>All Players</span>
          </PlayerListHeader>
          
          <PlayerList>
            {sortedPlayers.map((player, index) => {
              const isWinner = player.id === winner?.id;
              const bestSegment = getBestSegment(player);
              
              return (
                <PlayerCard 
                  key={player.id} 
                  $isWinner={isWinner}
                  variants={itemVariants}
                >
                  <PlayerHeader>
                    <PlayerDot color={player.color} />
                    <PlayerDetails>
                      <PlayerName>{player.name}</PlayerName>
                      <PlayerRank>Rank: #{index + 1} - {player.score || 0} points</PlayerRank>
                    </PlayerDetails>
                  </PlayerHeader>
                  
                  <PlayerScoreGrid>
                    <DartTypeStat>
                      <DartTypeLabel>Singles</DartTypeLabel>
                      <DartTypeValue>{player.singlesHit || 0}</DartTypeValue>
                    </DartTypeStat>
                    <DartTypeStat>
                      <DartTypeLabel>Doubles</DartTypeLabel>
                      <DartTypeValue>{player.doublesHit || 0}</DartTypeValue>
                    </DartTypeStat>
                    <DartTypeStat>
                      <DartTypeLabel>Triples</DartTypeLabel>
                      <DartTypeValue>{player.triplesHit || 0}</DartTypeValue>
                    </DartTypeStat>
                  </PlayerScoreGrid>
                  
                  <ScoresTable>
                    <ScoreHeader>Segment</ScoreHeader>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(segment => (
                      <ScoreSegment 
                        key={segment} 
                        $isHighest={bestSegment === segment && getSegmentScore(player, segment) > 0}
                      >
                        {segment}
                      </ScoreSegment>
                    ))}
                    
                    <ScoreHeader>Score</ScoreHeader>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(segment => (
                      <ScoreSegment 
                        key={`score-${segment}`}
                        $isHighest={bestSegment === segment && getSegmentScore(player, segment) > 0}
                      >
                        {getSegmentScore(player, segment)}
                      </ScoreSegment>
                    ))}
                  </ScoresTable>
                </PlayerCard>
              );
            })}
          </PlayerList>
        </motion.div>
        
        {/* Actions */}
        <ButtonGroup>
          <Button
            variant="outline"
            startIcon={<FiHome />}
            onClick={handleGoHome}
          >
            Home
          </Button>
          <Button
            startIcon={<FiTarget />}
            onClick={handlePlayAgain}
          >
            Play Again
          </Button>
        </ButtonGroup>
      </SummaryContainer>
    </Layout>
  );
};

export default ShanghaiGameSummaryScreen;