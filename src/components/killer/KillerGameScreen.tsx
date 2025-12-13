import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiAward, FiTarget, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import Card from '../shared/Card';
import KillerDartboard from './KillerDartboard';
import KillerPopup from './KillerPopup';
import EliminatedPopup from './EliminatedPopup';
import GameRestoredBanner from '../shared/GameRestoredBanner';
import { useGameContext } from '../../context/GameContext';

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
  gap: ${props => props.theme.space.md};
`;

const PlayerRaceLane = styled.div<{ $active: boolean; $eliminated?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.space.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: 4px solid ${props => props.$active ? props.theme.colours.highlight : 'transparent'};
  opacity: ${props => props.$eliminated ? 0.4 : 1};
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

const ProgressBar = styled(motion.div)<{ color: string; $isKiller?: boolean }>`
  height: 100%;
  background-color: ${props => props.$isKiller ? '#E94560' : props.color};
  border-radius: ${props => props.theme.borderRadius.pill};
  position: relative;
  box-shadow: ${props => props.$isKiller ? '0 0 10px rgba(233, 69, 96, 0.8), 0 0 20px rgba(233, 69, 96, 0.4)' : 'none'};
  
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

// Setup screen styles
const SetupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.space.md};
  z-index: 100;
`;

const SetupCard = styled(motion.div)`
  background-color: ${props => props.theme.colours.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.space.xl};
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const SetupTitle = styled.h2`
  color: ${props => props.theme.colours.highlight};
  margin-bottom: ${props => props.theme.space.lg};
`;

const SegmentDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.space.md};
  justify-content: center;
  margin: ${props => props.theme.space.lg} 0;
`;

const PlayerSegmentChip = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  background-color: rgba(255, 255, 255, 0.1);
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 3px solid ${props => props.color};
`;

const SegmentNumber = styled.span`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.theme.colours.highlight};
`;

const RulesContainer = styled.div`
  text-align: left;
  background-color: rgba(255, 255, 255, 0.05);
  padding: ${props => props.theme.space.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin: ${props => props.theme.space.lg} 0;
`;

const RulesList = styled.ul`
  margin: ${props => props.theme.space.sm} 0;
  padding-left: ${props => props.theme.space.lg};
  
  li {
    margin: ${props => props.theme.space.xs} 0;
    font-size: ${props => props.theme.fontSizes.sm};
    opacity: 0.9;
  }
`;

// Winner screen
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

const KillerGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [showSetup, setShowSetup] = useState(true);
  const [dartThrowCount, setDartThrowCount] = useState(0);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);
  const [showKillerPopup, setShowKillerPopup] = useState(false);
  const [showEliminatedPopup, setShowEliminatedPopup] = useState(false);
  const [eliminatedPlayerInfo, setEliminatedPlayerInfo] = useState<{ name: string; color: string } | null>(null);
  const isInitialMount = useRef(true);
  const previousKillersRef = useRef<Set<string>>(new Set());
  const previousEliminatedRef = useRef<Set<string>>(new Set());
  
  const currentPlayer = state.players[state.currentPlayerIndex];
  const requiredHits = state.killerOptions?.maxHits || 3;
  
  // Check if we're restoring a game and skip setup if so - only on the very first mount
  useEffect(() => {
    if (state.gameType === 'killer' && state.gameStatus === 'active') {
      const allPlayersHaveSegments = state.players.every(p => p.segment !== undefined);
      
      // Only show the banner if this is the initial mount AND we have a game in progress
      if (allPlayersHaveSegments && state.currentTurn > 1 && isInitialMount.current) {
        // We're restoring an in-progress game, skip setup screen
        setShowSetup(false);
        setShowRestoredBanner(true);
        
        // Hide the banner after 5 seconds
        setTimeout(() => setShowRestoredBanner(false), 5000);
      }
    }
    isInitialMount.current = false;
  }, [state.gameType, state.gameStatus, state.players, state.currentTurn]);
  
  const handleSetupComplete = () => {
    setShowSetup(false);
  };
  
  const handleHitSegment = (segment: number, multiplier: string) => {
    if (dartThrowCount >= 3) return;
    
    let dartNotation = '';
    switch(multiplier) {
      case 'double': dartNotation = `D${segment}`; break;
      case 'triple': dartNotation = `T${segment}`; break;
      default: dartNotation = `S${segment}`;
    }
    
    dispatch({ type: 'ADD_DART', dart: dartNotation });
    dispatch({ type: 'PROCESS_KILLER_DART_HIT' });
    setDartThrowCount(prev => prev + 1);
  };
  
  const handleEndTurn = () => {
    dispatch({ type: 'KILLER_SUBMIT_THROW' });
    setDartThrowCount(0);
  };
  
  const handleUndoDart = () => {
    if (dartThrowCount > 0) {
      dispatch({ type: 'REMOVE_KILLER_DART' });
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
    // Reset the game state completely
    dispatch({ type: 'RESET_GAME' });
    
    // Re-initialize the game with fresh players
    const freshPlayers = state.players.map(player => ({
      ...player,
      score: state.gameOptions.startingScore,
      throws: [],
      averageScore: 0,
      highestScore: 0,
      lastScore: 0,
      threeDartAverage: 0,
      first9Average: 0,
      checkoutRate: 0,
      checkoutsCompleted: 0,
      checkoutAttempts: 0,
      highestFinish: 0,
      bestLeg: 0,
      worstLeg: 0,
      segment: undefined,
      isKiller: false,
      segmentHits: 0,
      lives: 0,
      isEliminated: false,
      singlesHit: 0,
      doublesHit: 0,
      triplesHit: 0,
      playersEliminated: 0
    }));
    
    dispatch({ type: 'SET_PLAYER_ORDER', players: freshPlayers });
    dispatch({ 
      type: 'START_GAME', 
      gameType: 'killer', 
      gameOptions: state.gameOptions, 
      killerOptions: state.killerOptions 
    });
    
    setShowWinnerScreen(false);
    setShowSetup(true);
    setDartThrowCount(0);
  };
  
  const handleGoToSummary = () => navigate('/killer/summary');
  
  // Check for winner
  useEffect(() => {
    if (state.gameStatus === 'complete' && state.winner && !showWinnerScreen) {
      setShowWinnerScreen(true);
    }
  }, [state.gameStatus, state.winner]);
  
  // Check for new killers and show popup
  useEffect(() => {
    const currentKillers = new Set(
      state.players.filter(p => p.isKiller).map(p => p.id)
    );
    
    // Check if there's a new killer
    currentKillers.forEach(killerId => {
      if (!previousKillersRef.current.has(killerId)) {
        // New killer detected!
        setShowKillerPopup(true);
      }
    });
    
    // Update the reference for next comparison
    previousKillersRef.current = currentKillers;
  }, [state.players]);
  
  // Check for newly eliminated players and show popup
  useEffect(() => {
    const currentEliminated = new Set(
      state.players.filter(p => p.isEliminated).map(p => p.id)
    );
    
    // Check if there's a newly eliminated player
    currentEliminated.forEach(eliminatedId => {
      if (!previousEliminatedRef.current.has(eliminatedId)) {
        // New elimination detected!
        const eliminatedPlayer = state.players.find(p => p.id === eliminatedId);
        if (eliminatedPlayer) {
          setEliminatedPlayerInfo({
            name: eliminatedPlayer.name,
            color: eliminatedPlayer.colour
          });
          setShowEliminatedPopup(true);
        }
      }
    });
    
    // Update the reference for next comparison
    previousEliminatedRef.current = currentEliminated;
  }, [state.players]);
  
  return (
    <Layout hideNav>
      <Container>
        <GameRestoredBanner show={showRestoredBanner} />
        <KillerPopup 
          show={showKillerPopup} 
          onComplete={() => setShowKillerPopup(false)}
        />
        <EliminatedPopup
          show={showEliminatedPopup}
          playerName={eliminatedPlayerInfo?.name || ''}
          playerColor={eliminatedPlayerInfo?.color || ''}
          onComplete={() => {
            setShowEliminatedPopup(false);
            setEliminatedPlayerInfo(null);
          }}
        />
        
        <GameHeader>
          <PageTitle>Killer</PageTitle>
          <Button 
            variant="outline" 
            startIcon={<FiArrowLeft />}
            onClick={handleExitGame}
          >
            Exit Game
          </Button>
        </GameHeader>
        
        {showSetup ? (
          <AnimatePresence>
            <SetupOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SetupCard
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <SetupTitle>Killer Setup</SetupTitle>
                <p>Each player has been assigned a segment to protect:</p>
                
                <SegmentDisplay>
                  {state.players.map(player => (
                    <PlayerSegmentChip key={player.id} color={player.colour}>
                      <span>{player.name}</span>
                      <SegmentNumber>{player.segment}</SegmentNumber>
                    </PlayerSegmentChip>
                  ))}
                </SegmentDisplay>
                
                <RulesContainer>
                  <h4>Game Rules:</h4>
                  <RulesList>
                    <li>Hit your own segment {requiredHits} times to become a killer</li>
                    <li>Once you're a killer, hit opponents' segments to eliminate them</li>
                    <li>Each opponent needs {requiredHits} hits to be eliminated</li>
                    <li>Last player standing wins!</li>
                  </RulesList>
                </RulesContainer>
                
                <Button onClick={handleSetupComplete} fullWidth>
                  Start Game
                </Button>
              </SetupCard>
            </SetupOverlay>
          </AnimatePresence>
        ) : (
          <GameGrid>
            <ScoreboardCard>
              <Card.Header>
                <Card.Title>Player Status</Card.Title>
                <Card.Subtitle>Required: {requiredHits} hits</Card.Subtitle>
              </Card.Header>
              
              <Card.Content>
                <PlayersList>
                  {state.players.map((player, index) => {
                    const hits = player.segmentHits || 0;
                    const progressPercent = player.isKiller 
                      ? 100 
                      : player.isEliminated 
                        ? 0 
                        : (hits / requiredHits) * 100;

                    // Display "OUT" if hits are negative, otherwise show the number
                    const displayHits = hits < 0 ? 'OUT' : `${hits} / ${requiredHits}`;
                    
                    return (
                      <PlayerRaceLane 
                        key={player.id} 
                        $active={index === state.currentPlayerIndex}
                        $eliminated={player.isEliminated}
                      >
                        <PlayerHeader>
                          <PlayerColor color={player.colour} />
                          <PlayerName>{player.name}</PlayerName>
                          <PlayerProgress>{displayHits}</PlayerProgress>
                        </PlayerHeader>
                        <ProgressTrack>
                          <ProgressBar
                            color={player.colour}
                            $isKiller={player.isKiller}
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
                  <InfoItem>
                    <span>Segment:</span>
                    <strong>{currentPlayer?.segment}</strong>
                  </InfoItem>
                  <InfoItem>
                    <span>Status:</span>
                    <strong>{currentPlayer?.isKiller ? 'Killer' : 'Building'}</strong>
                  </InfoItem>
                  <DartCountBadge>{dartThrowCount} / 3 darts</DartCountBadge>
                </GameInfo>
                
                <DartboardContainer>
                  <KillerDartboard
                    currentPlayerId={currentPlayer?.id}
                    players={state.players}
                    onHitSegment={handleHitSegment}
                    maxHits={requiredHits}
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
        )}
        
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
                  <p>Last player standing!</p>
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
                      <StatLabel>Eliminations</StatLabel>
                      <StatValue>
                        {state.players.filter(p => p.id !== state.winner?.id && p.lives === 0).length}
                      </StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Lives Remaining</StatLabel>
                      <StatValue>{state.winner.lives || requiredHits}</StatValue>
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

export default KillerGameScreen;
