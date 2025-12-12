import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';
import logo from '../../assets/images/ThrowDownLogoNoBkgd.png';

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${props => props.theme.space.xxl} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.xl} 0;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    padding: ${props => props.theme.space.lg} 0;
  }
`;

const AppLogo = styled(motion.div)`
  font-family: ${props => props.theme.fonts.headings};
  font-weight: 800;
  font-size: ${props => props.theme.fontSizes.huge};
  color: ${props => props.theme.colours.highlight};
  margin-bottom: ${props => props.theme.space.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xxxl};
    margin-bottom: ${props => props.theme.space.md};
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    font-size: ${props => props.theme.fontSizes.xxl};
    margin-bottom: ${props => props.theme.space.sm};
  }
`;

const LogoIcon = styled.div`
  font-size: 1.2em;
`;

const Logo = styled(motion.img)`
  width: 300px;
  height: auto;
  margin-right: ${props => props.theme.space.sm};
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 150px;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    width: 120px;
  }
`;

const Tagline = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.space.xl};
  max-width: 600px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.lg};
    margin-bottom: ${props => props.theme.space.lg};
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    font-size: ${props => props.theme.fontSizes.md};
    margin-bottom: ${props => props.theme.space.md};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    gap: ${props => props.theme.space.sm};
    margin-top: ${props => props.theme.space.md};
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    gap: ${props => props.theme.space.sm};
    margin-top: ${props => props.theme.space.sm};
  }
`;

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddPlayers = () => {
    navigate('/players');
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
            src={logo}
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
          <motion.div variants={itemVariants} className="full-width-centered">
            <ButtonGroup>
              <Button 
                size="large" 
                onClick={handleAddPlayers}
                startIcon={<FiUsers />}
              >
                Add Players
              </Button>
            </ButtonGroup>
          </motion.div>
        </HeroSection>
      </motion.div>
    </Layout>
  );
};

export default HomeScreen;