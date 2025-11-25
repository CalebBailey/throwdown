import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiHome, FiRepeat, FiArrowRight, FiChevronUp, FiChevronDown } from 'react-icons/fi';
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

// Mobile version of the player row with expandable details
const MobilePlayerRow = styled.div<{ $winner: boolean }>`
  display: none; /* Hidden on desktop */
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
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobilePlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.space.md};
  cursor: pointer;
`;

const MobilePlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
`;

const MobilePlayerDetails = styled.div<{ $expanded: boolean }>`
  padding: ${props => props.$expanded ? props.theme.space.md : 0};
  max-height: ${props => props.$expanded ? '500px' : '0'};
  opacity: ${props => props.$expanded ? 1 : 0};
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.2);
`;

const MobileStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.space.xs};
`;

const MobileStatItem = styled.div`
  padding: ${props => props.theme.space.xs};
`;

const MobileStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${props => props.theme.space.xs};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const MobileStatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  opacity: 0.7;
`;

const MobileStatValue = styled.div`
  font-weight: bold;
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

const StatHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr repeat(6, auto);
  gap: ${props => props.theme.space.md};
  align-items: center;
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  font-weight: 500;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colours.text};
  opacity: 0.7;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none; /* Hide header on mobile */
  }
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

const SegmentBadge = styled.span`
  display: inline-block;
  background-color: rgba(233, 69, 96, 0.2);
  color: ${props => props.theme.colours.highlight};
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: ${props => props.theme.space.sm};
  font-size: 0.8rem;
`;

// Chart showing segments 1-9 with success indicators
const SegmentChart = styled.div`
  display: flex;
  gap: 4px;
  margin-top: ${props => props.theme.space.sm};
  justify-content: center;
`;

const SegmentBlock = styled.div<{ $active: boolean; $score: number }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${props => props.$active 
    ? props.$score > 0 
      ? `rgba(76, 175, 80, ${Math.min(1, props.$score / 20)})`
      : 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => props.theme.colours.text};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
`;

// Additional styled components for the segment scorecard
const ScoreCardTitle = styled.h3`
  margin: ${props => props.theme.space.md} 0;
  color: ${props => props.theme.colours.text};
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: auto repeat(9, 1fr) auto;
  gap: 4px;
  margin: ${props => props.theme.space.md} 0 ${props => props.theme.space.xl};
  overflow-x: auto;
  padding-bottom: ${props => props.theme.space.sm};
`;

const HeaderCell = styled.div`
  background-color: rgba(20, 20, 20, 0.5);
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
  color: ${props => props.theme.colours.text};
`;

const SegmentCell = styled.div<{ isHighest?: boolean }>`
  background-color: ${props => props.isHighest ? 'rgba(233, 69, 96, 0.2)' : 'rgba(20, 20, 20, 0.5)'};
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  color: ${props => props.isHighest ? props.theme.colours.highlight : props.theme.colours.text};
  font-weight: ${props => props.isHighest ? 'bold' : 'normal'};
`;

const PlayerCell = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: ${props => props.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(20, 20, 20, 0.3)'};
  border-radius: 4px;
`;

const PlayerDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const ScoreCell = styled.div<{ isHighest?: boolean }>`
  background-color: ${props => props.isHighest ? 'rgba(76, 175, 80, 0.2)' : 'rgba(20, 20, 20, 0.2)'};
  padding: 8px 4px;
  text-align: center;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
  font-weight: ${props => props.isHighest ? 'bold' : 'normal'};
`;

const TotalScoreCell = styled(ScoreCell)`
  font-weight: bold;
  background-color: rgba(20, 20, 20, 0.5);
`;

// Component for Mobile Player Row with expandable details
interface MobilePlayerRowProps {
  player: any;
  isWinner: boolean;
}

const MobilePlayerRowComponent: React.FC<MobilePlayerRowProps> = ({ player, isWinner }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Get the player's best segment
  const getBestSegment = (): number => {
    if (!player.shanghaiSegmentScores) return 0;
    
    let bestSegment = 0;
    let highestScore = 0;
    
    Object.entries(player.shanghaiSegmentScores).forEach(([segment, score]) => {
      if (Number(score) > highestScore) {
        highestScore = Number(score);
        bestSegment = parseInt(segment);
      }
    });
    
    return bestSegment;
  };
  
  // Get hit statistics
  const getHitStatistics = () => {
    return {
      singlesHit: player.singlesHit || 0,
      doublesHit: player.doublesHit || 0,
      triplesHit: player.triplesHit || 0,
      shanghaisHit: player.shanghaisHit || 0,
    };
  };
  
  const stats = getHitStatistics();
  const bestSegment = getBestSegment();
  
  return (
    <MobilePlayerRow $winner={isWinner}>
      <MobilePlayerHeader onClick={() => setExpanded(!expanded)}>
        <MobilePlayerInfo>
          <PlayerColor color={player.colour} />
          <PlayerName>{player.name} {isWinner && '🏆'}</PlayerName>
          <div>{player.score} pts</div>
        </MobilePlayerInfo>
        {expanded ? <FiChevronUp /> : <FiChevronDown />}
      </MobilePlayerHeader>
      
      <MobilePlayerDetails $expanded={expanded}>
        <MobileStatsGrid>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Singles Hit</MobileStatLabel>
              <MobileStatValue>{stats.singlesHit}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Doubles Hit</MobileStatLabel>
              <MobileStatValue>{stats.doublesHit}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Triples Hit</MobileStatLabel>
              <MobileStatValue>{stats.triplesHit}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Shanghais Hit</MobileStatLabel>
              <MobileStatValue>{stats.shanghaisHit}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Best Segment</MobileStatLabel>
              <MobileStatValue>
                {bestSegment > 0 ? bestSegment : '-'}
                {bestSegment > 0 && player.shanghaiSegmentScores && 
                  ` (${player.shanghaiSegmentScores[bestSegment]} pts)`}
              </MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Total Darts</MobileStatLabel>
              <MobileStatValue>{player.throws.flat().length}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
        </MobileStatsGrid>
        
        {/* Segment chart showing which segments were hit */}
        <div className="segment-progress-container">
          <MobileStatLabel className="segment-progress-label">Segment Progress</MobileStatLabel>
          <SegmentChart>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(segment => {
              const score = player.shanghaiSegmentScores && player.shanghaiSegmentScores[segment] 
                ? player.shanghaiSegmentScores[segment] 
                : 0;
              return (
                <SegmentBlock 
                  key={segment} 
                  $active={score > 0} 
                  $score={score}
                >
                  {segment}
                </SegmentBlock>
              );
            })}
          </SegmentChart>
        </div>
      </MobilePlayerDetails>
    </MobilePlayerRow>
  );
};

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
  
  // Helper function to get the segment score for a player
  const getSegmentScore = (player: any, segment: number): number => {
    // For Shanghai, we need to extract scores for each segment from throws
    let score = 0;
    
    // Check if the player has shanghaiSegmentScores and if there's a score for this segment
    if (player.shanghaiSegmentScores && player.shanghaiSegmentScores[segment]) {
      score = player.shanghaiSegmentScores[segment];
    }
    
    return score;
  };
  
  // Get total score for a player across all segments
  const getTotalScore = (player: any): number => {
    if (!player.shanghaiSegmentScores) return 0;
    
    return Object.values(player.shanghaiSegmentScores).reduce((total: number, score: any) => total + Number(score), 0);
  };
  
  // Find the highest score for a specific segment across all players
  const getHighestScoreForSegment = (segment: number): number => {
    let highest = 0;
    state.players.forEach(player => {
      const score = getSegmentScore(player, segment);
      if (score > highest) highest = score;
    });
    return highest;
  };
  
  // Calculate total game statistics
  const calculateGameStats = () => {
    let totalDarts = 0;
    let totalSingles = 0;
    let totalDoubles = 0;
    let totalTriples = 0;
    let highestSegmentScore = 0;
    let highestTotalScore = 0;
    let segmentsHit = 0;
    let totalShanghais = 0;
    
    state.players.forEach(player => {
      const darts = player.throws.flat();
      totalDarts += darts.length;
      totalSingles += player.singlesHit || 0;
      totalDoubles += player.doublesHit || 0;
      totalTriples += player.triplesHit || 0;
      totalShanghais += player.shanghaisHit || 0;
      
      // Track highest scores
      if (player.score > highestTotalScore) {
        highestTotalScore = player.score;
      }
      
      // Track highest segment score
      if (player.shanghaiSegmentScores) {
        Object.values(player.shanghaiSegmentScores).forEach(score => {
          if (Number(score) > highestSegmentScore) {
            highestSegmentScore = Number(score);
          }
        });
        
        // Count total unique segments hit across all players
        segmentsHit += Object.keys(player.shanghaiSegmentScores).length;
      }
    });
        
    return {
      totalDarts,
      totalSingles,
      totalDoubles,
      totalTriples,
      highestSegmentScore,
      highestTotalScore,
      totalShanghais,
    };
  };
  
  // Get the best segment for a player
  const getBestSegment = (player: any): number => {
    if (!player.shanghaiSegmentScores) return 0;
    
    let bestSegment = 0;
    let highestScore = 0;
    
    Object.entries(player.shanghaiSegmentScores).forEach(([segment, score]) => {
      if (Number(score) > highestScore) {
        highestScore = Number(score);
        bestSegment = parseInt(segment);
      }
    });
    
    return bestSegment;
  };
  
  // Calculate segment completion rate
  const getCompletedSegments = (player: any): number => {
    if (!player.shanghaiSegmentScores) return 0;
    return Object.keys(player.shanghaiSegmentScores).length;
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
                      <div className="player-stats-row">
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