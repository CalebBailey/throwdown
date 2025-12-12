import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiAward, FiTarget, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import Card from '../shared/Card';
import ShanghaiDartboard from './ShanghaiDartboard';
import { useGameContext } from '../../context/GameContext';

// 501-style container
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
`;

//  501-style header
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

// 501-style scoreboard
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

const PlayerRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: 4px solid ${props => props.$active ? props.theme.colours.highlight : 'transparent'};
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

const PlayerScore = styled.div`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.theme.colours.text};
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

const ShanghaiGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [dartThrowCount, setDartThrowCount] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(1);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  // Initialize Shanghai-specific player data
  useEffect(() => {
    if (state.gameType === 'shanghai') {
      const updatedPlayers = state.players.map(player => {
        if (!player.shanghaiSegmentScores) {
          return {
            ...player,
            shanghaiSegmentScores: {},
            shanghaisHit: 0,
            singlesHit: 0,
            doublesHit: 0,
            triplesHit: 0,
            score: 0
          };
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
    
    if (segment === currentSegment) {
      const updatedPlayer = { ...currentPlayer };
      const hitValue = multiplier === 'double' ? 2 : multiplier === 'triple' ? 3 : 1;
      const segmentScores = updatedPlayer.shanghaiSegmentScores || {};
      segmentScores[currentSegment] = (segmentScores[currentSegment] || 0) + (hitValue * currentSegment);
      
      switch(multiplier) {
        case 'single': updatedPlayer.singlesHit = (updatedPlayer.singlesHit || 0) + 1; break;
        case 'double': updatedPlayer.doublesHit = (updatedPlayer.doublesHit || 0) + 1; break;
        case 'triple': updatedPlayer.triplesHit = (updatedPlayer.triplesHit || 0) + 1; break;
      }
      
      updatedPlayer.shanghaiSegmentScores = segmentScores;
      updatedPlayer.score = Object.values(segmentScores).reduce((sum, score) => sum + score, 0);
      
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
      dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
    }
    
    setDartThrowCount(prev => prev + 1);
  };
  
  const handleEndTurn = () => {
    const updatedPlayer = { ...currentPlayer };
    const newThrows = [...updatedPlayer.throws];
    newThrows.push([...state.currentThrow.darts]);
    updatedPlayer.throws = newThrows;
    
    const updatedPlayers = [...state.players];
    updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
    
    let nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    
    if (nextPlayerIndex === 0) {
      if (currentSegment === 9) {
        // Game is ending, make sure all players have their final throws recorded
        dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
        
        const winner = [...updatedPlayers].sort((a, b) => b.score - a.score)[0];
        winner.wins = (winner.wins || 0) + 1;
        
        dispatch({ type: 'END_GAME', winner: winner });
        setShowWinnerScreen(true);
        return;
      }
      setCurrentSegment(prev => prev + 1);
    }
    
    dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
    dispatch({ type: 'END_TURN' });
    setDartThrowCount(0);
  };
  
  const handleUndoDart = () => {
    if (dartThrowCount > 0) {
      const lastDartIndex = state.currentThrow.darts.length - 1;
      if (lastDartIndex < 0) return;
      
      const lastDart = state.currentThrow.darts[lastDartIndex];
      const multiplier = lastDart[0];
      const segment = parseInt(lastDart.substring(1));
      
      if (segment === currentSegment) {
        const hitValue = multiplier === 'D' ? 2 : multiplier === 'T' ? 3 : 1;
        const updatedPlayer = { ...currentPlayer };
        const segmentScores = { ...updatedPlayer.shanghaiSegmentScores };
        segmentScores[currentSegment] = (segmentScores[currentSegment] || 0) - (hitValue * currentSegment);
        if (segmentScores[currentSegment] <= 0) delete segmentScores[currentSegment];
        
        switch(multiplier) {
          case 'S': updatedPlayer.singlesHit = Math.max(0, (updatedPlayer.singlesHit || 0) - 1); break;
          case 'D': updatedPlayer.doublesHit = Math.max(0, (updatedPlayer.doublesHit || 0) - 1); break;
          case 'T': updatedPlayer.triplesHit = Math.max(0, (updatedPlayer.triplesHit || 0) - 1); break;
        }
        
        updatedPlayer.shanghaiSegmentScores = segmentScores;
        updatedPlayer.score = Object.values(segmentScores).reduce((sum, score) => sum + score, 0);
        
        const updatedPlayers = [...state.players];
        updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
        dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
      }
      
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
      shanghaiSegmentScores: {},
      shanghaisHit: 0,
      singlesHit: 0,
      doublesHit: 0,
      triplesHit: 0,
      score: 0,
      throws: []
    }));
    
    dispatch({ type: 'RESET_GAME' });
    dispatch({ type: 'START_GAME', gameType: 'shanghai', gameOptions: state.gameOptions });
    dispatch({ type: 'SET_PLAYER_ORDER', players: freshPlayers });
    
    setCurrentSegment(1);
    setShowWinnerScreen(false);
  };
  
  const handleGoToSummary = () => navigate('/shanghai/summary');
  
  return (
    <Layout hideNav>
      <Container>
        <GameHeader>
          <PageTitle>Shanghai</PageTitle>
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
              <Card.Title>Scorecard</Card.Title>
              <Card.Subtitle>Segment {currentSegment} of 9</Card.Subtitle>
            </Card.Header>
            
            <Card.Content>
              <PlayersList>
                {state.players.map((player, index) => (
                  <PlayerRow 
                    key={player.id} 
                    $active={index === state.currentPlayerIndex}
                  >
                    <PlayerColor color={player.colour} />
                    <PlayerInfo>
                      <PlayerName>{player.name}</PlayerName>
                      <PlayerStats>
                        Singles: {player.singlesHit || 0} | 
                        Doubles: {player.doublesHit || 0} | 
                        Triples: {player.triplesHit || 0}
                      </PlayerStats>
                    </PlayerInfo>
                    <PlayerScore>
                      {player.score || 0}
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
              
              <GameInfo>
                <div>Total Score: <strong>{currentPlayer?.score || 0}</strong></div>
                <div>Current Segment: <strong>{currentSegment}</strong></div>
                <DartCountBadge>{dartThrowCount} / 3 darts</DartCountBadge>
              </GameInfo>
              
              <DartboardContainer>
                <ShanghaiDartboard
                  currentSegment={currentSegment}
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
                  <p>With a total score of {state.winner.score} points</p>
                </WinnerHeader>
                
                <WinnerStatsScrollable>
                  <StatsContainer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <StatBox>
                      <StatLabel>Singles</StatLabel>
                      <StatValue>{state.winner.singlesHit || 0}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Doubles</StatLabel>
                      <StatValue>{state.winner.doublesHit || 0}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Triples</StatLabel>
                      <StatValue>{state.winner.triplesHit || 0}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Best Segment</StatLabel>
                      <StatValue>
                        {state.winner.shanghaiSegmentScores 
                          ? Math.max(...Object.values(state.winner.shanghaiSegmentScores)) 
                          : 0}
                      </StatValue>
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

export default ShanghaiGameScreen;
