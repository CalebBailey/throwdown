import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiAward, FiTarget, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import Card from '../shared/Card';
import DonkeyDerbyDartboard from './DonkeyDerbyDartboard';
import { useGameContext } from '../../context/GameContext';

// 501-style container
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
`;

// 501-style header
const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.space.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.space.md};
  }
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colours.text};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xl};
  }
`;

// 501-style grid layout
const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.space.lg};
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 320px 1fr;
  }
`;

// 501-style scoreboard (now race progress)
const RaceProgressCard = styled(Card)`
  grid-row: 2;
  height: fit-content;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-row: 1;
  }
`;

const PlayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space.md};
`;

const PlayerRaceLane = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.space.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: 4px solid ${props => props.$active ? props.theme.colours.highlight : 'transparent'};
  transition: all 0.2s ease;
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.space.xs};
`;

const PlayerColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: ${props => props.theme.space.sm};
`;

const PlayerName = styled.span`
  font-weight: 500;
  flex: 1;
`;

const PlayerProgress = styled.span`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: bold;
  color: ${props => props.theme.colours.text};
`;

const ProgressTrack = styled.div`
  position: relative;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.pill};
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)<{ color: string }>`
  height: 100%;
  background-color: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.pill};
  position: relative;
  
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

// Main game card
const MainGameCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CurrentPlayer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.sm};
`;

const CurrentPlayerName = styled.h2`
  margin: 0;
  color: ${props => props.theme.colours.highlight};
`;

const CurrentPlayerAvatar = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colours.text};
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.lg};
`;

const GameInfo = styled.div`
  display: flex;
  gap: ${props => props.theme.space.lg};
  margin-bottom: ${props => props.theme.space.md};
  font-size: ${props => props.theme.fontSizes.md};
  opacity: 0.8;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.xs};
`;

const DartCountBadge = styled.div`
  background-color: ${props => props.theme.colours.highlight};
  color: ${props => props.theme.colours.text};
  padding: ${props => props.theme.space.xs} ${props => props.theme.space.sm};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.sm};
  display: inline-block;
`;

const DartboardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.space.md} 0;
`;

const ControlBar = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.md};
`;

// Winner screen - 501 style
const WinnerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.space.md};
  z-index: 100;
`;

const WinnerCard = styled(motion.div)`
  background-color: ${props => props.theme.colours.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.space.xl};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colours.accent} transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colours.accent};
    border-radius: 10px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.lg};
    max-height: 85vh;
  }
`;

const WinnerHeader = styled.div`
  flex-shrink: 0;
  margin-bottom: ${props => props.theme.space.md};
`;

const WinnerStatsScrollable = styled.div`
  /* Removed overflow-y: auto to prevent double scrollbar - WinnerCard now handles scrolling */
  flex-grow: 1;
`;

const WinnerTitle = styled(motion.h1)`
  color: ${props => props.theme.colours.highlight};
  font-size: ${props => props.theme.fontSizes.huge};
  margin-bottom: ${props => props.theme.space.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xxxl};
    margin-bottom: ${props => props.theme.space.lg};
  }
`;

const WinnerAvatar = styled(motion.div)<{ color: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.huge};
  color: white;
  font-weight: bold;
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100px;
    height: 100px;
    font-size: ${props => props.theme.fontSizes.xxxl};
  }
`;

const Medal = styled(motion.div)`
  position: absolute;
  bottom: -5px;
  right: -5px;
  background-color: ${props => props.theme.colours.gold};
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.xl};
  border: 2px solid ${props => props.theme.colours.text};
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.xl};
`;

const StatBox = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: ${props => props.theme.space.md};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  opacity: 0.7;
  margin-bottom: ${props => props.theme.space.xs};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
`;

const PlayerScoreTally = styled(motion.div)`
  margin-bottom: ${props => props.theme.space.xl};
`;

const ScoreScroller = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.space.md};
  overflow-x: auto;
  padding: ${props => props.theme.space.md} 0;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colours.accent} transparent;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colours.accent};
    border-radius: 10px;
  }
`;

const PlayerScoreBox = styled.div<{ $winner: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.space.md};
  background-color: ${props => props.$winner ? `${props.theme.colours.highlight}40` : 'rgba(255, 255, 255, 0.05)'};
  border-radius: ${props => props.theme.borderRadius.md};
  min-width: 100px;
`;

const PlayerScoreAvatar = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colours.text};
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: ${props => props.theme.space.sm};
`;

const WinCount = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.theme.colours.highlight};
  margin: ${props => props.theme.space.xs} 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  width: 100%;
  margin-top: ${props => props.theme.space.lg};
`;

const DonkeyDerbyGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [dartThrowCount, setDartThrowCount] = useState(0);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  
  const currentPlayer = state.players[state.currentPlayerIndex];
  const finishLine = state.donkeyDerbyOptions?.finishLine || 10;
  
  // Initialize Donkey Derby player data
  useEffect(() => {
    if (state.gameType === 'donkey_derby') {
      const updatedPlayers = state.players.map(player => {
        if (player.donkeyProgress === undefined) {
          return { ...player, donkeyProgress: 0 };
        }
        return player;
      });
      
      if (JSON.stringify(updatedPlayers) !== JSON.stringify(state.players)) {
        dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
      }
    }
  }, []);
  
  const handleHitSegment = (segment: number, multiplier: string) => {
    if (dartThrowCount >= 3) return;
    
    let dartNotation = '';
    switch(multiplier) {
      case 'double': dartNotation = `D${segment}`; break;
      case 'triple': dartNotation = `T${segment}`; break;
      default: dartNotation = `S${segment}`;
    }
    
    dispatch({ type: 'ADD_DART', dart: dartNotation });
    
    const updatedPlayer = { ...currentPlayer };
    const currentProgress = updatedPlayer.donkeyProgress || 0;
    
    // Track dart statistics in real-time
    if (multiplier === 'single') {
      updatedPlayer.singlesHit = (updatedPlayer.singlesHit || 0) + 1;
    } else if (multiplier === 'double') {
      updatedPlayer.doublesHit = (updatedPlayer.doublesHit || 0) + 1;
    } else if (multiplier === 'triple') {
      updatedPlayer.triplesHit = (updatedPlayer.triplesHit || 0) + 1;
    }
    
    // Check if hit own segment (move forward)
    if (segment === currentPlayer.segment) {
      const multiplierValue = multiplier === 'double' ? 2 : multiplier === 'triple' ? 3 : 1;
      updatedPlayer.donkeyProgress = Math.min(currentProgress + multiplierValue, finishLine);
      
      // Check for winner
      if (updatedPlayer.donkeyProgress >= finishLine) {
        updatedPlayer.wins = (updatedPlayer.wins || 0) + 1;
        
        // IMPORTANT: Record the current throw before ending the game
        // so that darts thrown statistics are accurate
        const newThrows = [...updatedPlayer.throws];
        newThrows.push([...state.currentThrow.darts, dartNotation]);
        updatedPlayer.throws = newThrows;
        
        const updatedPlayers = [...state.players];
        updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
        dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
        dispatch({ type: 'END_GAME', winner: updatedPlayer });
        setShowWinnerScreen(true);
        return;
      }
    } else {
      // Check if hit opponent's segment (knock them back)
      const opponentIndex = state.players.findIndex(p => p.segment === segment);
      if (opponentIndex !== -1) {
        const multiplierValue = multiplier === 'double' ? 2 : multiplier === 'triple' ? 3 : 1;
        const opponent = state.players[opponentIndex];
        const opponentProgress = opponent.donkeyProgress || 0;
        if (opponentProgress > 0) {
          opponent.donkeyProgress = Math.max(0, opponentProgress - multiplierValue);
        }
      }
    }
    
    const updatedPlayers = [...state.players];
    updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
    dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
    
    setDartThrowCount(prev => prev + 1);
  };
  
  const handleEndTurn = () => {
    const updatedPlayer = { ...currentPlayer };
    const newThrows = [...updatedPlayer.throws];
    newThrows.push([...state.currentThrow.darts]);
    updatedPlayer.throws = newThrows;
    
    // Ensure dart statistics are preserved
    updatedPlayer.singlesHit = updatedPlayer.singlesHit || 0;
    updatedPlayer.doublesHit = updatedPlayer.doublesHit || 0;
    updatedPlayer.triplesHit = updatedPlayer.triplesHit || 0;
    
    const updatedPlayers = [...state.players];
    updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
    
    dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
    dispatch({ type: 'END_TURN' });
    setDartThrowCount(0);
  };
  
  const handleUndoDart = () => {
    if (dartThrowCount > 0) {
      // Get the last dart before removing it
      const lastDart = state.currentThrow.darts[state.currentThrow.darts.length - 1];
      
      // Determine multiplier from the dart notation
      const multiplier = lastDart[0]; // 'S', 'D', or 'T'
      
      // Update player statistics
      const updatedPlayer = { ...currentPlayer };
      if (multiplier === 'S') {
        updatedPlayer.singlesHit = Math.max(0, (updatedPlayer.singlesHit || 0) - 1);
      } else if (multiplier === 'D') {
        updatedPlayer.doublesHit = Math.max(0, (updatedPlayer.doublesHit || 0) - 1);
      } else if (multiplier === 'T') {
        updatedPlayer.triplesHit = Math.max(0, (updatedPlayer.triplesHit || 0) - 1);
      }
      
      // Update players array
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
      dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
      
      dispatch({ type: 'REMOVE_DART' });
      setDartThrowCount(prev => prev - 1);
    }
  };
  
  const handleExitGame = () => {
    if (window.confirm('Are you sure you want to exit? Game progress will be lost.')) {
      dispatch({ type: 'RESET_GAME' });
      navigate('/games');
    }
  };
  
  const handlePlayAgain = () => {
    const freshPlayers = state.players.map(player => ({
      ...player,
      donkeyProgress: 0,
      throws: []
    }));
    
    dispatch({ type: 'RESET_GAME' });
    dispatch({ type: 'START_GAME', gameType: 'donkey_derby', gameOptions: state.gameOptions });
    dispatch({ type: 'SET_PLAYER_ORDER', players: freshPlayers });
    
    setShowWinnerScreen(false);
  };
  
  const handleGoToSummary = () => navigate('/donkey-derby/summary');
  
  return (
    <Layout hideNav>
      <Container>
        <GameHeader>
          <PageTitle>Donkey Derby</PageTitle>
          <Button 
            variant="outline" 
            startIcon={<FiArrowLeft />}
            onClick={handleExitGame}
          >
            Exit Game
          </Button>
        </GameHeader>
        
        <GameGrid>
          <RaceProgressCard>
            <Card.Header>
              <Card.Title>Race Progress</Card.Title>
              <Card.Subtitle>Goal: {finishLine}</Card.Subtitle>
            </Card.Header>
            
            <Card.Content>
              <PlayersList>
                {state.players.map((player, index) => {
                  const progress = player.donkeyProgress || 0;
                  const progressPercent = (progress / finishLine) * 100;
                  
                  return (
                    <PlayerRaceLane 
                      key={player.id} 
                      $active={index === state.currentPlayerIndex}
                    >
                      <PlayerHeader>
                        <PlayerColor color={player.colour} />
                        <PlayerName>{player.name}</PlayerName>
                        <PlayerProgress>{progress} / {finishLine}</PlayerProgress>
                      </PlayerHeader>
                      <ProgressTrack>
                        <ProgressBar
                          color={player.colour}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ type: 'spring', stiffness: 100 }}
                        />
                      </ProgressTrack>
                    </PlayerRaceLane>
                  );
                })}
              </PlayersList>
            </Card.Content>
          </RaceProgressCard>
          
          <MainGameCard>
            <Card.Content>
              <CurrentPlayer>
                <CurrentPlayerAvatar color={currentPlayer?.colour || '#ccc'}>
                  {currentPlayer?.name.charAt(0).toUpperCase()}
                </CurrentPlayerAvatar>
                <CurrentPlayerName>{currentPlayer?.name}'s turn</CurrentPlayerName>
              </CurrentPlayer>
              
              <GameInfo>
                <InfoItem>
                  <span>Your Segment:</span>
                  <strong>{currentPlayer?.segment}</strong>
                </InfoItem>
                <InfoItem>
                  <span>Progress:</span>
                  <strong>{currentPlayer?.donkeyProgress || 0} / {finishLine}</strong>
                </InfoItem>
                <DartCountBadge>{dartThrowCount} / 3 darts</DartCountBadge>
              </GameInfo>
              
              <DartboardContainer>
                <DonkeyDerbyDartboard
                  currentPlayer={currentPlayer}
                  players={state.players}
                  onHitSegment={handleHitSegment}
                />
              </DartboardContainer>
              
              <ControlBar>
                <Button
                  onClick={handleUndoDart}
                  variant="outline"
                  disabled={dartThrowCount === 0}
                  fullWidth
                >
                  Undo
                </Button>
                <Button
                  onClick={handleEndTurn}
                  disabled={dartThrowCount === 0}
                  fullWidth
                >
                  Next Player
                </Button>
              </ControlBar>
            </Card.Content>
          </MainGameCard>
        </GameGrid>
        
        <AnimatePresence>
          {showWinnerScreen && state.winner && (
            <WinnerOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WinnerCard
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
              >
                <WinnerHeader>
                  <WinnerTitle
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.2, stiffness: 300 }}
                  >
                    WINNER!
                  </WinnerTitle>
                  
                  <WinnerAvatar 
                    color={state.winner.colour}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                  >
                    {state.winner.name.charAt(0).toUpperCase()}
                    <Medal 
                      initial={{ scale: 0, opacity: 0, rotate: -30 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ delay: 1.0, type: 'spring', stiffness: 300 }}
                    >
                      <FiAward />
                    </Medal>
                  </WinnerAvatar>
                  
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="winner-name"
                  >
                    {state.winner.name}
                  </motion.h2>
                  <p>Reached the finish line at {finishLine}!</p>
                </WinnerHeader>
                
                <WinnerStatsScrollable>
                  <StatsContainer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <StatBox>
                      <StatLabel>Segment</StatLabel>
                      <StatValue>{state.winner.segment}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Final Position</StatLabel>
                      <StatValue>{state.winner.donkeyProgress || 0}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Turns Taken</StatLabel>
                      <StatValue>{state.winner.throws?.length || 0}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Total Wins</StatLabel>
                      <StatValue>{state.winner.wins || 1}</StatValue>
                    </StatBox>
                  </StatsContainer>
                  
                  <PlayerScoreTally
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <motion.h3 className="player-tallies-header">Player Win Tallies</motion.h3>
                    <ScoreScroller
                      initial={{ x: 300 }}
                      animate={{ x: 0 }}
                      transition={{ 
                        delay: 1.2, 
                        duration: 1,
                        type: 'spring',
                        stiffness: 100 
                      }}
                    >
                      {state.players.map(player => (
                        <PlayerScoreBox key={player.id} $winner={player.id === state.winner?.id}>
                          <PlayerScoreAvatar color={player.colour}>
                            {player.name.charAt(0).toUpperCase()}
                          </PlayerScoreAvatar>
                          <div>{player.name}</div>
                          <WinCount>{player.wins || 0}</WinCount>
                          <div>wins</div>
                        </PlayerScoreBox>
                      ))}
                    </ScoreScroller>
                  </PlayerScoreTally>
                  
                  <ButtonGroup>
                    <Button
                      variant="outline"
                      startIcon={<FiTarget />}
                      onClick={handlePlayAgain}
                      fullWidth
                    >
                      Play Again
                    </Button>
                    <Button
                      startIcon={<FiArrowRight />}
                      onClick={handleGoToSummary}
                      fullWidth
                    >
                      Summary
                    </Button>
                  </ButtonGroup>
                </WinnerStatsScrollable>
              </WinnerCard>
            </WinnerOverlay>
          )}
        </AnimatePresence>
      </Container>
    </Layout>
  );
};

export default DonkeyDerbyGameScreen;
