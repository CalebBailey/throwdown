import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiHome, FiRepeat, FiArrowRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useGameContext } from '../../context/GameContext';
import { calculatePlayerStats } from '../../utils/gameUtils';

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
  grid-template-columns: auto auto repeat(8, auto);
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
  grid-template-columns: auto auto repeat(8, auto);
  gap: ${props => props.theme.space.md};
  align-items: center;
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  font-weight: 500;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colours.text};
  opacity: 0.7;
  margin-left: 30px;

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

// Component for Mobile Player Row with expandable details
interface MobilePlayerRowProps {
  player: any;
  isWinner: boolean;
  stats: any;
}

const MobilePlayerRowComponent: React.FC<MobilePlayerRowProps> = ({ player, isWinner, stats }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <MobilePlayerRow $winner={isWinner}>
      <MobilePlayerHeader onClick={() => setExpanded(!expanded)}>
        <MobilePlayerInfo>
          <PlayerColor color={player.colour} />
          <PlayerName>{player.name} {isWinner && '🏆'}</PlayerName>
        </MobilePlayerInfo>
        {expanded ? <FiChevronUp /> : <FiChevronDown />}
      </MobilePlayerHeader>
      
      <MobilePlayerDetails $expanded={expanded}>
        <MobileStatsGrid>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>3 Dart Avg</MobileStatLabel>
              <MobileStatValue>{stats.threeDartAverage.toFixed(1)}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>First 9 Avg</MobileStatLabel>
              <MobileStatValue>{stats.first9Average.toFixed(1)}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Highest</MobileStatLabel>
              <MobileStatValue>{stats.highest}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Checkout %</MobileStatLabel>
              <MobileStatValue>{stats.checkoutPercentage.toFixed(1)}%</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Checkouts</MobileStatLabel>
              <MobileStatValue>{stats.checkoutsCompleted}/{stats.checkoutsAttempted}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Highest Finish</MobileStatLabel>
              <MobileStatValue>{stats.highestFinish > 0 ? stats.highestFinish : '-'}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Best Leg</MobileStatLabel>
              <MobileStatValue>{stats.bestLeg > 0 ? stats.bestLeg : '-'}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
          <MobileStatItem>
            <MobileStat>
              <MobileStatLabel>Darts</MobileStatLabel>
              <MobileStatValue>{stats.dartsThrown}</MobileStatValue>
            </MobileStat>
          </MobileStatItem>
        </MobileStatsGrid>
      </MobilePlayerDetails>
    </MobilePlayerRow>
  );
};

const GameSummaryScreen: React.FC = () => {
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
    dispatch({
      type: 'START_GAME',
      gameType: state.gameType,
      gameOptions: state.gameOptions
    });
    navigate(`/games/${state.gameType.toLowerCase()}`);
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
            <PageTitle>Game Summary</PageTitle>
          </SummaryHeader>
          
          <WinnerSection as={motion.div} variants={childVariants}>
            <WinnerAvatar color={state.winner.colour}>
              {state.winner.name.charAt(0).toUpperCase()}
            </WinnerAvatar>
            <WinnerName>{state.winner.name} Wins!</WinnerName>
            <p>{state.gameType} game completed in {state.currentTurn} turns</p>
          </WinnerSection>
          
          <motion.div variants={childVariants}>
            <Card>
            <Card.Header>
              <Card.Title>Game Statistics</Card.Title>
              <Card.Subtitle>{state.gameType} with {state.players.length} players</Card.Subtitle>
            </Card.Header>
            
            <Card.Content>
              <StatsGrid>
                <StatCard>
                  <h3>Game Type</h3>
                  <StatValue>{state.gameType}</StatValue>
                  <p>
                    {state.gameOptions.entryMode === 'double' ? 'Double In' : 
                     state.gameOptions.entryMode === 'master' ? 'Master In' : 'Straight In'} | 
                    {state.gameOptions.outMode === 'double' ? ' Double Out' : 
                     state.gameOptions.outMode === 'master' ? ' Master Out' : ' Straight Out'}
                  </p>
                </StatCard>
                <StatCard>
                  <h3>Turns</h3>
                  <StatValue>{state.currentTurn}</StatValue>
                  <p>Total turns played</p>
                </StatCard>
                <StatCard>
                  <h3>Winner</h3>
                  <StatValue>{state.winner.name}</StatValue>
                  <p>Total wins: {state.winner.wins}</p>
                </StatCard>
                <StatCard>
                  <h3>Average Score</h3>
                  <StatValue>{state.winner.averageScore.toFixed(1)}</StatValue>
                  <p>Winner's average score per dart</p>
                </StatCard>
              </StatsGrid>
              
              <PlayersStatsTable>
                {/* Desktop version of the table with header */}
                <StatHeader>
                  <div></div>
                  <div>Player</div>
                  <StatCell>3 Dart Avg</StatCell>
                  <StatCell>First 9 Avg</StatCell>
                  <StatCell>Highest</StatCell>
                  <StatCell>Checkout %</StatCell>
                  <StatCell>Checkouts</StatCell>
                  <StatCell>Highest Finish</StatCell>
                  <StatCell>Best Leg</StatCell>
                  <StatCell>Darts</StatCell>
                </StatHeader>
                
                {/* Desktop rows */}
                {state.players.map(player => {
                  const stats = calculatePlayerStats(player);
                  const isWinner = player.id === state.winner?.id;
                  
                  return (
                    <PlayerRow key={`desktop-${player.id}`} $winner={isWinner}>
                      <PlayerColor color={player.colour} />
                      <PlayerName>{player.name} {isWinner && '🏆'}</PlayerName>
                      <StatCell>{stats.threeDartAverage.toFixed(1)}</StatCell>
                      <StatCell>{stats.first9Average.toFixed(1)}</StatCell>
                      <StatCell>{stats.highest}</StatCell>
                      <StatCell>{stats.checkoutPercentage.toFixed(1)}%</StatCell>
                      <StatCell>{stats.checkoutsCompleted}/{stats.checkoutsAttempted}</StatCell>
                      <StatCell>{stats.highestFinish > 0 ? stats.highestFinish : '-'}</StatCell>
                      <StatCell>{stats.bestLeg > 0 ? stats.bestLeg : '-'}</StatCell>
                      <StatCell>{stats.dartsThrown}</StatCell>
                    </PlayerRow>
                  );
                })}
                
                {/* Mobile version of the table with expandable rows */}
                {state.players.map(player => {
                  const stats = calculatePlayerStats(player);
                  const isWinner = player.id === state.winner?.id;
                  
                  return (
                    <MobilePlayerRowComponent 
                      key={`mobile-${player.id}`}
                      player={player}
                      isWinner={isWinner}
                      stats={stats}
                    />
                  );
                })}
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

export default GameSummaryScreen;