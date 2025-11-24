import React from 'react';
import styled from 'styled-components';
import { FiSettings } from 'react-icons/fi';
import { GameType, GameOptions } from '../../context/GameContext';

interface X01SettingsProps {
  selectedGameType: GameType;
  gameOptions: GameOptions;
  customScore: string;
  sharedLegsSetValue: number;
  activeInput: 'legs' | 'sets';
  checkoutRate: boolean;
  twoLegsDifference: boolean;
  onGameTypeSelect: (gameType: GameType) => void;
  onCustomScoreChange: (value: string) => void;
  onSharedValueChange: (value: number) => void;
  onSelectOption: <K extends keyof GameOptions>(option: K, value: GameOptions[K]) => void;
  onSwitchActiveInput: (input: 'legs' | 'sets') => void;
  onCheckoutRateToggle: () => void;
  onTwoLegsDifferenceToggle: () => void;
}

const SettingsLabel = styled.h2`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.md};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.md};
    margin-bottom: ${props => props.theme.space.sm};
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: ${props => props.theme.space.xs};
  }
`;

const GameModeRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "bestof firstto input"
      "legs legs sets";
    
    & > button:nth-child(1) { grid-area: bestof; }
    & > button:nth-child(2) { grid-area: firstto; }
    & > input:nth-child(3) { grid-area: input; }
    & > button:nth-child(4) { grid-area: legs; }
    & > button:nth-child(5) { grid-area: sets; }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "bestof firstto"
      "input input"
      "legs sets";
    gap: ${props => props.theme.space.xs};
  }
`;

const GameModeRow4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.space.xs};
  }
`;

const GameModeRow3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.space.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.space.xs};
  }
`;

const GameOptionButton = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? props.theme.colors.highlight : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.theme.colors.text};
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

const NumberInput = styled.input`
  background-color: ${props => props.theme.colors.highlight};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: bold;
  text-align: center;
  width: 100%;
  padding: ${props => props.theme.space.sm};
  min-height: 44px;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.lightHighlight};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.sm};
    padding: ${props => props.theme.space.xs};
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
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes.sm};
    padding: ${props => props.theme.space.xs};
    width: 80px;
    text-align: center;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.highlight};
    }
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      width: 100%;
      max-width: 100px;
      font-size: ${props => props.theme.fontSizes.xs};
    }
  }
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.space.xs} 0;
  
  span {
    font-size: ${props => props.theme.fontSizes.sm};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xs};
  }
`;

const ToggleSwitch = styled.div<{ $on: boolean }>`
  width: 48px;
  height: 24px;
  background-color: ${props => props.$on ? props.theme.colors.highlight : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  
  &:after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.$on ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 50%;
    transition: left 0.2s ease;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 40px;
    height: 20px;
    
    &:after {
      width: 16px;
      height: 16px;
      left: ${props => props.$on ? '22px' : '2px'};
    }
  }
`;

export const X01Settings: React.FC<X01SettingsProps> = ({
  selectedGameType,
  gameOptions,
  customScore,
  sharedLegsSetValue,
  activeInput,
  checkoutRate,
  twoLegsDifference,
  onGameTypeSelect,
  onCustomScoreChange,
  onSharedValueChange,
  onSelectOption,
  onSwitchActiveInput,
  onCheckoutRateToggle,
  onTwoLegsDifferenceToggle
}) => {
  return (
    <>
      <SettingsLabel>
        <FiSettings /> GAME SETTINGS
      </SettingsLabel>
      
      <SettingsGrid>
        {/* Format row */}
        <GameModeRow>
          <GameOptionButton
            $active={gameOptions.format === 'bestOf'}
            onClick={() => onSelectOption('format', 'bestOf')}
          >
            BEST OF
          </GameOptionButton>
          <GameOptionButton
            $active={gameOptions.format === 'firstTo'}
            onClick={() => onSelectOption('format', 'firstTo')}
          >
            FIRST TO
          </GameOptionButton>
          <NumberInput
            type="number"
            min="1"
            max="20"
            value={sharedLegsSetValue}
            onChange={(e) => onSharedValueChange(parseInt(e.target.value) || 1)}
          />
          <GameOptionButton
            $active={activeInput === 'legs'}
            onClick={() => onSwitchActiveInput('legs')}
          >
            LEGS
          </GameOptionButton>
          <GameOptionButton
            $active={activeInput === 'sets'}
            onClick={() => onSwitchActiveInput('sets')}
          >
            SETS
          </GameOptionButton>
        </GameModeRow>

        {/* Game type row */}
        <GameModeRow4>
          <GameOptionButton
            $active={selectedGameType === "301"}
            onClick={() => onGameTypeSelect("301")}
          >
            301
          </GameOptionButton>
          <GameOptionButton
            $active={selectedGameType === "501"}
            onClick={() => onGameTypeSelect("501")}
          >
            501
          </GameOptionButton>
          <GameOptionButton
            $active={selectedGameType === "701"}
            onClick={() => onGameTypeSelect("701")}
          >
            701
          </GameOptionButton>
          <GameOptionButton
            $active={selectedGameType === "custom"}
            onClick={() => onGameTypeSelect("custom")}
          >
            CUSTOM
            {selectedGameType === "custom" && (
              <CustomScoreInput>
                <input
                  type="number"
                  value={customScore}
                  onChange={(e) => onCustomScoreChange(e.target.value)}
                  min="1"
                  max="999"
                  onClick={(e) => e.stopPropagation()}
                />
              </CustomScoreInput>
            )}
          </GameOptionButton>
        </GameModeRow4>
        
        {/* Entry options row */}
        <GameModeRow3>
          <GameOptionButton
            $active={gameOptions.entryMode === 'straight'}
            onClick={() => onSelectOption('entryMode', 'straight')}
          >
            STRAIGHT IN
          </GameOptionButton>
          <GameOptionButton
            $active={gameOptions.entryMode === 'double'}
            onClick={() => onSelectOption('entryMode', 'double')}
          >
            DOUBLE IN
          </GameOptionButton>
          <GameOptionButton
            $active={gameOptions.entryMode === 'master'}
            onClick={() => onSelectOption('entryMode', 'master')}
          >
            MASTER IN
          </GameOptionButton>
        </GameModeRow3>
        
        {/* Out options row */}
        <GameModeRow3>
          <GameOptionButton
            $active={gameOptions.outMode === 'double'}
            onClick={() => onSelectOption('outMode', 'double')}
          >
            DOUBLE OUT
          </GameOptionButton>
          <GameOptionButton
            $active={gameOptions.outMode === 'master'}
            onClick={() => onSelectOption('outMode', 'master')}
          >
            MASTER OUT
          </GameOptionButton>
          <GameOptionButton
            $active={gameOptions.outMode === 'straight'}
            onClick={() => onSelectOption('outMode', 'straight')}
          >
            STRAIGHT OUT
          </GameOptionButton>
        </GameModeRow3>
      </SettingsGrid>
      
      {/* Toggle switches */}
      <div>
        <ToggleRow>
          <span>Checkout rate</span>
          <ToggleSwitch 
            $on={checkoutRate} 
            onClick={onCheckoutRateToggle} 
          />
        </ToggleRow>
        <ToggleRow>
          <span>Two legs difference</span>
          <ToggleSwitch 
            $on={twoLegsDifference} 
            onClick={onTwoLegsDifferenceToggle} 
          />
        </ToggleRow>
      </div>
    </>
  );
};
