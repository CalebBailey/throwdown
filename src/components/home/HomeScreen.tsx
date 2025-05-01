import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTarget, FiUsers } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import { useGameContext } from '../../context/GameContext';
import Card from '../shared/Card';

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${props => props.theme.space.xxl} 0;
`;

const AppLogo = styled(motion.div)`
  font-family: ${props => props.theme.fonts.headings};
  font-weight: 800;
  font-size: ${props => props.theme.fontSizes.huge};
  color: ${props => props.theme.colors.highlight};
  margin-bottom: ${props => props.theme.space.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
`;

const LogoIcon = styled.div`
  font-size: 1.2em;
`;

const Logo = styled(motion.img)`
  width: 200px;
  height: auto;
  margin-right: ${props => props.theme.space.sm};
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
`;

const Tagline = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.space.xl};
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.lg};
`;

const SessionStats = styled(motion.div)`
  margin-top: ${props => props.theme.space.xxl};
  width: 100%;
  max-width: 800px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.lg};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.space.md};
`;

const StatValue = styled.div`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: bold;
  color: ${props => props.theme.colors.highlight};
  margin: ${props => props.theme.space.md} 0;
`;

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useGameContext();
  
  const handleAddPlayers = () => {
    navigate('/players');
  };
  
  const handleQuickStart = () => {
    // Navigate to X01 game with default settings
    navigate('/games/X01');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <HeroSection>
          <Logo
            src="/ThrowDownLogoNoBkgd.png"
            alt="ThrowDown Logo"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.5, 
              duration: 1, 
              type: "spring",
              stiffness: 120 
            }}
          />
          <AppLogo variants={itemVariants}>
            <LogoIcon /> 
          </AppLogo>
          <Tagline variants={itemVariants}>
            The ultimate darts scoring experience
          </Tagline>
          <motion.div variants={itemVariants}>
            <ButtonGroup>
              <Button 
                size="large" 
                onClick={handleAddPlayers}
                startIcon={<FiUsers />}
              >
                Add Players
              </Button>
              {/* <Button 
                variant="secondary" 
                size="large" 
                onClick={handleQuickStart}
                startIcon={<FiArrowRight />}
              >
                Quick Start 501
              </Button> */}
            </ButtonGroup>
          </motion.div>
        </HeroSection>
{/*         
        {state.sessionStats.gamesPlayed > 0 && (
          <SessionStats variants={itemVariants}>
            <Card>
              <Card.Header>
                <Card.Title>Session Statistics</Card.Title>
                <Card.Subtitle>Your current gaming session</Card.Subtitle>
              </Card.Header>
              <Card.Content>
                <StatsGrid>
                  <StatCard>
                    <h4>Games Played</h4>
                    <StatValue>{state.sessionStats.gamesPlayed}</StatValue>
                  </StatCard>
                  {Object.entries(state.sessionStats.playerWins)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([playerId, wins]) => {
                      const player = state.players.find(p => p.id === playerId);
                      return player ? (
                        <StatCard key={playerId}>
                          <h4>{player.name}</h4>
                          <StatValue>{wins} {wins === 1 ? 'win' : 'wins'}</StatValue>
                        </StatCard>
                      ) : null;
                    })}
                </StatsGrid>
              </Card.Content>
            </Card>
          </SessionStats>
        )} */}
      </motion.div>
    </Layout>
  );
};

export default HomeScreen;