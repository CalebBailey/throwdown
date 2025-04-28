import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiHome, FiRepeat, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useGameContext } from '../../context/GameContext';
import { calculatePlayerStats } from '../../utils/gameUtils';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  margin-bottom: ${props => props.theme.space.lg};
  color: ${props => props.theme.colors.text};
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.lg};
`;

const TrophyIcon = styled(FiAward)`
  font-size: 2rem;
  color: gold;
`;

const WinnerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => props.theme.space.xl};
  text-align: center;
`;

const WinnerName = styled.h2`
  font-size: ${props => props.theme.fontSizes.xxxl};
  color: ${props => props.theme.colors.highlight};
  margin-top: ${props => props.theme.space.md};
`;

const WinnerAvatar = styled.div<{ color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.xxxl};
  font-weight: bold;
  color: white;
  margin-bottom: ${props => props.theme.space.md};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.space.lg};
  margin: ${props => props.theme.space.xl} 0;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.space.md};
`;

const StatValue = styled.div`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: bold;
  color: ${props => props.theme.colors.highlight};
  margin: ${props => props.theme.space.md} 0;
`;

const PlayersStatsTable = styled.div`
  margin-top: ${props => props.theme.space.xl};
`;

const PlayerRow = styled.div<{ $winner: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr repeat(4, auto);
  gap: ${props => props.theme.space.md};
  align-items: center;
  padding: ${props => props.theme.space.md};
  background-color: ${props => 
    props.$winner 
      ? 'rgba(76, 175, 80, 0.1)' 
      : 'rgba(255, 255, 255, 0.05)'
  };
  border-left: 4px solid ${props => 
    props.$winner 
      ? props.theme.colors.success 
      : 'transparent'
  };
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.space.sm};
`;

const PlayerColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const PlayerName = styled.div`
  font-weight: 500;
`;

const StatHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr repeat(4, auto);
  gap: ${props => props.theme.space.md};
  align-items: center;
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  font-weight: 500;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
`;

const StatCell = styled.div`
  font-family: ${props => props.theme.fonts.monospace};
  font-weight: 500;
  text-align: center;
  min-width: 60px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.xl};
`;

const GameSummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  
  // Check if there's a winner, if not redirect
  useEffect(() => {
    if (!state.winner) {
      navigate('/games');
    }
  }, [state.winner, navigate]);
  
  // Go to home screen
  const handleGoHome = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
  };
  
  // Start a new game with same settings
  const handleNewGame = () => {
    dispatch({
      type: 'START_GAME',
      gameType: state.gameType,
      gameOptions: state.gameOptions
    });
    navigate(`/games/${state.gameType.toLowerCase()}`);
  };
  
  // Go back to game hub
  const handleGameHub = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/games');
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
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  if (!state.winner) return null;
  
  return (
    <Layout>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SummaryHeader>
            <TrophyIcon />
            <PageTitle>Game Summary</PageTitle>
          </SummaryHeader>
          
          <WinnerSection as={motion.div} variants={childVariants}>
            <WinnerAvatar color={state.winner.color}>
              {state.winner.name.charAt(0).toUpperCase()}
            </WinnerAvatar>
            <WinnerName>{state.winner.name} Wins!</WinnerName>
            <p>{state.gameType} game completed in {state.currentRound} rounds</p>
          </WinnerSection>
          
          <motion.div variants={childVariants}>
            <Card>
            <Card.Header>
              <Card.Title>Game Statistics</Card.Title>
              <Card.Subtitle>{state.gameType} with {state.players.length} players</Card.Subtitle>
            </Card.Header>
            
            <Card.Content>
              <StatsGrid>
                <StatCard>
                  <h3>Game Type</h3>
                  <StatValue>{state.gameType}</StatValue>
                  <p>
                    {state.gameOptions.entryMode === 'double' ? 'Double In' : 
                     state.gameOptions.entryMode === 'master' ? 'Master In' : 'Straight In'} | 
                    {state.gameOptions.outMode === 'double' ? 'Double Out' : 
                     state.gameOptions.outMode === 'master' ? 'Master Out' : 'Straight Out'}
                  </p>
                </StatCard>
                <StatCard>
                  <h3>Rounds</h3>
                  <StatValue>{state.currentRound}</StatValue>
                  <p>Total rounds played</p>
                </StatCard>
                <StatCard>
                  <h3>Winner</h3>
                  <StatValue>{state.winner.name}</StatValue>
                  <p>Total wins: {state.winner.wins}</p>
                </StatCard>
                <StatCard>
                  <h3>Average Score</h3>
                  <StatValue>{state.winner.averageScore.toFixed(1)}</StatValue>
                  <p>Winner's average score per dart</p>
                </StatCard>
              </StatsGrid>
              
              <PlayersStatsTable>
                <StatHeader>
                  <div></div>
                  <div>Player</div>
                  <StatCell>Final Score</StatCell>
                  <StatCell>Average</StatCell>
                  <StatCell>Highest</StatCell>
                  <StatCell>Darts Thrown</StatCell>
                </StatHeader>
                
                {state.players.map(player => {
                  const stats = calculatePlayerStats(player);
                  const isWinner = player.id === state.winner?.id;
                  
                  return (
                    <PlayerRow key={player.id} $winner={isWinner}>
                      <PlayerColor color={player.color} />
                      <PlayerName>{player.name} {isWinner && '🏆'}</PlayerName>
                      <StatCell>{player.score}</StatCell>
                      <StatCell>{stats.average.toFixed(1)}</StatCell>
                      <StatCell>{stats.highest}</StatCell>
                      <StatCell>{stats.dartsThrown}</StatCell>
                    </PlayerRow>
                  );
                })}
              </PlayersStatsTable>
            </Card.Content>
            
            <Card.Footer>
              <ButtonGroup>
                <Button 
                  variant="outline"
                  onClick={handleGoHome}
                  startIcon={<FiHome />}
                >
                  Home
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleGameHub}
                  startIcon={<FiArrowRight />}
                >
                  Game Hub
                </Button>
                <Button 
                  onClick={handleNewGame}
                  startIcon={<FiRepeat />}
                >
                  Play Again
                </Button>
              </ButtonGroup>
              </Card.Footer>
            </Card>
          </motion.div>
        </motion.div>
        </Container>
    </Layout>
  );
};

export default GameSummaryScreen;