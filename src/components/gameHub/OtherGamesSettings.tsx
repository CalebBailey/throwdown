import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSettings, FiTrendingUp, FiTarget } from 'react-icons/fi';
import { GameType } from '../../context/GameContext';

interface OtherGamesSettingsProps {
  selectedGameType: GameType;
  donkeyFinishLineMode: '10' | '15' | 'custom';
  donkeyCustomFinish: string;
  onGameTypeSelect: (gameType: GameType) => void;
  onDonkeyFinishLineModeChange: (mode: '10' | '15' | 'custom', value: number) => void;
  onDonkeyCustomFinishChange: (value: string, numValue: number) => void;
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

const GameSelectionArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.space.sm};
    margin-bottom: ${props => props.theme.space.md};
  }
`;

const GameCard = styled(motion.div)<{ $active: boolean }>`
  background-color: ${props => props.$active ? 'rgba(233, 69, 96, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.$active ? props.theme.colours.highlight : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? 'rgba(233, 69, 96, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
    border-color: ${props => props.$active ? props.theme.colours.highlight : 'rgba(255, 255, 255, 0.2)'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.sm};
  }
`;

const GameIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.space.sm};
  color: ${props => props.theme.colours.highlight};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
    margin-bottom: ${props => props.theme.space.xs};
  }
`;

const GameTitle = styled.h3`
  margin: 0 0 ${props => props.theme.space.xs};
  font-size: ${props => props.theme.fontSizes.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.md};
  }
`;

const GameDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  opacity: 0.7;
  margin: 0;
  line-height: 1.5;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xs};
  }
`;

const DonkeySettingsContainer = styled.div`
  margin-top: ${props => props.theme.space.md};
`;

const GameModeRow4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.space.xs};
  }
`;

const GameOptionButton = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? props.theme.colours.highlight : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.theme.colours.text};
  padding: ${props => props.theme.space.sm};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  
  &:hover {
    background-color: ${props => !props.$active && 'rgba(255, 255, 255, 0.1)'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.xs};
    font-size: ${props => props.theme.fontSizes.xs};
    min-height: 40px;
  }
`;

const CustomScoreInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: ${props => props.theme.space.xs};

  input {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: ${props => props.theme.borderRadius.sm};
    color: ${props => props.theme.colours.text};
    font-size: ${props => props.theme.fontSizes.sm};
    padding: ${props => props.theme.space.xs};
    width: 70px;
    text-align: center;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colours.highlight};
    }
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      width: 100%;
      max-width: 80px;
      font-size: ${props => props.theme.fontSizes.xs};
    }
  }
`;

const InfoText = styled.p`
  font-size: ${props => props.theme.fontSizes.xs};
  opacity: 0.6;
  margin: 0;
  text-align: center;
  
  strong {
    color: ${props => props.theme.colours.highlight};
  }
`;

export const OtherGamesSettings: React.FC<OtherGamesSettingsProps> = ({
  selectedGameType,
  donkeyFinishLineMode,
  donkeyCustomFinish,
  onGameTypeSelect,
  onDonkeyFinishLineModeChange,
  onDonkeyCustomFinishChange
}) => {
  return (
    <>
      <SettingsLabel>
        <FiSettings /> PARTY GAMES
      </SettingsLabel>
      
      <GameSelectionArea>
        <GameCard 
          $active={selectedGameType === "shanghai"}
          onClick={() => onGameTypeSelect("shanghai")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <GameIcon>
            <FiTrendingUp />
          </GameIcon>
          <GameTitle>Shanghai</GameTitle>
          <GameDescription>
            Progress through segments 1-9, scoring points for each hit. 
            Players aim for the highest score across all segments.
          </GameDescription>
        </GameCard>
        
        <GameCard 
          $active={selectedGameType === "donkey_derby"}
          onClick={() => onGameTypeSelect("donkey_derby")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <GameIcon>
            <FiTarget />
          </GameIcon>
          <GameTitle>Donkey Derby</GameTitle>
          <GameDescription>
            Race-style game where players aim to hit their assigned segments to score points. 
            First to reach the finish line wins!
          </GameDescription>
        </GameCard>
      </GameSelectionArea>

      {selectedGameType === 'donkey_derby' && (
        <DonkeySettingsContainer>
          <SettingsLabel>
            DONKEY DERBY SETTINGS
          </SettingsLabel>
          <GameModeRow4>
            <GameOptionButton
              $active={donkeyFinishLineMode === '10'}
              onClick={() => onDonkeyFinishLineModeChange('10', 10)}
            >
              FINISH 10
            </GameOptionButton>
            <GameOptionButton
              $active={donkeyFinishLineMode === '15'}
              onClick={() => onDonkeyFinishLineModeChange('15', 15)}
            >
              FINISH 15
            </GameOptionButton>
            <GameOptionButton
              $active={donkeyFinishLineMode === 'custom'}
              onClick={() => {
                const val = parseInt(donkeyCustomFinish) || 12;
                onDonkeyFinishLineModeChange('custom', val);
              }}
            >
              CUSTOM
              {donkeyFinishLineMode === 'custom' && (
                <CustomScoreInput>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={donkeyCustomFinish}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = parseInt(val) || 2;
                      const clamped = Math.min(50, Math.max(2, num));
                      onDonkeyCustomFinishChange(val, clamped);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </CustomScoreInput>
              )}
            </GameOptionButton>
            <GameOptionButton $active={false} onClick={() => {}}>
              <span className="small-text">
                DISPLAY UP TO 20
              </span>
            </GameOptionButton>
          </GameModeRow4>
          <InfoText>
            Finish line set to <strong>{
              donkeyFinishLineMode === '10' ? 10 : 
              donkeyFinishLineMode === '15' ? 15 : 
              parseInt(donkeyCustomFinish) || 12
            }</strong>. 
            Track displays first 20 positions if larger.
          </InfoText>
        </DonkeySettingsContainer>
      )}
    </>
  );
};
