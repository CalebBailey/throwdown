import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiHome, FiRepeat, FiArrowRight, FiTarget, FiX } from 'react-icons/fi';
import Layout from '../../shared/Layout';
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import { useGameContext } from '../../../context/GameContext';

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

const TargetIcon = styled(FiTarget)`
  color: ${props => props.theme.colors.highlight};
  margin-right: ${props => props.theme.space.sm};
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
  grid-template-columns: repeat(2, minmax(250px, 1fr));
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
  grid-template-columns: auto 1fr repeat(7, auto);
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

const PlayerRowEliminated = styled(PlayerRow)`
  opacity: 0.6;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

const PlayerColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const PlayerName = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const PlayerStatus = styled.span<{ isKiller: boolean }>`
  margin-left: ${props => props.theme.space.sm};
  font-size: 0.8rem;
  background-color: ${props => 
    props.isKiller 
      ? 'rgba(233, 69, 96, 0.2)' 
      : 'rgba(0, 0, 0, 0.3)'
  };
  color: ${props => 
    props.isKiller 
      ? props.theme.colors.error 
      : props.theme.colors.textSecondary
  };
  padding: 2px 6px;
  border-radius: 4px;
`;

const StatHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr repeat(7, auto);
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

const KillerGameSummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  
  // Make sure we're showing this screen for a Killer game that's completed
  useEffect(() => {
    if (!state.winner) {
      navigate('/games');
    }
  }, [state.gameType, state.winner, navigate]);
  
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
      gameOptions: state.gameOptions,
      killerOptions: state.killerOptions
    });
    navigate('/games/killer');
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
  
  // Calculate total game statistics
  const calculateGameStats = () => {
    let totalDarts = 0;
    let totalSingles = 0;
    let totalDoubles = 0;
    let totalTriples = 0;
    let totalEliminated = 0;
    
    state.players.forEach(player => {
      const darts = player.throws.flat();
      totalDarts += darts.length;
      totalSingles += player.singlesHit || 0;
      totalDoubles += player.doublesHit || 0;
      totalTriples += player.triplesHit || 0;
    });
    
    // Count eliminated players
    totalEliminated = state.players.filter(p => p.isEliminated).length;
    
    return {
      totalDarts,
      totalSingles,
      totalDoubles,
      totalTriples,
      totalEliminated
    };
  };
  
  const gameStats = calculateGameStats();
  
  if (!state.winner) return null;
  
  // Sort players: winner first, then killers, then non-eliminated, then eliminated
  const sortedPlayers = [...state.players].sort((a, b) => {
    // Winner first
    if (a.id === state.winner?.id) return -1;
    if (b.id === state.winner?.id) return 1;
    
    // Killers next
    if (a.isKiller && !b.isKiller) return -1;
    if (!a.isKiller && b.isKiller) return 1;
    
    // Non-eliminated before eliminated
    if (!a.isEliminated && b.isEliminated) return -1;
    if (a.isEliminated && !b.isEliminated) return 1;
    
    // Sort by name
    return a.name.localeCompare(b.name);
  });
  
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
            <PageTitle>Killer Game Summary</PageTitle>
          </SummaryHeader>
          
          <WinnerSection as={motion.div} variants={childVariants}>
            <WinnerAvatar color={state.winner.color}>
              {state.winner.name.charAt(0).toUpperCase()}
            </WinnerAvatar>
            <WinnerName>{state.winner.name} Wins!</WinnerName>
            <p>Last player standing after {state.currentTurn} turns</p>
          </WinnerSection>
          
          <motion.div variants={childVariants}>
            <Card>
              <Card.Header>
                <Card.Title>Game Statistics</Card.Title>
                <Card.Subtitle>Killer with {state.players.length} players</Card.Subtitle>
              </Card.Header>
              
              <Card.Content>
                <StatsGrid>
                  <StatCard>
                    <h3>Game Type</h3>
                    <StatValue>Killer</StatValue>
                    <p>
                      {state.killerOptions?.maxHits || 3} hits to become a Killer
                    </p>
                  </StatCard>
                  <StatCard>
                    <h3>Turns</h3>
                    <StatValue>{state.currentTurn}</StatValue>
                    <p>Total turns played</p>
                  </StatCard>
                  <StatCard>
                    <h3>Darts Thrown</h3>
                    <StatValue>{gameStats.totalDarts}</StatValue>
                    <p>Total darts thrown in game</p>
                  </StatCard>
                  <StatCard>
                    <h3>Eliminated Players</h3>
                    <StatValue>{gameStats.totalEliminated}</StatValue>
                    <p>Players removed from the game</p>
                  </StatCard>
                </StatsGrid>
                
                <StatCard>
                  <h3>Dart Accuracy</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                    <div>
                      <h4>Singles</h4>
                      <StatValue>{gameStats.totalSingles}</StatValue>
                    </div>
                    <div>
                      <h4>Doubles</h4>
                      <StatValue>{gameStats.totalDoubles}</StatValue>
                    </div>
                    <div>
                      <h4>Triples</h4>
                      <StatValue>{gameStats.totalTriples}</StatValue>
                    </div>
                  </div>
                </StatCard>
                
                <PlayersStatsTable>
                  <StatHeader>
                    <div></div>
                    <div>Player</div>
                    <StatCell>Segment</StatCell>
                    <StatCell>Status</StatCell>
                    <StatCell>Singles</StatCell>
                    <StatCell>Doubles</StatCell>
                    <StatCell>Triples</StatCell>
                    <StatCell>Eliminated</StatCell>
                    <StatCell>Darts</StatCell>
                  </StatHeader>
                  
                  {sortedPlayers.map(player => {
                    const isWinner = player.id === state.winner?.id;
                    const PlayerRowComponent = player.isEliminated ? PlayerRowEliminated : PlayerRow;
                    
                    return (
                      <PlayerRowComponent key={player.id} $winner={isWinner}>
                        <PlayerColor color={player.color} />
                        <PlayerName>{player.name} {isWinner && '🏆'}</PlayerName>
                        <StatCell>{player.segment}</StatCell>
                        <StatCell>
                          {player.isKiller ? (
                            <PlayerStatus isKiller={true}>
                              <TargetIcon />Killer
                            </PlayerStatus>
                          ) : player.isEliminated ? (
                            <PlayerStatus isKiller={false}>
                              <FiX />Out
                            </PlayerStatus>
                          ) : (
                            <PlayerStatus isKiller={false}>
                              {(player.segmentHits || 0)}/{state.killerOptions?.maxHits || 3}
                            </PlayerStatus>
                          )}
                        </StatCell>
                        <StatCell>{player.singlesHit || 0}</StatCell>
                        <StatCell>{player.doublesHit || 0}</StatCell>
                        <StatCell>{player.triplesHit || 0}</StatCell>
                        <StatCell>{player.playersEliminated || 0}</StatCell>
                        <StatCell>{player.throws.flat().length}</StatCell>
                      </PlayerRowComponent>
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

export default KillerGameSummaryScreen;