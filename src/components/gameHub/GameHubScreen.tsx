import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSettings, FiPlay, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useGameContext } from '../../context/GameContext';
import { GameType, GameOptions, KillerOptions } from '../../context/GameContext';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  margin-bottom: ${props => props.theme.space.lg};
  color: ${props => props.theme.colors.text};
`;

const PlayerList = styled.div`
  margin-top: ${props => props.theme.space.lg};
  margin-bottom: ${props => props.theme.space.lg};
`;

const PlayerRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  padding: ${props => props.theme.space.sm} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const PlayerDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const NumberInput = styled.input`
  background-color: #E94560;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.highlight};
  }
`;

const SettingsLabel = styled.h2`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.md};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.lg};
`;

const GameModeRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.md};
`;

const GameModeRow4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.md};
`;

const GameModeRow3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.space.sm};
  margin-bottom: ${props => props.theme.space.md};
`;

const GameOptionButton = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? props.theme.colors.highlight : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.space.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => !props.$active && 'rgba(255, 255, 255, 0.2)'};
  }
`;

const CustomScoreInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: ${props => props.theme.borderRadius.sm};
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes.md};
    padding: ${props => props.theme.space.xs} ${props => props.theme.space.sm};
    width: 80px;
    text-align: center;
    margin-top: ${props => props.theme.space.xs};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.highlight};
    }
  }

  span {
    font-size: ${props => props.theme.fontSizes.sm};
    opacity: 0.7;
    margin-bottom: ${props => props.theme.space.xs};
  }
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.space.sm} 0;
`;

const ToggleSwitch = styled.div<{ $on: boolean }>`
  width: 50px;
  height: 24px;
  background-color: ${props => props.$on ? props.theme.colors.highlight : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
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
`;

const StartGameButton = styled(Button)`
  width: 100%;
  padding: ${props => props.theme.space.md};
  font-size: ${props => props.theme.fontSizes.lg};
  margin-top: ${props => props.theme.space.md};
`;

// New Game Type Tab Component
const GameTypeTabs = styled.div`
  display: flex;
  gap: 1px;
  margin-bottom: ${props => props.theme.space.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const GameTypeTab = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? props.theme.colors.highlight : 'transparent'};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: ${props => props.theme.space.md};
  cursor: pointer;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  flex: 1;
  justify-content: center;
  
  &:hover {
    background-color: ${props => !props.$active && 'rgba(255, 255, 255, 0.05)'};
  }
`;

// Game Category
type GameCategory = 'x01' | 'killer' | 'other';

// New Game Card Component
const GameSelectionArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.space.md};
  margin-bottom: ${props => props.theme.space.lg};
`;

const GameCard = styled(motion.div)<{ $active: boolean }>`
  background-color: ${props => props.$active ? props.theme.colors.highlight : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
`;


const LivesSetting = styled(motion.div)<{ $active: boolean }>`
  background-color: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
`;

const GameIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.space.sm};
`;

const GameTitle = styled.h3`
  margin: 0;
  margin-bottom: ${props => props.theme.space.xs};
`;

const GameDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  opacity: 0.7;
  margin: 0;
`;

// Lives options for Killer game
const LivesOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.space.sm};
  margin-top: ${props => props.theme.space.md};
`;

const LivesOption = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? props.theme.colors.highlight : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.space.sm};
  min-width: 40px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => !props.$active && 'rgba(255, 255, 255, 0.2)'};
  }
`;

const GameHubScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [selectedGameType, setSelectedGameType] = useState<GameType>("501");
  const [customScore, setCustomScore] = useState<string>("170");
  const [sharedLegsSetValue, setSharedLegsSetValue] = useState<number>(5);
  const [gameOptions, setGameOptions] = useState<GameOptions>({
    startingScore: 501,
    entryMode: 'straight',
    outMode: 'double',
    format: 'bestOf',
    legs: 5,
    sets: 5,
  });
  const [killerOptions, setKillerOptions] = useState<KillerOptions>({
    maxHits: 3
  });
  const [checkoutRate, setCheckoutRate] = useState<boolean>(true);
  const [twoLegsDifference, setTwoLegsDifference] = useState<boolean>(false);
  const [activeInput, setActiveInput] = useState<'legs' | 'sets'>('legs');
  
  // New state for game category tabs
  const [gameCategory, setGameCategory] = useState<GameCategory>('x01');
  
  // Add handler to safely switch active input without resetting values
  const handleSwitchActiveInput = (input: 'legs' | 'sets') => {
    setActiveInput(input);
  };
  
  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
    
    // Update starting score based on game type
    let startingScore: number;
    switch (gameType) {
      case "301":
        startingScore = 301;
        break;
      case "701":
        startingScore = 701;
        break;
      case "custom":
        startingScore = parseInt(customScore) || 170;
        break;
      default:
        startingScore = 501;
    }
    
    setGameOptions(prev => ({ ...prev, startingScore }));
  };
  
  const handleCustomScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomScore(value);
    
    if (selectedGameType === "custom" && value) {
      setGameOptions(prev => ({
        ...prev,
        startingScore: parseInt(value) || 1
      }));
    }
  };
  
  const handleSelectOption = <K extends keyof GameOptions>(option: K, value: GameOptions[K]) => {
    setGameOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  const handleLivesOption = (lives: number) => {
    setKillerOptions(prev => ({
      ...prev,
      maxHits: lives // Use maxHits instead of lives
    }));
  };
  
  const handleStartGame = () => {
    // Apply the shared value based on which tab is active
    const finalGameOptions = {
      ...gameOptions,
      // Only use the active option's value
      legs: activeInput === 'legs' ? sharedLegsSetValue : 1,
      sets: activeInput === 'sets' ? sharedLegsSetValue : 1
    };
    
    // Validate player count for Killer game
    if (gameCategory === 'killer' && state.players.length < 2) {
      alert('Killer game requires at least 2 players to start!');
      return;
    }
    
    // Start the game with selected options
    dispatch({
      type: 'START_GAME',
      gameType: selectedGameType,
      gameOptions: finalGameOptions,
      killerOptions
    });
    
    // Navigate to the appropriate game screen
    if (gameCategory === 'x01') {
      navigate("/games/X01"); // Use generic X01 route (the logic handles different starting scores)
    } else if (gameCategory === 'killer') {
      navigate("/games/killer");
    } else {
      // Handle other game types in the future
      navigate("/games/X01");
    }
  };
  
  const handleAddMorePlayers = () => {
    navigate('/players');
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
        <PageTitle>Game Hub</PageTitle>
        
        <motion.div variants={itemAnimation} initial="hidden" animate="show">
          <Card>
            <Card.Header>
              <Card.Title>Game Settings</Card.Title>
              <Card.Subtitle>Configure your game</Card.Subtitle>
            </Card.Header>
            
            <Card.Content>
              <GameTypeTabs>
                <GameTypeTab 
                  $active={gameCategory === 'x01'} 
                  onClick={() => setGameCategory('x01')}
                >
                  <FiTarget /> X01 Games
                </GameTypeTab>
                <GameTypeTab 
                  $active={gameCategory === 'killer'} 
                  onClick={() => setGameCategory('killer')}
                >
                  <FiZap /> Killer
                </GameTypeTab>
                <GameTypeTab 
                  $active={gameCategory === 'other'} 
                  onClick={() => setGameCategory('other')}
                >
                  <FiTrendingUp /> Other Games
                </GameTypeTab>
              </GameTypeTabs>
              
              {/* X01 Games Settings */}
              {gameCategory === 'x01' && (
                <>
                  <SettingsLabel>
                    <FiSettings /> GAME SETTINGS
                  </SettingsLabel>
                  
                  <SettingsGrid>
                    {/* Format row */}
                    <GameModeRow>
                      <GameOptionButton
                        $active={gameOptions.format === 'bestOf'}
                        onClick={() => handleSelectOption('format', 'bestOf')}
                      >
                        BEST OF
                      </GameOptionButton>
                      <GameOptionButton
                        $active={gameOptions.format === 'firstTo'}
                        onClick={() => handleSelectOption('format', 'firstTo')}
                      >
                        FIRST TO
                      </GameOptionButton>
                      <NumberInput
                        type="number"
                        min="1"
                        max="20"
                        value={sharedLegsSetValue}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setSharedLegsSetValue(value);
                          // Update both legs and sets with the same value
                          setGameOptions(prev => ({
                            ...prev,
                            legs: value,
                            sets: value
                          }));
                        }}
                      />
                      <GameOptionButton
                        $active={activeInput === 'legs'}
                        onClick={() => handleSwitchActiveInput('legs')}
                      >
                        LEGS
                      </GameOptionButton>
                      <GameOptionButton
                        $active={activeInput === 'sets'}
                        onClick={() => handleSwitchActiveInput('sets')}
                      >
                        SETS
                      </GameOptionButton>
                    </GameModeRow>

                    {/* Game type row */}
                    <GameModeRow4>
                      <GameOptionButton
                        $active={selectedGameType === "301"}
                        onClick={() => handleGameTypeSelect("301")}
                      >
                        301
                      </GameOptionButton>
                      <GameOptionButton
                        $active={selectedGameType === "501"}
                        onClick={() => handleGameTypeSelect("501")}
                      >
                        501
                      </GameOptionButton>
                      <GameOptionButton
                        $active={selectedGameType === "701"}
                        onClick={() => handleGameTypeSelect("701")}
                      >
                        701
                      </GameOptionButton>
                      <GameOptionButton
                        $active={selectedGameType === "custom"}
                        onClick={() => handleGameTypeSelect("custom")}
                      >
                        CUSTOM
                        {selectedGameType === "custom" && (
                          <CustomScoreInput>
                            <input
                              type="number"
                              value={customScore}
                              onChange={handleCustomScoreChange}
                              min="1"
                              max="999"
                            />
                          </CustomScoreInput>
                        )}
                      </GameOptionButton>
                    </GameModeRow4>
                    
                    {/* Entry options row */}
                    <GameModeRow3>
                      <GameOptionButton
                        $active={gameOptions.entryMode === 'straight'}
                        onClick={() => handleSelectOption('entryMode', 'straight')}
                      >
                        STRAIGHT IN
                      </GameOptionButton>
                      <GameOptionButton
                        $active={gameOptions.entryMode === 'double'}
                        onClick={() => handleSelectOption('entryMode', 'double')}
                      >
                        DOUBLE IN
                      </GameOptionButton>
                      <GameOptionButton
                        $active={gameOptions.entryMode === 'master'}
                        onClick={() => handleSelectOption('entryMode', 'master')}
                      >
                        MASTER IN
                      </GameOptionButton>
                    </GameModeRow3>
                    
                    {/* Out options row */}
                    <GameModeRow3>
                      <GameOptionButton
                        $active={gameOptions.outMode === 'double'}
                        onClick={() => handleSelectOption('outMode', 'double')}
                      >
                        DOUBLE OUT
                      </GameOptionButton>
                      <GameOptionButton
                        $active={gameOptions.outMode === 'master'}
                        onClick={() => handleSelectOption('outMode', 'master')}
                      >
                        MASTER OUT
                      </GameOptionButton>
                      <GameOptionButton
                        $active={gameOptions.outMode === 'straight'}
                        onClick={() => handleSelectOption('outMode', 'straight')}
                      >
                        STRAIGHT OUT
                      </GameOptionButton>
                      <GameOptionButton
                        $active={false}
                        onClick={() => {}}
                        style={{ visibility: 'hidden' }}
                      >
                        HIDDEN
                      </GameOptionButton>
                    </GameModeRow3>
                  </SettingsGrid>
                  
                  {/* Toggle switches */}
                  <div>
                    <ToggleRow>
                      <span>Checkout rate</span>
                      <ToggleSwitch 
                        $on={checkoutRate} 
                        onClick={() => setCheckoutRate(!checkoutRate)} 
                      />
                    </ToggleRow>
                    <ToggleRow>
                      <span>Two legs difference</span>
                      <ToggleSwitch 
                        $on={twoLegsDifference} 
                        onClick={() => setTwoLegsDifference(!twoLegsDifference)} 
                      />
                    </ToggleRow>
                  </div>
                </>
              )}
              
              {/* Killer Game Settings */}
              {gameCategory === 'killer' && (
                <>
                  <SettingsLabel>
                    <FiSettings /> KILLER GAME SETTINGS
                  </SettingsLabel>
                  
                  <LivesSetting $active={selectedGameType === "killer"} onClick={() => setSelectedGameType("killer")}>
                    <GameIcon>
                      <FiZap />
                    </GameIcon>
                    <GameTitle>Killer</GameTitle>
                    <GameDescription>
                      Each player tries to hit their assigned segment to become a "killer". <br />Once a killer,
                      you can target other players' segments to eliminate them. Last player standing wins!
                    </GameDescription>
                    
                    <div>
                      <h4>Number of Hits to Become Killer</h4>
                      <LivesOptions>
                        {[3, 5, 7].map(lives => (
                          <LivesOption 
                            key={lives} 
                            $active={killerOptions.maxHits === lives} 
                            onClick={() => handleLivesOption(lives)}
                          >
                            {lives}
                          </LivesOption>
                        ))}
                      </LivesOptions>
                    </div>
                  </LivesSetting>
                </>
              )}
              
              {/* Other Games (Future Implementation) */}
              {gameCategory === 'other' && (
                <>
                  <SettingsLabel>
                    <FiSettings /> PARTY GAMES
                  </SettingsLabel>
                  
                  <GameSelectionArea>
                    <GameCard $active={false}>
                      <GameIcon>
                        <FiTrendingUp />
                      </GameIcon>
                      <GameTitle>Shanghai</GameTitle>
                      <GameDescription>
                        Coming soon! Sequential scoring game with special "Shanghai" combinations for instant wins.
                      </GameDescription>
                    </GameCard>
                    
                    <GameCard $active={false}>
                      <GameIcon>
                        <FiTarget />
                      </GameIcon>
                      <GameTitle>Donkey Derby</GameTitle>
                      <GameDescription>
                        Coming soon! Race-style game where players aim to hit sequential numbers from 1 to 20.
                      </GameDescription>
                    </GameCard>
                  </GameSelectionArea>
                </>
              )}
              
              <PlayerList>
                <h3>Players ({state.players.length})</h3>
                {state.players.map((player, index) => (
                  <PlayerRow key={player.id}>
                    <PlayerDot color={player.color} />
                    <span>{index + 1}. {player.name}</span>
                  </PlayerRow>
                ))}
                
                {state.players.length === 0 && (
                  <p>No players added yet. Add players to start a game.</p>
                )}
                
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={handleAddMorePlayers}
                  style={{ marginTop: '16px' }}
                >
                  {state.players.length === 0 ? 'Add Players' : 'Edit Players'}
                </Button>
              </PlayerList>
              
              <StartGameButton
                onClick={handleStartGame}
                startIcon={<FiPlay />}
                disabled={state.players.length === 0}
              >
                Start game
              </StartGameButton>
            </Card.Content>
          </Card>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default GameHubScreen;