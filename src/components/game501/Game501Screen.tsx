import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiX, FiArrowLeft, FiTarget, FiDelete, FiAward, FiTrendingUp } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { useGameContext } from '../../context/GameContext';
import { isScoreValid, getCheckoutSuggestions, dartNotationToScore } from '../../utils/gameUtils';

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
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.text};
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const GameOptionsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  font-size: ${props => props.theme.fontSizes.md};
  opacity: 0.7;
`;

const OptionsTag = styled.span<{ $enabled: boolean }>`
  background-color: ${props => props.$enabled ? props.theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$enabled ? props.theme.colors.text : props.theme.colors.text};
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
      ? props.theme.colors.success
      : props.$active 
        ? props.theme.colors.highlight 
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
  color: ${props => props.$winner ? props.theme.colors.success : props.theme.colors.text};
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
  margin-bottom: ${props => props.theme.space.lg};
`;

const CurrentPlayerName = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.highlight};
`;

const CurrentPlayerAvatar = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.lg};
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => props.theme.space.lg};
  margin-bottom: ${props => props.theme.space.xl};
`;

const CurrentScore = styled(motion.div)`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: 4rem;
  font-weight: bold;
  text-align: center;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.space.lg};
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
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.xxxl};
  font-family: ${props => props.theme.fonts.monospace};
  text-align: center;
  margin-bottom: ${props => props.theme.space.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.highlight};
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
  background-color: ${props => props.theme.colors.accent};
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
  background-color: ${props => props.theme.colors.primary};
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
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.space.xl};
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const WinnerName = styled.h2`
  font-size: ${props => props.theme.fontSizes.xxxl};
  color: ${props => props.theme.colors.highlight};
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

const CurrentPlayerTurn = styled.div`
  font-size: ${props => props.theme.fontSizes.xxxl};
  font-weight: bold;
  color: ${props => props.theme.colors.accent};
  text-align: center;
  margin-top: ${props => props.theme.space.lg};
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
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.space.xl};
  width: 100%;
  max-width: 600px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
  overflow: hidden;
`;

const ConfettiOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const WinnerTitle = styled(motion.h1)`
  color: ${props => props.theme.colors.highlight};
  font-size: ${props => props.theme.fontSizes.huge};
  margin-bottom: ${props => props.theme.space.xl};
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
`;

const Medal = styled(motion.div)<{ position: number }>`
  position: absolute;
  top: -15px;
  right: -15px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => 
    props.position === 1 ? '#FFD700' : // Gold
    props.position === 2 ? '#C0C0C0' : // Silver
    '#CD7F32' // Bronze
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.lg};
  color: #000;
  font-weight: bold;
  box-shadow: ${props => props.theme.shadows.md};
  border: 2px solid white;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.space.md};
  margin: ${props => props.theme.space.xl} 0;
`;

const PlayerScoreTally = styled(motion.div)`
  margin-top: ${props => props.theme.space.xl};
  overflow: hidden;
  width: 100%;
`;

const ScoreScroller = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.space.md};
  overflow-x: auto;
  padding: ${props => props.theme.space.md} 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PlayerScoreBox = styled.div<{ $winner: boolean }>`
  min-width: 100px;
  background-color: ${props => props.$winner ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.md};
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space.xs};
  border: 2px solid ${props => props.$winner ? props.theme.colors.success : 'transparent'};
`;

const PlayerScoreAvatar = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.md};
`;

const WinCount = styled.div`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
`;

const Game501Screen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [activeScoreTab, setActiveScoreTab] = useState<'single' | 'double' | 'triple' | 'special'>('single');
  const [error, setError] = useState<string | null>(null);
  
  // Get the current player
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  // Check if game is in progress or redirect to summary page if complete
  useEffect(() => {
    if (state.gameStatus === 'complete' && state.winner) {
      // Navigate to summary screen after a brief delay
      const timer = setTimeout(() => {
        navigate('/summary');
      }, 2000);
      
      return () => clearTimeout(timer);
    } else if (state.gameStatus !== 'active') {
      // If not active and not complete, go to games screen
      navigate('/games');
    }
  }, [state.gameStatus, state.winner, navigate]);
  
  // Checkout suggestions for the current player
  const checkoutSuggestions = getCheckoutSuggestions(
    currentPlayer?.score || 0, 
    state.gameOptions.outMode
  );
  
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
  
  // Get the current throw score total
  const currentThrowScore = state.currentThrow.darts.reduce(
    (sum, dart) => sum + dartNotationToScore(dart), 0
  );
  
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
                {state.gameOptions.sets > 1 ? ` (${state.gameOptions.sets} sets)` : ''}
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
                Round {state.currentRound} | 
                {state.gameOptions.format === 'bestOf' ? 'Best of' : 'First to'} {state.gameOptions.legs} 
                {state.gameOptions.sets > 1 ? ` (${state.gameOptions.sets} sets)` : ''}
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
                    <PlayerColor color={player.color} />
                    <PlayerInfo>
                      <PlayerName>{player.name}</PlayerName>
                      <PlayerStats>
                        Avg: {player.averageScore.toFixed(1)} | 
                        High: {player.highestScore}
                        {state.gameOptions.sets > 1 && ` | Sets: ${player.sets}`}
                        {` | Legs: ${player.legs}`}
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
                <CurrentPlayerAvatar color={currentPlayer?.color || '#ccc'}>
                  {currentPlayer?.name.charAt(0).toUpperCase()}
                </CurrentPlayerAvatar>
                <CurrentPlayerName>{currentPlayer?.name}'s turn</CurrentPlayerName>
              </CurrentPlayer>
              
              <ScoreSection>
                <AnimatePresence mode="wait">
                  <CurrentScore
                    key={`score-${currentPlayer?.id}-${currentPlayer?.score}`}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={scoreAnimation}
                  >
                    {currentPlayer?.score}
                  </CurrentScore>
                </AnimatePresence>
                
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
                    
                    <Button
                      variant="outline"
                      startIcon={<FiDelete />}
                      onClick={handleRemoveLastDart}
                      disabled={state.currentThrow.darts.length === 0}
                    >
                      Undo
                    </Button>
                  </DartThrowDisplay>
                  
                  {currentThrowScore > 0 && (
                    <CurrentPlayerTurn>
                      {currentThrowScore}
                    </CurrentPlayerTurn>
                  )}
                  
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
                      <ScoreTab 
                        $active={activeScoreTab === 'special'} 
                        onClick={() => handleTabChange('special')}
                      >
                        Special
                      </ScoreTab>
                    </ScoreTabs>
                    
                    {activeScoreTab !== 'special' ? (
                      <NumberGrid>
                        {renderNumberButtons()}
                      </NumberGrid>
                    ) : (
                      <>
                        <NumberGrid>
                          <SpecialButton 
                            $color="#e74c3c" 
                            onClick={() => handleAddDart('Miss')}
                          >
                            MISS
                          </SpecialButton>
                          <SpecialButton 
                            $color="#f39c12" 
                            onClick={() => handleAddDart('Outer')}
                          >
                            25
                          </SpecialButton>
                          <SpecialButton 
                            $color="#2ecc71" 
                            onClick={() => handleAddDart('Bull')}
                          >
                            BULL
                          </SpecialButton>
                        </NumberGrid>
                      </>
                    )}
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ 
                          color: '#FF4C4C', 
                          textAlign: 'center',
                          marginTop: '8px'
                        }}
                      >
                        {error}
                      </motion.div>
                    )}
                    
                    <ActionButtons>
                      <Button
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
                      </Button>
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
                
                {currentPlayer?.score <= 170 && (
                  <CheckoutSuggestion>
                    <SuggestionTitle>
                      {currentPlayer?.score <= 170 
                        ? 'Checkout Suggestion' 
                        : 'No checkout available yet'}
                    </SuggestionTitle>
                    <SuggestionPath>
                      {checkoutSuggestions.map((suggestion, index) => (
                        <DartThrow key={index}>{suggestion}</DartThrow>
                      ))}
                    </SuggestionPath>
                  </CheckoutSuggestion>
                )}
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
                
                <WinnerTitle
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.2, stiffness: 300 }}
                >
                  WINNER!
                </WinnerTitle>
                
                <WinnerAvatar 
                  color={state.winner.color}
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
                  style={{ 
                    color: '#fff', 
                    fontSize: '2.5rem', 
                    marginTop: '1rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  {state.winner.name}
                </motion.h2>
                
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
                    <StatLabel>Rounds</StatLabel>
                    <StatValue>{state.currentRound}</StatValue>
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
                  <motion.h3 style={{ marginBottom: '0.5rem' }}>Player Win Tallies</motion.h3>
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
                        <PlayerScoreAvatar color={player.color}>
                          {player.name.charAt(0).toUpperCase()}
                        </PlayerScoreAvatar>
                        <div>{player.name}</div>
                        <WinCount>{player.wins}</WinCount>
                        <div>wins</div>
                      </PlayerScoreBox>
                    ))}
                  </ScoreScroller>
                </PlayerScoreTally>
                
                <ButtonGroup style={{ marginTop: '2rem' }}>
                  <Button
                    variant="outline"
                    startIcon={<FiArrowLeft />}
                    onClick={() => {
                      dispatch({ type: 'RESET_GAME' });
                      navigate('/games');
                    }}
                    fullWidth
                  >
                    Game Hub
                  </Button>
                  <Button
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
                </ButtonGroup>
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
  height: 70px;
  border: 2px solid ${props => props.$filled ? props.theme.colors.highlight : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.$filled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  position: relative;
  
  &:before {
    content: "${props => props.$index + 1}";
    position: absolute;
    top: -10px;
    left: 8px;
    font-size: ${props => props.theme.fontSizes.xs};
    color: rgba(255, 255, 255, 0.6);
    background: ${props => props.theme.colors.secondary};
    padding: 0 4px;
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
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const ScoreTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${props => props.theme.space.md};
  background-color: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  border: none;
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${props => props.theme.space.xs};
  margin-top: ${props => props.theme.space.md};
`;

const NumberButton = styled.button`
  padding: ${props => props.theme.space.md};
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    background-color: ${props => props.theme.colors.primary};
  }
`;

const SpecialButtonsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.space.xs};
  margin-top: ${props => props.theme.space.md};
`;

const SpecialButton = styled(NumberButton)<{ $color?: string }>`
  background-color: ${props => props.$color || 'rgba(255, 255, 255, 0.1)'};
  grid-column: span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  
  &:hover {
    background-color: ${props => props.$color ? props.$color + '90' : 'rgba(255, 255, 255, 0.2)'};
  }
`;