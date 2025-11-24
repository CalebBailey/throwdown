import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiShuffle, FiTrash2, FiArrowRight } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Card from '../shared/Card';
import Button from '../shared/Button';
import ColorPickerPopup from '../shared/ColorPickerPopup';
import { useGameContext } from '../../context/GameContext';
import { generateId, getUniquePlayerColor, shuffleArray } from '../../utils/gameUtils';

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

const PlayerCard = styled(motion.div)<{ color: string }>`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${props => props.theme.shadows.sm};
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;
  
  &:hover {
    box-shadow: 0 0 16px ${props => props.color};
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  pointer-events: none;
`;

const PlayerColor = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.color};
  transition: transform 0.2s ease-in-out;
  
  ${PlayerCard}:hover & {
    transform: scale(1.1);
  }
`;

const PlayerName = styled.span`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 500;
`;

const PlayerActions = styled.div`
  display: flex;
  gap: ${props => props.theme.space.sm};
  pointer-events: auto;
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
  const [colorPickerState, setColorPickerState] = useState<{
    isOpen: boolean;
    playerId: string | null;
    currentColor: string;
    position: { top: number; left: number } | null;
  }>({
    isOpen: false,
    playerId: null,
    currentColor: '',
    position: null,
  });
  const colorCircleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPlayerName.trim()) return;
    
    const player = {
      id: generateId(),
      name: newPlayerName.trim(),
      color: getUniquePlayerColor(state.players),
      wins: 0,
      lastScore: 0,
      legs: 0,
      sets: 0,
      threeDartAverage: 0,
      first9Average: 0,
      checkoutRate: 0,
      checkoutsCompleted: 0,
      checkoutAttempts: 0,
      highestFinish: 0,
      bestLeg: 0,
      worstLeg: 0,
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
  
  const handleColorClick = (playerId: string, color: string) => {
    // Find the color circle element to position the popup correctly
    const colorCircle = colorCircleRefs.current[playerId];
    
    if (!colorCircle) return;
    
    const rect = colorCircle.getBoundingClientRect();
    // Position at the center of the color circle
    const position = {
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
    };
    
    setColorPickerState({
      isOpen: true,
      playerId,
      currentColor: color,
      position,
    });
  };
  
  const handleColorChange = (newColor: string) => {
    if (colorPickerState.playerId) {
      dispatch({ 
        type: 'UPDATE_PLAYER_COLOR', 
        id: colorPickerState.playerId, 
        color: newColor 
      });
      setColorPickerState(prev => ({ ...prev, currentColor: newColor }));
    }
  };
  
  const handleCloseColorPicker = () => {
    setColorPickerState({
      isOpen: false,
      playerId: null,
      currentColor: '',
      position: null,
    });
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
                <PlayerCard 
                  key={player.id} 
                  variants={itemAnimation}
                  color={player.color}
                  onClick={() => handleColorClick(player.id, player.color)}
                  title="Click to change color"
                >
                  <PlayerInfo>
                    <PlayerColor 
                      color={player.color}
                      ref={(el) => {
                        if (el) colorCircleRefs.current[player.id] = el;
                      }}
                    />
                    <PlayerName>{player.name}</PlayerName>
                  </PlayerInfo>
                  <PlayerActions>
                    <Button 
                      variant="text" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePlayer(player.id);
                      }}
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
      
      <ColorPickerPopup
        isOpen={colorPickerState.isOpen}
        currentColor={colorPickerState.currentColor}
        onColorChange={handleColorChange}
        onClose={handleCloseColorPicker}
        anchorPosition={colorPickerState.position}
      />
    </Layout>
  );
};

export default PlayerSetupScreen;