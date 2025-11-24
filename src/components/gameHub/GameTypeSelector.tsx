import React from 'react';
import styled from 'styled-components';
import { FiTarget, FiZap, FiTrendingUp } from 'react-icons/fi';

type GameCategory = 'x01' | 'killer' | 'other';

interface GameTypeSelectorProps {
  activeCategory: GameCategory;
  onCategoryChange: (category: GameCategory) => void;
}

const GameTypeTabs = styled.div`
  display: flex;
  gap: ${props => props.theme.space.xs};
  margin-bottom: ${props => props.theme.space.md};
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: ${props => props.theme.space.sm};
  }
`;

const GameTypeTab = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? props.theme.colors.highlight : 'transparent'};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  cursor: pointer;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  flex: 1;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => !props.$active && 'rgba(255, 255, 255, 0.05)'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.sm} ${props => props.theme.space.xs};
    gap: ${props => props.theme.space.xs};
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

const TabText = styled.span`
  @media (max-width: 360px) {
    display: none;
  }
`;

export const GameTypeSelector: React.FC<GameTypeSelectorProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <GameTypeTabs>
      <GameTypeTab 
        $active={activeCategory === 'x01'} 
        onClick={() => onCategoryChange('x01')}
      >
        <FiTarget />
        <TabText>X01 Games</TabText>
      </GameTypeTab>
      <GameTypeTab 
        $active={activeCategory === 'killer'} 
        onClick={() => onCategoryChange('killer')}
      >
        <FiZap />
        <TabText>Killer</TabText>
      </GameTypeTab>
      <GameTypeTab 
        $active={activeCategory === 'other'} 
        onClick={() => onCategoryChange('other')}
      >
        <FiTrendingUp />
        <TabText>Other Games</TabText>
      </GameTypeTab>
    </GameTypeTabs>
  );
};
