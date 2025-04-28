import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiShuffle, FiTrash2, FiSave, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useGameContext } from '../../context/GameContext';
import { generateId, getRandomColor, shuffleArray } from '../../utils/gameUtils';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  margin-bottom: ${props => props.theme.space.lg};
  color: ${props => props.theme.colors.text};
`;

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.xl};
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PlayerCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
`;

const PlayerColor = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const PlayerName = styled.span`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 500;
`;

const PlayerActions = styled.div`
  display: flex;
  gap: ${props => props.theme.space.sm};
`;

const AddPlayerForm = styled.form`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: ${props => props.theme.space.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.highlight};
    box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.25);
  }
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const PlayerSetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [newPlayerName, setNewPlayerName] = useState('');
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPlayerName.trim()) return;
    
    const player = {
      id: generateId(),
      name: newPlayerName.trim(),
      color: getRandomColor(),
      wins: 0,
    };
    
    dispatch({ type: 'ADD_PLAYER', player });
    setNewPlayerName('');
  };
  
  const handleRemovePlayer = (id: string) => {
    dispatch({ type: 'REMOVE_PLAYER', id });
  };
  
  const handleShufflePlayers = () => {
    const shuffledPlayers = shuffleArray([...state.players]);
    dispatch({ type: 'SET_PLAYER_ORDER', players: shuffledPlayers });
  };
  
  const handleNavigateToGameHub = () => {
    navigate('/games');
  };
  
  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <Layout>
      <Container>
        <PageTitle>Player Setup</PageTitle>
        
        <Card>
          <Card.Header>
            <Card.Title>Add Players</Card.Title>
            <Card.Subtitle>Enter player names to get started</Card.Subtitle>
          </Card.Header>
          
          <Card.Content>
            <AddPlayerForm onSubmit={handleAddPlayer}>
              <Input
                type="text"
                placeholder="Enter player name"
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
                autoFocus
              />
              <Button 
                type="submit"
                startIcon={<FiPlus />}
              >
                Add Player
              </Button>
            </AddPlayerForm>
            
            <PlayerGrid as={motion.div} variants={containerAnimation} initial="hidden" animate="show">
              {state.players.map(player => (
                <PlayerCard key={player.id} variants={itemAnimation}>
                  <PlayerInfo>
                    <PlayerColor color={player.color} />
                    <PlayerName>{player.name}</PlayerName>
                  </PlayerInfo>
                  <PlayerActions>
                    <Button 
                      variant="text" 
                      size="small"
                      onClick={() => handleRemovePlayer(player.id)}
                      startIcon={<FiTrash2 />}
                    >
                      Remove
                    </Button>
                  </PlayerActions>
                </PlayerCard>
              ))}
            </PlayerGrid>
          </Card.Content>
          
          <Card.Footer>
            <ButtonBar>
              <ActionButtons>
                <Button
                  variant="outline"
                  onClick={handleShufflePlayers}
                  startIcon={<FiShuffle />}
                  disabled={state.players.length < 2}
                >
                  Randomize Order
                </Button>
              </ActionButtons>
              
              <Button 
                onClick={handleNavigateToGameHub}
                startIcon={<FiArrowRight />}
                disabled={state.players.length < 1}
              >
                Continue to Games
              </Button>
            </ButtonBar>
          </Card.Footer>
        </Card>
      </Container>
    </Layout>
  );
};

export default PlayerSetupScreen;