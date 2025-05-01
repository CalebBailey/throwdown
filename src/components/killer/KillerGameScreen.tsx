import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiChevronRight, FiAward, FiTarget, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import KillerDartboard from './KillerDartboard';
import KillerScorecard from './KillerScorecard';
import { useGameContext } from '../../context/GameContext';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: rgba(30, 30, 30, 0.5);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerTurnIndicator = styled.div`
  background: linear-gradient(to right, rgba(30, 30, 30, 0.7), rgba(40, 40, 40, 0.7));
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PlayerName = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ThrowInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const DartCount = styled.div`
  font-size: 1rem;
  background-color: rgba(233, 69, 96, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
`;

const UndoButton = styled(Button)`
  flex: 1;
`;

const NextButton = styled(Button)`
  flex: 2;
`;

// Add new styled components for winner overlay
const WinnerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.85);
`;

const WinnerCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.space.xl};
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
`;

const WinnerAvatar = styled.div<{ color: string }>`
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
`;

const WinnerName = styled.h2`
  font-size: ${props => props.theme.fontSizes.xxxl};
  color: ${props => props.theme.colors.highlight};
  margin: 1rem 0;
`;

const Medal = styled(motion.div)`
  position: absolute;
  bottom: -5px;
  right: -5px;
  background-color: ${props => props.theme.colors.gold};
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.xl};
  border: 2px solid ${props => props.theme.colors.text};
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

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.space.md};
  margin: ${props => props.theme.space.xl} 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.xl};
`;

const KillerGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [showSetup, setShowSetup] = useState(true);
  const [dartThrowCount, setDartThrowCount] = useState(0);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  
  // Get current player
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  // Effect to run once when component mounts
  useEffect(() => {
    // If we're in a Killer game and segments are not assigned yet, assign them
    if (state.gameType === 'killer') {
      // Check if any player has no segment assigned
      const needsSegments = state.players.some(p => p.segment === undefined);
      
      if (needsSegments) {
        console.log('Assigning segments to players');
        dispatch({ type: 'ASSIGN_SEGMENTS' });
      }
    }
  }, []); // Remove dependencies so this only runs once when component mounts
  
  // Handle game setup completion
  const handleSetupComplete = () => {
    setShowSetup(false);
  };
  
  // Handle hitting a segment
  const handleHitSegment = (segment: number, multiplier: string) => {
    // If we already have 3 darts, don't accept more throws
    if (dartThrowCount >= 3) return;
    
    // Create dart notation based on multiplier
    let dartNotation = '';
    switch(multiplier) {
      case 'double': dartNotation = `D${segment}`; break;
      case 'triple': dartNotation = `T${segment}`; break;
      default: dartNotation = `S${segment}`;
    }
    
    // Add the dart to the current throw
    dispatch({ type: 'ADD_DART', dart: dartNotation });
    
    // Process the hit immediately to update player status
    dispatch({ type: 'PROCESS_KILLER_DART_HIT' });
    
    // Increment the dart count
    setDartThrowCount(prev => prev + 1);
  };
  
  // Handle ending the turn
  const handleEndTurn = () => {
    // Submit the throw to calculate scores and advance to next player
    dispatch({ type: 'KILLER_SUBMIT_THROW' });
    
    // Reset dart count for next player
    setDartThrowCount(0);
  };
  
  // Handle undoing the last dart
  const handleUndoDart = () => {
    if (dartThrowCount > 0) {
      dispatch({ type: 'REMOVE_KILLER_DART' });
      setDartThrowCount(prev => prev - 1);
    }
  };
  
  // Handle exit game
  const handleExitGame = () => {
    if (window.confirm('Are you sure you want to exit this game?')) {
      dispatch({ type: 'RESET_GAME' });
      navigate('/games');
    }
  };
  
  // Handle starting a new game with same settings
  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
    setShowWinnerScreen(false);
    // dispatch({
    //   type: 'START_GAME',
    //   gameType: state.gameType,
    //   gameOptions: state.gameOptions,
    //   killerOptions: state.killerOptions
    // });
    // setShowWinnerScreen(false);
  };
  
  // Handle navigating to the detailed summary screen
  const handleGoToSummary = () => {
    navigate('/killer/summary');
  };
  
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const overlayAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  // If game is complete, show winner screen
  useEffect(() => {
    if (state.gameStatus === 'complete' && state.winner) {
      setShowWinnerScreen(true);
    }
  }, [state.gameStatus, state.winner]);
  
  // Get status message based on player state
  const getStatusMessage = () => {
    if (currentPlayer.isKiller) {
      return "Hit opponents' segments to eliminate them";
    } else {
      const hitsNeeded = (state.killerOptions?.maxHits || 3) - (currentPlayer.segmentHits || 0);
      return `Need ${hitsNeeded} more hit${hitsNeeded !== 1 ? 's' : ''} on segment ${currentPlayer.segment} to become a Killer`;
    }
  };
  
  // Calculate game statistics for winner screen
  const calculateWinnerStats = () => {
    if (!state.winner) return { totalDarts: 0, totalEliminated: 0 };
    
    const totalDarts = state.winner.throws.flat().length;
    const totalEliminated = state.winner.playersEliminated || 0;
    
    return {
      totalDarts,
      totalEliminated
    };
  };
  
  const winnerStats = calculateWinnerStats();
  
  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeaderBar>
          <Title>
            <span>Killer</span>
          </Title>
          <Button
            variant="text"
            startIcon={<FiArrowLeft />}
            onClick={handleExitGame}
          >
            Exit Game
          </Button>
        </HeaderBar>
        
        {/* Show setup screen if in setup mode */}
        {showSetup && (
          <motion.div variants={itemVariants}>
            <KillerSetupScreen 
              onComplete={handleSetupComplete} 
              maxHits={state.killerOptions?.maxHits || 3}
            />
          </motion.div>
        )}
        
        {/* Main game screen */}
        {!showSetup && (
          <Container>
            <GameArea>
              <motion.div variants={itemVariants}>
                <PlayerTurnIndicator>
                  <PlayerInfo>
                    <PlayerName color={currentPlayer?.color || '#fff'}>
                      <span>{currentPlayer?.name || 'Unknown'}</span>
                      {currentPlayer?.isKiller && <span style={{ color: '#E94560' }}>(Killer)</span>}
                    </PlayerName>
                    
                    <ThrowInfo>
                      <DartCount>
                        {dartThrowCount} / 3 darts
                      </DartCount>
                    </ThrowInfo>
                  </PlayerInfo>
                  
                  <PlayerStatus>
                    <div>Segment: <strong>{currentPlayer?.segment}</strong></div>
                    <div>{getStatusMessage()}</div>
                  </PlayerStatus>
                </PlayerTurnIndicator>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <KillerDartboard
                  players={state.players}
                  currentPlayerId={currentPlayer?.id}
                  onHitSegment={handleHitSegment}
                  maxHits={state.killerOptions?.maxHits || 3}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <ControlBar>
                  <UndoButton
                    onClick={handleUndoDart}
                    variant="outline"
                    disabled={dartThrowCount === 0}
                  >
                    Undo
                  </UndoButton>
                  <NextButton
                    onClick={handleEndTurn}
                    endIcon={<FiChevronRight />}
                    disabled={dartThrowCount === 0}
                  >
                    Next Player
                  </NextButton>
                </ControlBar>
              </motion.div>
            </GameArea>
            
            <motion.div variants={itemVariants}>
              <KillerScorecard
                players={state.players}
                currentPlayerId={currentPlayer?.id}
                maxHits={state.killerOptions?.maxHits || 3}
              />
            </motion.div>
          </Container>
        )}
        
        {/* Winner overlay screen */}
        <AnimatePresence>
          {showWinnerScreen && state.winner && (
            <WinnerOverlay
              initial="initial"
              animate="animate"
              exit="exit"
              variants={overlayAnimation}
            >
              <WinnerCard
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
              >
                <WinnerAvatar color={state.winner.color}>
                  {state.winner.name.charAt(0).toUpperCase()}
                  <Medal 
                    position={1}
                    initial={{ scale: 0, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  >
                    <FiAward />
                  </Medal>
                </WinnerAvatar>
                
                <WinnerName>{state.winner.name} Wins!</WinnerName>
                <p>Last player standing after {state.currentTurn} turns</p>
                
                <StatsContainer
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <StatBox>
                    <StatLabel>Players Eliminated</StatLabel>
                    <StatValue>{winnerStats.totalEliminated}</StatValue>
                  </StatBox>
                  <StatBox>
                    <StatLabel>Darts Thrown</StatLabel>
                    <StatValue>{winnerStats.totalDarts}</StatValue>
                  </StatBox>
                  <StatBox>
                    <StatLabel>Segment</StatLabel>
                    <StatValue>{state.winner.segment}</StatValue>
                  </StatBox>
                  <StatBox>
                    <StatLabel>Killer Status</StatLabel>
                    <StatValue>{state.winner.isKiller ? 'Killer' : 'Not a Killer'}</StatValue>
                  </StatBox>
                </StatsContainer>
                
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
              </WinnerCard>
            </WinnerOverlay>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

// Setup screen for Killer game
const SetupContainer = styled(motion.div)`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(to bottom, rgba(30, 30, 30, 0.7), rgba(40, 40, 40, 0.7));
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const SetupTitle = styled.h1`
  margin-top: 0;
  color: #E94560;
`;

const SegmentDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin: 24px 0;
`;

const PlayerSegment = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
`;

const PlayerDot = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const RulesContainer = styled.div`
  margin: 24px 0;
  text-align: left;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 8px;
`;

const RuleTitle = styled.h3`
  color: #E94560;
  margin-top: 0;
`;

const RuleList = styled.ul`
  margin: 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 8px;
  }
`;

interface KillerSetupScreenProps {
  onComplete: () => void;
  maxHits: number;
}

const KillerSetupScreen: React.FC<KillerSetupScreenProps> = ({ onComplete, maxHits }) => {
  const { state, dispatch } = useGameContext();
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Add effect to ensure segments are assigned
  useEffect(() => {
    // Force assign segments when setup screen is displayed
    dispatch({ type: 'ASSIGN_SEGMENTS' });
  }, [dispatch]);
  
  // Animation to "randomly" assign segments
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000); // Show animation for 2 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleStartGame = () => {
    onComplete();
  };
  
  const placeholderSegments = Array.from({ length: state.players.length }, (_, i) => (i % 20) + 1);
  
  return (
    <SetupContainer>
      <SetupTitle>Killer Game Setup</SetupTitle>
      <p>Assigning segments to players...</p>
      
      <SegmentDisplay>
        {state.players.map((player, index) => (
          <PlayerSegment key={player.id}>
            <PlayerDot color={player.color} />
            <span>{player.name}</span>
            <strong>
              {!animationComplete ? (
                <motion.span
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.7, 1] 
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {placeholderSegments[index % placeholderSegments.length]}
                </motion.span>
              ) : (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  {player.segment}
                </motion.span>
              )}
            </strong>
          </PlayerSegment>
        ))}
      </SegmentDisplay>
      
      {animationComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <RulesContainer>
            <RuleTitle>Game Rules</RuleTitle>
            <RuleList>
              <li>Each player aims for their assigned segment.</li>
              <li>Single hit = 1 point, Double = 2 points, Triple = 3 points.</li>
              <li>You need {maxHits} hits on your segment to become a "Killer".</li>
              <li>Once you're a Killer, hit opponents' segments to eliminate them.</li>
              <li>When a player is hit by a Killer, they're eliminated from the game.</li>
              <li>Last player standing wins!</li>
            </RuleList>
          </RulesContainer>
          
          <Button onClick={handleStartGame} size="large">
            Start Game
          </Button>
        </motion.div>
      )}
    </SetupContainer>
  );
};

export default KillerGameScreen;