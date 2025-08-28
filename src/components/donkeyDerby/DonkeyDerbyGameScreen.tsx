import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiChevronRight, FiAward, FiTarget, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import DonkeyDerbyDartboard from './DonkeyDerbyDartboard';
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

const DonkeyDerbyGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [dartThrowCount, setDartThrowCount] = useState(0);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  const finishLine = state.donkeyDerbyOptions?.finishLine || 10;
  
  // Get current player
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  // Init donkey derby if not started correctly
  useEffect(() => {
    if (state.gameType === 'donkey_derby') {
      const updatedPlayers = state.players.map(p => ({
        ...p,
        donkeyProgress: p.donkeyProgress ?? 0,
        singlesHit: p.singlesHit || 0,
        doublesHit: p.doublesHit || 0,
        triplesHit: p.triplesHit || 0
      }));
      dispatch({ type: 'SET_PLAYER_ORDER', players: updatedPlayers });
    }
  }, []);
  
  const handleHitSegment = (segment: number, multiplier: 'single' | 'double' | 'triple') => {
    if (dartThrowCount >= 3) return;
    const hitValue = multiplier === 'double' ? 2 : multiplier === 'triple' ? 3 : 1;
    const notation = `${multiplier === 'single' ? 'S' : multiplier === 'double' ? 'D' : 'T'}${segment}`;
    dispatch({ type: 'ADD_DART', dart: notation });
    const players = [...state.players];
    const cur = { ...players[state.currentPlayerIndex] };
    if (cur.segment === segment) {
      cur.donkeyProgress = Math.min(finishLine, (cur.donkeyProgress || 0) + hitValue);
    } else {
      // knock back owner of segment hit
      const targetIdx = players.findIndex(p => p.segment === segment);
      if (targetIdx >= 0) {
        const target = { ...players[targetIdx] };
        target.donkeyProgress = Math.max(0, (target.donkeyProgress || 0) - hitValue);
        players[targetIdx] = target;
      }
    }
    // stats
    if (multiplier === 'single') cur.singlesHit = (cur.singlesHit || 0) + 1;
    if (multiplier === 'double') cur.doublesHit = (cur.doublesHit || 0) + 1;
    if (multiplier === 'triple') cur.triplesHit = (cur.triplesHit || 0) + 1;
    players[state.currentPlayerIndex] = cur;
    dispatch({ type: 'SET_PLAYER_ORDER', players });
    setDartThrowCount(c => c + 1);
    // check winner immediately
    if ((cur.donkeyProgress || 0) >= finishLine) {
      cur.wins = (cur.wins || 0) + 1;
      dispatch({ type: 'END_GAME', winner: cur });
      setShowWinnerScreen(true);
    }
  };
  
  // Handle ending the turn
  const handleEndTurn = () => {
    // record throws
    const cur = { ...currentPlayer };
    if (state.currentThrow.darts.length) {
      const newThrows = [...cur.throws];
      newThrows.push([...state.currentThrow.darts]);
      cur.throws = newThrows;
    }
    const players = [...state.players];
    players[state.currentPlayerIndex] = cur;
    dispatch({ type: 'SET_PLAYER_ORDER', players });
    if (!showWinnerScreen) dispatch({ type: 'END_TURN' });
    setDartThrowCount(0);
  };
  
  // Handle undoing the last dart
  const handleUndoDart = () => {
    if (dartThrowCount === 0) return;
    const last = state.currentThrow.darts[state.currentThrow.darts.length - 1];
    if (!last) return;
    const multChar = last[0];
    const seg = parseInt(last.substring(1));
    const value = multChar === 'D' ? 2 : multChar === 'T' ? 3 : 1;
    const players = [...state.players];
    const cur = { ...players[state.currentPlayerIndex] };
    if (cur.segment === seg) {
      cur.donkeyProgress = Math.max(0, (cur.donkeyProgress || 0) - value);
    } else {
      const targetIdx = players.findIndex(p => p.segment === seg);
      if (targetIdx >= 0) {
        const target = { ...players[targetIdx] };
        target.donkeyProgress = Math.min(finishLine, (target.donkeyProgress || 0) + value);
        players[targetIdx] = target;
      }
    }
    if (multChar === 'S') cur.singlesHit = Math.max(0, (cur.singlesHit || 0) - 1);
    if (multChar === 'D') cur.doublesHit = Math.max(0, (cur.doublesHit || 0) - 1);
    if (multChar === 'T') cur.triplesHit = Math.max(0, (cur.triplesHit || 0) - 1);
    players[state.currentPlayerIndex] = cur;
    dispatch({ type: 'SET_PLAYER_ORDER', players });
    dispatch({ type: 'REMOVE_DART' });
    setDartThrowCount(c => c - 1);
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
    dispatch({ type: 'START_GAME', gameType: 'donkey_derby', gameOptions: state.gameOptions, donkeyDerbyOptions: state.donkeyDerbyOptions });
    setShowWinnerScreen(false);
  };
  
  // Handle navigating to the detailed summary screen
  const handleGoToSummary = () => navigate('/donkey-derby/summary');
  
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
  
  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeaderBar>
          <Title>
            <span>Donkey Derby</span>
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

            {/* Race track visualization */}
            <motion.div variants={itemVariants}>
              <RaceTrack players={state.players} finishLine={finishLine} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <DonkeyDerbyDartboard
                players={state.players}
                currentPlayer={currentPlayer}
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
          
          {/* Legacy progress board removed in favor of RaceTrack; keep commented if needed for fallback */}
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
                <p>Reached the finish line (target {finishLine})</p>
                
                <StatsContainer
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <StatBox>
                    <StatLabel>Singles</StatLabel>
                    <StatValue>{currentPlayer?.singlesHit || 0}</StatValue>
                  </StatBox>
                  <StatBox>
                      <StatLabel>Doubles</StatLabel>
                      <StatValue>{currentPlayer?.doublesHit || 0}</StatValue>
                  </StatBox>
                  <StatBox>
                      <StatLabel>Triples</StatLabel>
                      <StatValue>{currentPlayer?.triplesHit || 0}</StatValue>
                  </StatBox>
                  <StatBox>
                      <StatLabel>Total Darts</StatLabel>
                      <StatValue>{currentPlayer?.throws.flat().length}</StatValue>
                  </StatBox>
                </StatsContainer>

                <PlayerScoreTally
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3>Player Win Tallies</h3>
                  <ScoreScroller>
                    {state.players.map(p => (
                      <PlayerScoreBox key={p.id} $winner={p.id===state.winner?.id}>
                        <PlayerScoreAvatar color={p.color}>{p.name[0]}</PlayerScoreAvatar>
                        <div>{p.name}</div>
                        <div>{p.donkeyProgress}/{finishLine}</div>
                        <WinCount>{p.wins||0}</WinCount>
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

// New RaceTrack component (discrete nodes up to finish line, capped at 20)
const RaceWrapper = styled.div`
  background: linear-gradient(to bottom, rgba(30,30,30,0.7), rgba(40,40,40,0.7));
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const LaneHeader = styled.div`
  display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:0.85rem;opacity:0.85;
`;
const Lane = styled.div`
  position:relative;
`;
const NodesRow = styled.div<{count:number}>`
  display:grid;
  grid-template-columns: repeat(${p=>p.count}, 1fr);
  gap:4px;
  position:relative;
`;
const Node = styled.div<{ active:boolean;color:string }>`
  width:100%;
  aspect-ratio:1 / 1;
  border-radius:50%;
  background: ${p=>p.active? p.color : 'rgba(255,255,255,0.08)'};
  border:2px solid ${p=>p.color};
  position:relative;
  display:flex;align-items:center;justify-content:center;
  font-size:0.6rem;
  font-weight:bold;
  color:#fff;
  overflow:hidden;
`;
const Token = styled(motion.div)<{color:string}>`
  position:absolute;inset:0;
  background:${p=>p.color};
  border-radius:50%;
  box-shadow:0 0 0 2px #fff, 0 0 8px ${p=>p.color};
`;
interface RaceTrackProps { players:any[]; finishLine:number }
const RaceTrack: React.FC<RaceTrackProps> = ({players, finishLine}) => {
  const maxNodes = Math.min(finishLine, 20);
  const indices = Array.from({length: maxNodes + 1}, (_,i)=>i); // include start (0) to finish
  return (
    <RaceWrapper>
      <h3 style={{margin:'0 0 4px'}}>Finish Line Race</h3>
      {players.map(p=>{
        const progress = Math.min(p.donkeyProgress||0, maxNodes);
        return (
          <div key={p.id}>
            <LaneHeader>
              <PlayerScoreAvatar color={p.color}>{p.name[0]}</PlayerScoreAvatar>
              <strong>{p.name}</strong>
              <span style={{opacity:0.7}}>({progress}/{finishLine})</span>
            </LaneHeader>
            <Lane>
              <NodesRow count={indices.length}>
                {indices.map(i=>{
                  const isActive = i <= progress;
                  return (
                    <Node key={i} active={isActive} color={p.color}>
                      {i===progress && (
                        <Token
                          layoutId={`token-${p.id}`}
                          color={p.color}
                          initial={{ scale:0.4, opacity:0.4 }}
                          animate={{ scale:1, opacity:1 }}
                          transition={{ type:'spring', stiffness:300, damping:20 }}
                        />
                      )}
                      {i}
                    </Node>
                  );
                })}
              </NodesRow>
            </Lane>
          </div>
        );
      })}
      {finishLine>20 && (
        <div style={{fontSize:'0.7rem',opacity:0.6}}>Showing first 20 positions (finish line {finishLine})</div>
      )}
    </RaceWrapper>
  );
};

export default DonkeyDerbyGameScreen;