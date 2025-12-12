import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiHome, FiRepeat, FiArrowRight } from 'react-icons/fi';
import Layout from '../../shared/Layout';
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import { useGameContext } from '../../../context/GameContext';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 ${props => props.theme.space.xs};
  }
`;

const PageTitle = styled.h1`
  margin-bottom: ${props => props.theme.space.lg};
  color: ${props => props.theme.colours.text};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.5rem;
    margin-bottom: ${props => props.theme.space.md};
  }
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: ${props => props.theme.space.sm};
    margin-bottom: ${props => props.theme.space.md};
  }
`;

const TrophyIcon = styled(FiAward)`
  font-size: 2rem;
  color: gold;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const WinnerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => props.theme.space.xl};
  text-align: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: ${props => props.theme.space.lg};
  }
`;

const WinnerName = styled.h2`
  font-size: ${props => props.theme.fontSizes.xxxl};
  color: ${props => props.theme.colours.highlight};
  margin-top: ${props => props.theme.space.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xl};
  }
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
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 60px;
    height: 60px;
    font-size: ${props => props.theme.fontSizes.xl};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
  gap: ${props => props.theme.space.lg};
  margin: ${props => props.theme.space.xl} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.space.md};
    margin: ${props => props.theme.space.md} 0;
  }
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.sm};
  }
`;

const StatValue = styled.div`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: bold;
  color: ${props => props.theme.colours.highlight};
  margin: ${props => props.theme.space.md} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xl};
    margin: ${props => props.theme.space.sm} 0;
  }
`;

const PlayersStatsTable = styled.div`
  margin-top: ${props => props.theme.space.xl};
  overflow-x: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-top: ${props => props.theme.space.lg};
  }
`;

// Desktop version of the player row (used for larger screens)
const PlayerRow = styled.div<{ $winner: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr repeat(6, auto);
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
      ? props.theme.colours.success 
      : 'transparent'
  };
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none; /* Hide on mobile and show mobile version instead */
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
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.space.sm};
    margin-top: ${props => props.theme.space.md};
  }
`;

const DonkeyDerbySummaryScreen: React.FC = () => {
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
    // First reset the game state
    dispatch({ type: 'RESET_GAME' });
    
    // Then initialize a new game with fresh segment scores
    const freshPlayers = state.players.map(player => ({
      ...player,
      shanghaiSegmentScores: {}, // Clear out segment scores
      shanghaisHit: 0,
      singlesHit: 0,
      doublesHit: 0,
      triplesHit: 0,
      score: 0,
      throws: []
    }));
    
    // Start new game with our freshly reset players
    dispatch({
      type: 'START_GAME',
      gameType: 'shanghai',
      gameOptions: state.gameOptions
    });
    
    // Update players with cleared segment scores
    dispatch({ 
      type: 'SET_PLAYER_ORDER',
      players: freshPlayers
    });
    
  navigate('/games/donkey-derby');
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
  const sortedPlayers = [...state.players].sort((a,b)=> (b.donkeyProgress||0)-(a.donkeyProgress||0));
  
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
            <PageTitle>Donkey Derby Summary</PageTitle>
          </SummaryHeader>
          
          <WinnerSection as={motion.div} variants={childVariants}>
            <WinnerAvatar color={state.winner.colour}>
              {state.winner.name.charAt(0).toUpperCase()}
            </WinnerAvatar>
            <WinnerName>{state.winner.name} Wins!</WinnerName>
            <p>Crossed the finish line first</p>
          </WinnerSection>
          
          <motion.div variants={childVariants}>
            <Card>
              <Card.Header>
                <Card.Title>Game Statistics</Card.Title>
                <Card.Subtitle>{state.players.length} players • Finish {state.donkeyDerbyOptions?.finishLine}</Card.Subtitle>
              </Card.Header>
              
              <Card.Content>
                <StatsGrid>
                  {sortedPlayers.map(p => (
                    <StatCard key={p.id}>
                      <h3 className="player-card-header">{p.name} {p.id===state.winner?.id && '🏆'}</h3>
                      <p className="player-segment-info">Segment {p.segment}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                        <div><small>Singles</small><StatValue>{p.singlesHit||0}</StatValue></div>
                        <div><small>Doubles</small><StatValue>{p.doublesHit||0}</StatValue></div>
                        <div><small>Triples</small><StatValue>{p.triplesHit||0}</StatValue></div>
                      </div>
                      <p className="player-progress-text">Progress: {p.donkeyProgress}/{state.donkeyDerbyOptions?.finishLine}</p>
                    </StatCard>
                  ))}
                </StatsGrid>
                <PlayersStatsTable>
                  {sortedPlayers.map(p => (
                    <PlayerRow key={p.id} $winner={p.id===state.winner?.id}>
                      <PlayerColor color={p.colour} />
                      <PlayerName>{p.name} {p.id===state.winner?.id && '🏆'}</PlayerName>
                      <StatCell>{p.donkeyProgress}/{state.donkeyDerbyOptions?.finishLine}</StatCell>
                      <StatCell>{p.singlesHit||0}</StatCell>
                      <StatCell>{p.doublesHit||0}</StatCell>
                      <StatCell>{p.triplesHit||0}</StatCell>
                    </PlayerRow>
                  ))}
                </PlayersStatsTable>
              </Card.Content>
              
              <Card.Footer>
                <ButtonGroup>
                  <Button 
                    variant="outline"
                    onClick={handleGoHome}
                    startIcon={<FiHome />}
                    fullWidth
                  >
                    Home
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleGameHub}
                    startIcon={<FiArrowRight />}
                    fullWidth
                  >
                    Game Hub
                  </Button>
                  <Button 
                    onClick={handleNewGame}
                    startIcon={<FiRepeat />}
                    fullWidth
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

export default DonkeyDerbySummaryScreen;