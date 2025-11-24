import React from 'react';
import styled from 'styled-components';
import { FiSettings, FiZap } from 'react-icons/fi';
import { GameType, KillerOptions } from '../../context/GameContext';

interface KillerSettingsProps {
  selectedGameType: GameType;
  killerOptions: KillerOptions;
  onGameTypeSelect: (gameType: GameType) => void;
  onLivesOptionChange: (lives: number) => void;
}

const SettingsLabel = styled.h2`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.md};
  color: ${props => props.theme.colours.text};
  font-size: ${props => props.theme.fontSizes.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.md};
    margin-bottom: ${props => props.theme.space.sm};
  }
`;

const LivesSetting = styled.div<{ $active: boolean }>`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.sm};
  }
`;

const GameIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.space.sm};
  color: ${props => props.theme.colours.highlight};
  display: flex;
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
    margin-bottom: ${props => props.theme.space.xs};
  }
`;

const GameTitle = styled.h3`
  margin: 0 0 ${props => props.theme.space.sm};
  text-align: center;
`;

const GameDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  opacity: 0.7;
  margin: 0 0 ${props => props.theme.space.md};
  text-align: center;
  line-height: 1.5;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xs};
  }
`;

const LivesSubheading = styled.h4`
  margin: ${props => props.theme.space.md} 0 ${props => props.theme.space.sm};
  text-align: center;
  font-size: ${props => props.theme.fontSizes.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.sm};
    margin: ${props => props.theme.space.sm} 0;
  }
`;

const LivesOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: ${props => props.theme.space.xs};
  }
`;

const LivesOption = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? props.theme.colours.highlight : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme.colours.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  min-width: 48px;
  min-height: 44px;
  cursor: pointer;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  font-size: ${props => props.theme.fontSizes.md};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => !props.$active && 'rgba(255, 255, 255, 0.15)'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.xs} ${props => props.theme.space.sm};
    min-width: 40px;
    min-height: 40px;
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

export const KillerSettings: React.FC<KillerSettingsProps> = ({
  selectedGameType,
  killerOptions,
  onGameTypeSelect,
  onLivesOptionChange
}) => {
  return (
    <>
      <SettingsLabel>
        <FiSettings /> KILLER GAME SETTINGS
      </SettingsLabel>
      
      <LivesSetting 
        $active={selectedGameType === "killer"} 
        onClick={() => onGameTypeSelect("killer")}
      >
        <GameIcon>
          <FiZap />
        </GameIcon>
        <GameTitle>Killer</GameTitle>
        <GameDescription>
          Each player tries to hit their assigned segment to become a "killer". 
          Once a killer, you can target other players' segments to eliminate them. 
          Last player standing wins!
        </GameDescription>
        
        <LivesSubheading>Number of Hits to Become Killer</LivesSubheading>
        <LivesOptions>
          {[3, 5, 7].map(lives => (
            <LivesOption 
              key={lives} 
              $active={killerOptions.maxHits === lives} 
              onClick={(e) => {
                e.stopPropagation();
                onLivesOptionChange(lives);
              }}
            >
              {lives}
            </LivesOption>
          ))}
        </LivesOptions>
      </LivesSetting>
    </>
  );
};
