import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiChevronRight, FiAward, FiTarget, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import ShanghaiDartboard from './ShanghaiDartboard';
import ShanghaiScorecard from './ShanghaiScorecard';
import { useGameContext } from '../../context/GameContext';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 12px;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: rgba(30, 30, 30, 0.5);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
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

const PlayerTurnIndicator = styled.div`
  background: linear-gradient(to right, rgba(30, 30, 30, 0.7), rgba(40, 40, 40, 0.7));
  padding: 16px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 12px;
  }
`;

const PlayerName = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.25rem;
    flex-wrap: wrap;
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const PlayerStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  opacity: 0.8;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.8rem;
    margin-top: 4px;
  }
`;

const ThrowInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    align-self: flex-end;
    margin-top: -30px;
  }
`;

const DartCount = styled.div`
  font-size: 1rem;
  background-color: rgba(233, 69, 96, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.9rem;
    padding: 0.2rem 0.6rem;
  }
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 8px;
    margin-top: 12px;
  }
`;

const UndoButton = styled(Button)`
  flex: 1;
`;

const NextButton = styled(Button)`
  flex: 2;
`;

// Add new styled components for winner overlay and player score tallies
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
  padding: ${props => props.theme.space.md};
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
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.lg};
    max-height: 85vh;
  }
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
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100px;
    height: 100px;
    font-size: ${props => props.theme.fontSizes.xxxl};
  }
`;

const WinnerName = styled.h2`
  font-size: ${props => props.theme.fontSizes.xxxl};
  color: ${props => props.theme.colors.highlight};
  margin: 1rem 0;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xxl};
    margin: 0.75rem 0;
  }
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

const PlayerScoreTally = styled(motion.div)`
  margin-bottom: ${props => props.theme.space.lg};
`;

const ScoreScroller = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.space.md};
  overflow-x: auto;
  padding: ${props => props.theme.space.md} 0;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.accent} transparent;
`;

const PlayerScoreBox = styled.div<{ $winner: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.space.md};
  background-color: ${props => props.$winner ? `${props.theme.colors.highlight}40` : 'rgba(255, 255, 255, 0.05)' };
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
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: ${props => props.theme.space.sm};
`;

const WinCount = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.theme.colors.highlight};
  margin: ${props => props.theme.space.xs} 0;
`;

const ShanghaiGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [dartThrowCount, setDartThrowCount] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(1); // Start with segment 1
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  
  // Get current player
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  // Effect to initialize Shanghai game properties
  useEffect(() => {
    if (state.gameType === 'shanghai') {
      // Initialize shanghai segment scores for each player if not already done
      const updatedPlayers = state.players.map(player => {
        if (!player.shanghaiSegmentScores) {
          return {
            ...player,
            shanghaiSegmentScores: {},
            singlesHit: 0,
            doublesHit: 0,
            triplesHit: 0,
            score: 0 // Reset score to 0 for Shanghai
          };
        }
        return player;
      });
      
      if (JSON.stringify(updatedPlayers) !== JSON.stringify(state.players)) {
        // Update players with initialized shanghai properties
        dispatch({ 
          type: 'SET_PLAYER_ORDER',
          players: updatedPlayers
        });
      }
    }
  }, []);
  
  // Handle hitting a segment
  const handleHitSegment = (segment: number, multiplier: string) => {
    // If we already have 3 darts, don't accept more throws
    if (dartThrowCount >= 3) return;
    
    // Only allow hits on the current segment for Shanghai
    if (segment !== currentSegment) {
      // For Shanghai we only score when hitting the current segment
      // Create dart notation for tracking but no points
      let dartNotation = '';
      switch(multiplier) {
        case 'double': dartNotation = `D${segment}`; break;
        case 'triple': dartNotation = `T${segment}`; break;
        default: dartNotation = `S${segment}`;
      }
      
      dispatch({ type: 'ADD_DART', dart: dartNotation });
    } else {
      // Create dart notation based on multiplier
      let dartNotation = '';
      let hitValue = 0;
      
      // Determine notation and points
      switch(multiplier) {
        case 'double': 
          dartNotation = `D${segment}`; 
          hitValue = 2; 
          break;
        case 'triple': 
          dartNotation = `T${segment}`; 
          hitValue = 3; 
          break;
        default: 
          dartNotation = `S${segment}`;
          hitValue = 1;
      }
      
      // Add the dart to the current throw
      dispatch({ type: 'ADD_DART', dart: dartNotation });
      
      // Process the hit for Shanghai scoring
      // We need to:
      // 1. Update player's segment score for the current segment
      // 2. Update hit statistics (singles/doubles/triples)
      
      // Clone current player for updating
      const updatedPlayer = { ...currentPlayer };
      
      // Initialize or update segment scores
      const segmentScores = updatedPlayer.shanghaiSegmentScores || {};
      segmentScores[currentSegment] = (segmentScores[currentSegment] || 0) + (hitValue * currentSegment);
      
      // Update hit statistics
      switch(multiplier) {
        case 'single': 
          updatedPlayer.singlesHit = (updatedPlayer.singlesHit || 0) + 1;
          break;
        case 'double': 
          updatedPlayer.doublesHit = (updatedPlayer.doublesHit || 0) + 1;
          break;
        case 'triple': 
          updatedPlayer.triplesHit = (updatedPlayer.triplesHit || 0) + 1;
          break;
      }
      
      updatedPlayer.shanghaiSegmentScores = segmentScores;
      updatedPlayer.score = Object.values(segmentScores).reduce((sum, score) => sum + score, 0);
      
      // Update players array with the updated player
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
      
      // Update player state with the changes
      dispatch({ 
        type: 'SET_PLAYER_ORDER',
        players: updatedPlayers
      });
    }
    
    // Increment the dart count
    setDartThrowCount(prev => prev + 1);
  };
  
  // Handle ending the turn
  const handleEndTurn = () => {
    const dartsThrown = [...state.currentThrow.darts];
    
    // Record the throws
    const updatedPlayer = { ...currentPlayer };
    const newThrows = [...updatedPlayer.throws];
    newThrows.push(dartsThrown);
    updatedPlayer.throws = newThrows;
    
    // Update players array
    const updatedPlayers = [...state.players];
    updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
    
    // Move to the next player
    let nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    
    // If we've gone through all players for this segment, move to the next segment
    if (nextPlayerIndex === 0) {
      // If we completed segment 9, the game is over
      if (currentSegment === 9) {
        // Find the winner (player with highest score)
        const winner = [...updatedPlayers].sort((a, b) => b.score - a.score)[0];
        winner.wins = (winner.wins || 0) + 1;
        
        // Update session stats
        const newPlayerWins = { ...state.sessionStats.playerWins };
        newPlayerWins[winner.id] = (newPlayerWins[winner.id] || 0) + 1;
        
        // Update players and state
        dispatch({ 
          type: 'SET_PLAYER_ORDER',
          players: updatedPlayers
        });
        
        // End the game with the winner
        dispatch({
          type: 'END_GAME',
          winner: winner
        });
        
        // Display winner screen
        setShowWinnerScreen(true);
        return;
      }
      
      // Move to the next segment
      setCurrentSegment(prev => prev + 1);
    }
    
    // Update players array with updated throws
    dispatch({ 
      type: 'SET_PLAYER_ORDER',
      players: updatedPlayers
    });
    
    // Move to the next player
    dispatch({
      type: 'END_TURN'
    });
    
    // Reset dart count for next player
    setDartThrowCount(0);
  };
  
  // Handle undoing the last dart
  const handleUndoDart = () => {
    if (dartThrowCount > 0) {
      // First, get the last dart thrown
      const lastDartIndex = state.currentThrow.darts.length - 1;
      if (lastDartIndex < 0) return;
      
      const lastDart = state.currentThrow.darts[lastDartIndex];
      
      // Parse the dart notation
      const multiplier = lastDart[0];
      const segment = parseInt(lastDart.substring(1));
      
      // If the dart was on the current segment, remove its score
      if (segment === currentSegment) {
        let hitValue = 0;
        
        // Determine points
        switch(multiplier) {
          case 'D': hitValue = 2; break;
          case 'T': hitValue = 3; break;
          default: hitValue = 1; // 'S'
        }
        
        // Clone current player for updating
        const updatedPlayer = { ...currentPlayer };
        
        // Update segment scores
        const segmentScores = { ...updatedPlayer.shanghaiSegmentScores };
        segmentScores[currentSegment] = (segmentScores[currentSegment] || 0) - (hitValue * currentSegment);
        if (segmentScores[currentSegment] <= 0) {
          delete segmentScores[currentSegment];
        }
        
        // Update hit statistics
        switch(multiplier) {
          case 'S': 
            updatedPlayer.singlesHit = Math.max(0, (updatedPlayer.singlesHit || 0) - 1);
            break;
          case 'D': 
            updatedPlayer.doublesHit = Math.max(0, (updatedPlayer.doublesHit || 0) - 1);
            break;
          case 'T': 
            updatedPlayer.triplesHit = Math.max(0, (updatedPlayer.triplesHit || 0) - 1);
            break;
        }
        
        updatedPlayer.shanghaiSegmentScores = segmentScores;
        updatedPlayer.score = Object.values(segmentScores).reduce((sum, score) => sum + score, 0);
        
        // Update players array with the updated player
        const updatedPlayers = [...state.players];
        updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
        
        // Update player state with the changes
        dispatch({ 
          type: 'SET_PLAYER_ORDER',
          players: updatedPlayers
        });
      }
      
      // Remove the dart
      dispatch({ type: 'REMOVE_DART' });
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
    dispatch({
      type: 'START_GAME',
      gameType: 'shanghai',
      gameOptions: state.gameOptions
    });
    setCurrentSegment(1);
    setShowWinnerScreen(false);
  };
  
  // Handle navigating to the detailed summary screen
  const handleGoToSummary = () => {
    navigate('/shanghai/summary');
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
  
  // Calculate game statistics for winner screen
  const calculateWinnerStats = () => {
    if (!state.winner) return { totalScore: 0, singlesHit: 0, doublesHit: 0, triplesHit: 0, highestSegmentScore: 0 };
    
    const totalScore = state.winner.score || 0;
    const singlesHit = state.winner.singlesHit || 0;
    const doublesHit = state.winner.doublesHit || 0;
    const triplesHit = state.winner.triplesHit || 0;
    
    // Calculate highest segment score
    let highestSegmentScore = 0;
    if (state.winner.shanghaiSegmentScores) {
      const scores = Object.values(state.winner.shanghaiSegmentScores);
      highestSegmentScore = scores.length ? Math.max(...scores) : 0;
    }
    
    return {
      totalScore,
      singlesHit,
      doublesHit,
      triplesHit,
      highestSegmentScore
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
            <span>Shanghai</span>
          </Title>
          <Button
            variant="text"
            startIcon={<FiArrowLeft />}
            onClick={handleExitGame}
          >
            Exit Game
          </Button>
        </HeaderBar>
        
        <Container>
          <GameArea>
            <motion.div variants={itemVariants}>
              <PlayerTurnIndicator>
                <PlayerInfo>
                  <PlayerName color={currentPlayer?.color || '#fff'}>
                    <span>{currentPlayer?.name || 'Unknown'}</span>
                  </PlayerName>
                  
                  <ThrowInfo>
                    <DartCount>
                      {dartThrowCount} / 3 darts
                    </DartCount>
                  </ThrowInfo>
                </PlayerInfo>
                
                <PlayerStatus>
                  <div>Total Score: <strong>{currentPlayer?.score || 0}</strong></div>
                </PlayerStatus>
              </PlayerTurnIndicator>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ShanghaiDartboard
                currentPlayer={currentPlayer}
                currentSegment={currentSegment}
                onHitSegment={handleHitSegment}
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
            <ShanghaiScorecard
              players={state.players}
              currentPlayerId={currentPlayer?.id}
              currentSegment={currentSegment}
            />
          </motion.div>
        </Container>
        
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
                    initial={{ scale: 0, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  >
                    <FiAward />
                  </Medal>
                </WinnerAvatar>
                
                <WinnerName>{state.winner.name} Wins!</WinnerName>
                <p>With a total score of {state.winner.score} points</p>
                
                <StatsContainer
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <StatBox>
                    <StatLabel>Singles Hit</StatLabel>
                    <StatValue>{winnerStats.singlesHit}</StatValue>
                  </StatBox>
                  <StatBox>
                    <StatLabel>Doubles Hit</StatLabel>
                    <StatValue>{winnerStats.doublesHit}</StatValue>
                  </StatBox>
                  <StatBox>
                    <StatLabel>Triples Hit</StatLabel>
                    <StatValue>{winnerStats.triplesHit}</StatValue>
                  </StatBox>
                  <StatBox>
                    <StatLabel>Highest Segment Score</StatLabel>
                    <StatValue>{winnerStats.highestSegmentScore}</StatValue>
                  </StatBox>
                </StatsContainer>

                <PlayerScoreTally
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3>Player Win Tallies</h3>
                  <ScoreScroller>
                    {state.players.map(player => (
                      <PlayerScoreBox 
                        key={player.id} 
                        $winner={state.winner ? player.id === state.winner.id : false}
                      >
                        <PlayerScoreAvatar color={player.color}>
                          {player.name.charAt(0).toUpperCase()}
                        </PlayerScoreAvatar>
                        <div>{player.name}</div>
                        <WinCount>{player.wins || 0}</WinCount>
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
              </WinnerCard>
            </WinnerOverlay>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default ShanghaiGameScreen;