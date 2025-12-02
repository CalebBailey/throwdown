import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiX, FiArrowLeft, FiTarget, FiDelete, FiAward, FiTrendingUp } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import Card from '../shared/Card';
import GameRestoredBanner from '../shared/GameRestoredBanner';
import { useGameContext } from '../../context/GameContext';
import { isScoreValid, getCheckoutSuggestions, dartNotationToScore, calculateScore } from '../../utils/gameUtils';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
`;

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

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  font-size: ${props => props.theme.fontSizes.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.md};
    gap: ${props => props.theme.space.sm};
  }
`;

const GameOptionsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  font-size: ${props => props.theme.fontSizes.md};
  opacity: 0.7;
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.sm};
    gap: ${props => props.theme.space.xs};
  }
`;

const OptionsTag = styled.span<{ $enabled: boolean }>`
  background-color: ${props => props.$enabled ? props.theme.colours.accent : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$enabled ? props.theme.colours.text : props.theme.colours.text};
  padding: ${props => `${props.theme.space.xs} ${props.theme.space.sm}`};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.space.lg};
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 320px 1fr;
  }
`;

const ScoreboardCard = styled(Card)`
  grid-row: 2;
  height: fit-content;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-row: 1;
  }
`;

const PlayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space.sm};
`;

const PlayerRow = styled.div<{ $active: boolean; $winner: boolean }>`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: 4px solid ${props => 
    props.$winner 
      ? props.theme.colours.success
      : props.$active 
        ? props.theme.colours.highlight 
        : 'transparent'
  };
  transition: all 0.2s ease;
`;

const PlayerColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: ${props => props.theme.space.md};
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PlayerName = styled.span`
  font-weight: 500;
`;

const PlayerStats = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  opacity: 0.7;
`;

const PlayerScore = styled.div<{ $winner: boolean }>`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.$winner ? props.theme.colours.success : props.theme.colours.text};
`;

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

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => props.theme.space.sm}; /* Reduced from lg to sm */
  margin-bottom: ${props => props.theme.space.md}; /* Reduced from xl to md */
`;

const CurrentScore = styled(motion.div)`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: 4rem;
  font-weight: bold;
  text-align: center;
  color: ${props => props.theme.colours.text};
  margin-bottom: 0; /* Changed from lg to 0 to position suggestion box directly below */
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 3rem;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    font-size: 2.5rem;
  }
`;

const SimplifiedCheckout = styled.div<{ $hasCheckout: boolean }>`
  height: 40px; /* Fixed height to prevent layout shifts */
  width: 100%;
  max-width: 200px;
  margin: 4px auto ${props => props.theme.space.lg};
  background-color: ${props => props.$hasCheckout 
    ? `${props.theme.colours.highlight}40` /* 40 adds transparency - equivalent to 25% opacity */
    : 'rgba(255, 255, 255, 0.05)'};
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: 500;
  color: ${props => props.$hasCheckout ? props.theme.colours.highlight : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.2s ease;
`;

const ScoreEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const ScoreInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.space.lg};
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colours.text};
  font-size: ${props => props.theme.fontSizes.xxxl};
  font-family: ${props => props.theme.fonts.monospace};
  text-align: center;
  margin-bottom: ${props => props.theme.space.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colours.highlight};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  width: 100%;
`;

const CheckoutSuggestion = styled.div`
  margin-top: ${props => props.theme.space.lg};
  padding: ${props => props.theme.space.md};
  background-color: ${props => props.theme.colours.accent};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
`;

const SuggestionTitle = styled.h4`
  margin-bottom: ${props => props.theme.space.xs};
  font-size: ${props => props.theme.fontSizes.md};
`;

const SuggestionPath = styled.div`
  font-family: ${props => props.theme.fonts.monospace};
  display: flex;
  gap: ${props => props.theme.space.sm};
  justify-content: center;
  margin-top: ${props => props.theme.space.xs};
`;

const DartThrow = styled.span`
  background-color: ${props => props.theme.colours.primary};
  padding: ${props => `${props.theme.space.xs} ${props.theme.space.sm}`};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 500;
`;

const GameOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.space.md};
  z-index: 100;
`;

const GameOverCard = styled(motion.div)`
  background-color: ${props => props.theme.colours.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.space.xl};
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const WinnerName = styled.h2`
  font-size: ${props => props.theme.fontSizes.xxxl};
  color: ${props => props.theme.colours.highlight};
  margin-bottom: ${props => props.theme.space.lg};
`;

const WinnerStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.space.md};
  margin: ${props => props.theme.space.xl} 0;
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

const CurrentThrowTotal = styled.div`
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: bold;
  color: ${props => props.theme.colours.highlight};
  text-align: center;
`;

/* Enhanced Winner Screen Components */
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
  
  @media (max-height: 600px) and (orientation: landscape) {
    padding: ${props => props.theme.space.md};
    max-height: 95vh;
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

const Game501Screen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [activeScoreTab, setActiveScoreTab] = useState<'single' | 'double' | 'triple' | 'special'>('single');
  const [error, setError] = useState<string | null>(null);
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);
  const isInitialMount = useRef(true);
  
  // Check if we're restoring a game - only on the very first mount
  useEffect(() => {
    // Only show the banner if this is the initial mount AND we have a game in progress past turn 1
    if (isInitialMount.current && state.gameStatus === 'active' && state.players.length > 0 && state.currentTurn > 1) {
      setShowRestoredBanner(true);
      setTimeout(() => setShowRestoredBanner(false), 5000);
    }
    isInitialMount.current = false;
  }, []); // Only run once on mount
  
  // Get the current player
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  // Get the current throw score total
  const currentThrowScore = state.currentThrow.darts.reduce(
    (sum, dart) => sum + dartNotationToScore(dart), 0
  );
  
  // Calculate the live remaining score (taking into account current throw)
  const liveRemainingScore = Math.max(0, currentPlayer ? currentPlayer.score - currentThrowScore : 0);
  
  // Check if current throw would result in a bust
  const wouldBust = React.useMemo(() => {
    if (!currentPlayer || state.currentThrow.darts.length === 0) return false;
    
    const newScore = currentPlayer.score - currentThrowScore;
    
    // Check for bust conditions
    let isBust = newScore < 0 || newScore === 1;
    
    if (newScore === 0) {
      if (state.gameOptions.outMode === 'double' && !state.currentThrow.darts.some(dart => dart.startsWith('D'))) {
        isBust = true;
      } else if (state.gameOptions.outMode === 'master' && !state.currentThrow.darts.some(dart => dart.startsWith('D') || dart.startsWith('T'))) {
        isBust = true;
      }
    }
    
    return isBust;
  }, [currentPlayer, currentThrowScore, state.currentThrow.darts, state.gameOptions.outMode]);

  // Get checkout suggestions based on the live score and remaining darts
  const checkoutSuggestions = getCheckoutSuggestions(
    liveRemainingScore, 
    state.gameOptions.outMode,
    3 - state.currentThrow.darts.length // Calculate darts remaining
  );
  
  // If darts have been thrown and there's a checkout, show only the remaining checkout path
  // This is what fixes the issue where throwing T20 when at 141 should show the path for 81 (T19 D12)
  const displayedCheckoutSuggestions = React.useMemo(() => {
    if (state.currentThrow.darts.length > 0 && 
        checkoutSuggestions[0] !== 'No checkout' && 
        checkoutSuggestions[0] !== 'NO OUTSHOT' &&
        liveRemainingScore <= 170) {
      return checkoutSuggestions;
    }
    
    // For original checkout, display full path
    return checkoutSuggestions;
  }, [checkoutSuggestions, state.currentThrow.darts.length, liveRemainingScore]);
  
  // Handle adding a dart to the current throw
  const handleAddDart = (value: string) => {
    if (state.currentThrow.darts.length >= 3) return;
    
    dispatch({ type: 'ADD_DART', dart: value });
    setError(null);
  };
  
  // Handle removing the last dart
  const handleRemoveLastDart = () => {
    dispatch({ type: 'REMOVE_DART' });
    setError(null);
  };
  
  // Handle submitting the throw
  const handleSubmitThrow = () => {
    // Require at least one dart
    if (state.currentThrow.darts.length === 0) {
      setError('Please enter at least one dart');
      return;
    }
    
    // Submit the current throw
    dispatch({ type: 'SUBMIT_THROW' });
  };
  
  // Handle score tab change
  const handleTabChange = (tab: 'single' | 'double' | 'triple' | 'special') => {
    setActiveScoreTab(tab);
  };
  
  // Handle undo score (for entire turn)
  const handleUndoScore = () => {
    dispatch({
      type: 'UNDO_SCORE',
      playerId: currentPlayer.id
    });
    setError(null);
  };
  
  // Handle game exit
  const handleExitGame = () => {
    if (window.confirm('Are you sure you want to exit? Game progress will be lost.')) {
      dispatch({ type: 'RESET_GAME' });
      navigate('/games');
    }
  };
  
  // Generate number buttons based on active tab
  const renderNumberButtons = () => {
    const buttons = [];
    
    for (let i = 1; i <= 20; i++) {
      let value = i.toString();
      if (activeScoreTab === 'double') value = `D${i}`;
      if (activeScoreTab === 'triple') value = `T${i}`;
      
      buttons.push(
        <NumberButton key={value} onClick={() => handleAddDart(value)}>
          {activeScoreTab === 'single' ? i : value}
        </NumberButton>
      );
    }
    
    return buttons;
  };
  
  // Animation variants
  const scoreAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 300, damping: 20 } 
    },
    exit: { 
      scale: 0.9, 
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
  };
  
  const overlayAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  const cardAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    exit: { opacity: 0, y: 50 }
  };
  
  return (
    <Layout hideNav>
      <Container>
        <GameRestoredBanner show={showRestoredBanner} />
        
        <GameHeader>
          <div>
            <PageTitle>{state.gameType} Game</PageTitle>
            <GameOptionsInfo>
              <OptionsTag $enabled={state.gameOptions.entryMode !== 'straight'}>
                {state.gameOptions.entryMode === 'double' ? 'Double In' : 
                 state.gameOptions.entryMode === 'master' ? 'Master In' : 'Straight In'}
              </OptionsTag>
              <OptionsTag $enabled={state.gameOptions.outMode !== 'straight'}>
                {state.gameOptions.outMode === 'double' ? 'Double Out' : 
                 state.gameOptions.outMode === 'master' ? 'Master Out' : 'Straight Out'}
              </OptionsTag>
              <OptionsTag $enabled={true}>
                {state.gameOptions.format === 'bestOf' ? 'Best of' : 'First to'} {state.gameOptions.legs} 
                {state.gameOptions.sets > 1 ? ` (${state.gameOptions.sets} sets)` : ' legs'}
              </OptionsTag>
            </GameOptionsInfo>
          </div>
          <Button 
            variant="outline" 
            startIcon={<FiArrowLeft />}
            onClick={handleExitGame}
          >
            Exit Game
          </Button>
        </GameHeader>
        
        <GameGrid>
          <ScoreboardCard>
            <Card.Header>
              <Card.Title>Scoreboard</Card.Title>
              <Card.Subtitle>
                Turn {state.currentTurn} | 
                {state.gameOptions.format === 'bestOf' ? ' Best of' : ' First to'} {state.gameOptions.legs} 
                {state.gameOptions.sets > 1 ? ` (${state.gameOptions.sets} sets)` : ' legs'}
              </Card.Subtitle>
            </Card.Header>
            
            <Card.Content>
              <PlayersList>
                {state.players.map((player, index) => (
                  <PlayerRow 
                    key={player.id} 
                    $active={index === state.currentPlayerIndex} 
                    $winner={state.winner?.id === player.id}
                  >
                    <PlayerColor color={player.colour} />
                    <PlayerInfo>
                      <PlayerName>{player.name}</PlayerName>
                      <PlayerStats>
                        Avg: {player.threeDartAverage.toFixed(1)} | 
                        High: {player.highestScore} <br />
                        {player.lastThrowBust 
                          ? 'Last: BUST | '
                          : player.lastScore > 0 
                            ? `Last: ${player.lastScore} | `
                            : ''}
                        {state.gameOptions.sets > 1 
                          ? `Sets: ${player.sets} | Legs: ${player.legs}`
                          : `Legs: ${player.legs}`}
                      </PlayerStats>
                    </PlayerInfo>
                    <PlayerScore $winner={state.winner?.id === player.id}>
                      {player.score}
                    </PlayerScore>
                  </PlayerRow>
                ))}
              </PlayersList>
            </Card.Content>
          </ScoreboardCard>
          
          <MainGameCard>
            <Card.Content>
              <CurrentPlayer>
                <CurrentPlayerAvatar color={currentPlayer?.colour || '#ccc'}>
                  {currentPlayer?.name.charAt(0).toUpperCase()}
                </CurrentPlayerAvatar>
                <CurrentPlayerName>{currentPlayer?.name}'s turn</CurrentPlayerName>
              </CurrentPlayer>
              
              <ScoreSection>
                <AnimatePresence mode="wait">
                  <CurrentScore
                    key={`score-${currentPlayer?.id}-${liveRemainingScore}-${state.currentThrow.darts.join('-')}-${wouldBust}`}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={scoreAnimation}
                  >
                    {wouldBust ? 'BUST' : liveRemainingScore}
                  </CurrentScore>
                </AnimatePresence>
                
                <SimplifiedCheckout $hasCheckout={state.currentThrow.darts.length < 3 && liveRemainingScore <= 170 && displayedCheckoutSuggestions[0] !== 'NO OUTSHOT' && displayedCheckoutSuggestions[0] !== 'No checkout'}>
                  {state.currentThrow.darts.length < 3 && liveRemainingScore <= 170 && displayedCheckoutSuggestions[0] !== 'NO OUTSHOT' && displayedCheckoutSuggestions[0] !== 'No checkout' 
                    ? displayedCheckoutSuggestions.join(', ')
                    : ''}
                </SimplifiedCheckout>
                
                <DartboardUI>
                  <DartThrowDisplay>
                    <DartSlots>
                      {[0, 1, 2].map(index => (
                        <DartSlot 
                          key={index} 
                          $filled={index < state.currentThrow.darts.length}
                          $index={index}
                        >
                          {index < state.currentThrow.darts.length ? (
                            <DartValue>{state.currentThrow.darts[index]}</DartValue>
                          ) : null}
                        </DartSlot>
                      ))}
                    </DartSlots>
                    
                    {currentThrowScore > 0 && (
                    <CurrentThrowTotal>
                      {currentThrowScore}
                    </CurrentThrowTotal>
                    )}

                  </DartThrowDisplay>
                  
                  {/* Dartboard controls */}
                  <DartScoreControls>
                    <ScoreTabs>
                      <ScoreTab 
                        $active={activeScoreTab === 'single'} 
                        onClick={() => handleTabChange('single')}
                      >
                        Single
                      </ScoreTab>
                      <ScoreTab 
                        $active={activeScoreTab === 'double'} 
                        onClick={() => handleTabChange('double')}
                      >
                        Double
                      </ScoreTab>
                      <ScoreTab 
                        $active={activeScoreTab === 'triple'} 
                        onClick={() => handleTabChange('triple')}
                      >
                        Treble
                      </ScoreTab>
                      <NumberButton 
                        onClick={() => handleAddDart('Outer')}
                      >
                        Outer<br />(25)
                      </NumberButton>
                      <NumberButton 
                        onClick={() => handleAddDart('Bull')}
                      >
                        Bull<br />(50)
                      </NumberButton>
                    </ScoreTabs>
                    
                    <NumberGrid>
                      {renderNumberButtons()}
                    </NumberGrid>
                    
                    {/* Bottom row with Miss and Undo/Back buttons */}
                    <BottomControlRow>
                      <MissButton
                      onClick={handleRemoveLastDart}
                      disabled={state.currentThrow.darts.length === 0}
                      >
                        UNDO
                      </MissButton>
                      <MissButton
                        onClick={() => handleAddDart('Miss')}
                      >
                        MISS
                      </MissButton>
                    </BottomControlRow>
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="error-message"
                      >
                        {error}
                      </motion.div>
                    )}
                    
                    <ActionButtons>
                      {/* <Button
                        variant="outline"
                        startIcon={<FiX />}
                        onClick={handleUndoScore}
                        disabled={
                          !currentPlayer?.throws[state.currentRound - 1] || 
                          currentPlayer?.throws[state.currentRound - 1]?.length === 0
                        }
                        fullWidth
                      >
                        Undo Turn
                      </Button> */}
                      <Button 
                        onClick={handleSubmitThrow}
                        startIcon={<FiCheck />}
                        disabled={state.currentThrow.darts.length === 0}
                        fullWidth
                      >
                        Submit
                      </Button>
                    </ActionButtons>
                  </DartScoreControls>
                </DartboardUI>
              </ScoreSection>
            </Card.Content>
          </MainGameCard>
        </GameGrid>
        
        <AnimatePresence>
          {state.gameStatus === 'complete' && state.winner && (
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
                
                <ConfettiOverlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Fancy confetti effect would be implemented here */}
                </ConfettiOverlay>
                
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
                      position={1}
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
                </WinnerHeader>
                
                <WinnerStatsScrollable>
                  <StatsContainer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <StatBox>
                      <StatLabel>Average Score</StatLabel>
                      <StatValue>{state.winner.averageScore.toFixed(1)}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Highest Score</StatLabel>
                      <StatValue>{state.winner.highestScore}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Turns</StatLabel>
                      <StatValue>{state.currentTurn}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Total Wins</StatLabel>
                      <StatValue>{state.winner.wins}</StatValue>
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
                          <WinCount>{player.wins}</WinCount>
                          <div>wins</div>
                        </PlayerScoreBox>
                      ))}
                    </ScoreScroller>
                  </PlayerScoreTally>
                  
                  <ButtonGroup className="game-over-buttons">
                    {/* <Button
                      variant="outline"
                      startIcon={<FiArrowLeft />}
                      onClick={() => {
                        dispatch({ type: 'RESET_GAME' });
                        navigate('/games');
                      }}
                      fullWidth
                    >
                      Game Hub
                    </Button> */}
                    
                    <Button
                      variant="outline"
                      startIcon={<FiTarget />}
                      onClick={() => {
                        dispatch({
                          type: 'START_GAME',
                          gameType: state.gameType,
                          gameOptions: state.gameOptions
                        });
                      }}
                      fullWidth
                    >
                      Play Again
                    </Button>
                    <Button
                      startIcon={<FiArrowRight />}
                      onClick={() => navigate('/summary')}
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

export default Game501Screen;

// New styled components for dartboard UI
const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  width: 100%;
`;

const DartboardUI = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  gap: ${props => props.theme.space.md};
`;

const DartThrowDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.space.md};
`;

const DartSlots = styled.div`
  display: flex;
  gap: ${props => props.theme.space.sm};
  flex: 1;
`;

const DartSlot = styled.div<{ $filled: boolean; $index: number }>`
  width: 70px;
  height: 60px; /* Reduced from 70px to 60px */
  border: 2px solid ${props => props.$filled ? props.theme.colours.highlight : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colours.text};
  background-color: ${props => props.$filled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  position: relative;
  
  &:before {
    content: "${props => props.$index + 1}";
    position: absolute;
    top: -10px;
    left: 8px;
    font-size: ${props => props.theme.fontSizes.xs};
    color: rgba(255, 255, 255, 0.6);
    background: ${props => props.theme.colours.secondary};
    padding: 0 4px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 60px;
    height: 50px;
    font-size: ${props => props.theme.fontSizes.md};
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    width: 50px;
    height: 40px;
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

const DartValue = styled.div`
  font-weight: bold;
`;

const DartScoreControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space.md};
  width: 100%;
`;

const ScoreTabs = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${props => props.theme.space.xs};
`;

const ScoreTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${props => props.theme.space.sm}; /* Reduced from md to sm */
  background-color: ${props => props.$active ? props.theme.colours.highlight : 'rgba(0, 0, 0, 0.2)'};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colours.text};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? props.theme.colours.highlight : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${props => props.theme.space.xs};
  margin-top: ${props => props.theme.space.xs}; /* Reduced from md to xs */
`;

const NumberButton = styled.button`
  padding: ${props => props.theme.space.sm}; /* Reduced from md to sm */
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colours.text};
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    background-color: ${props => props.theme.colours.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.xs};
    font-size: ${props => props.theme.fontSizes.sm};
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    padding: ${props => props.theme.space.xs};
    font-size: ${props => props.theme.fontSizes.xs};
  }
`;


const BottomControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${props => props.theme.space.xs};

`;

const BackButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.theme.colours.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colours.highlight};
  }
`;

const MissButton = styled(BackButton)`
  flex: 1;
  height: 50px;
  text-align: center;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.sm};

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const WinnerTitle = styled(motion.h1)`
  color: ${props => props.theme.colours.highlight};
  font-size: ${props => props.theme.fontSizes.huge};
  margin-bottom: ${props => props.theme.space.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xxxl};
    margin-bottom: ${props => props.theme.space.lg};
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    font-size: ${props => props.theme.fontSizes.xxl};
    margin-bottom: ${props => props.theme.space.md};
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
  
  @media (max-height: 600px) and (orientation: landscape) {
    width: 80px;
    height: 80px;
    font-size: ${props => props.theme.fontSizes.xxl};
  }
`;

const ContinueButton = styled(Button)`
  position: absolute;
  top: ${props => props.theme.space.md};
  right: ${props => props.theme.space.md};
  z-index: 10;
`;

// Winner screen styled components
const ConfettiOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
`;

const Medal = styled(motion.div)<{ position: number }>`
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