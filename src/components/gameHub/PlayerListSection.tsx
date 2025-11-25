import React from 'react';
import styled from 'styled-components';
import { FiUsers } from 'react-icons/fi';
import Button from '../shared/Button';
import { Player } from '../../context/GameContext';

interface PlayerListSectionProps {
  players: Player[];
  onEditPlayers: () => void;
}

const PlayerListContainer = styled.div`
  margin-top: ${props => props.theme.space.md};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.space.sm};
  
  h3 {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.space.xs};
    margin: 0;
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

const PlayerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.sm};
`;

const PlayerChip = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.xs};
  padding: ${props => props.theme.space.xs} ${props => props.theme.space.sm};
  background-color: rgba(255, 255, 255, 0.05);
  border-left: 3px solid ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xs};
    padding: ${props => props.theme.space.xs};
  }
`;

const PlayerDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.space.lg};
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: ${props => props.theme.borderRadius.md};
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.md};
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

export const PlayerListSection: React.FC<PlayerListSectionProps> = ({ 
  players, 
  onEditPlayers 
}) => {
  return (
    <PlayerListContainer>
      <SectionHeader>
        <h3>
          <FiUsers />
          Players ({players.length})
        </h3>
      </SectionHeader>
      
      {players.length > 0 ? (
        <PlayerGrid>
          {players.map((player, index) => (
            <PlayerChip key={player.id} color={player.colour}>
              <PlayerDot color={player.colour} />
              <span>{index + 1}. {player.name}</span>
            </PlayerChip>
          ))}
        </PlayerGrid>
      ) : (
        <EmptyState>
          No players added yet. Add players to start a game.
        </EmptyState>
      )}
      
      <Button 
        variant="outline" 
        size="small"
        onClick={onEditPlayers}
        fullWidth
      >
        {players.length === 0 ? 'Add Players' : 'Edit Players'}
      </Button>
    </PlayerListContainer>
  );
};
