import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useGameContext } from '../../context/GameContext';
import { GameType, GameOptions, KillerOptions } from '../../context/GameContext';
import { GameTypeSelector } from './GameTypeSelector';
import { X01Settings } from './X01Settings';
import { KillerSettings } from './KillerSettings';
import { OtherGamesSettings } from './OtherGamesSettings';
import { PlayerListSection } from './PlayerListSection';

type GameCategory = 'x01' | 'killer' | 'other';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const ScrollableContent = styled.div`
  /* Removed overflow and max-height to prevent double scrollbar */
  padding-right: ${props => props.theme.space.xs};
`;

const StartGameButton = styled(Button)`
  width: 100%;
  padding: ${props => props.theme.space.md};
  font-size: ${props => props.theme.fontSizes.lg};
  margin-top: ${props => props.theme.space.md};
  font-weight: bold;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.sm};
    font-size: ${props => props.theme.fontSizes.md};
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
  const [donkeyFinishLine, setDonkeyFinishLine] = useState<number>(10);
  const [donkeyFinishLineMode, setDonkeyFinishLineMode] = useState<'10' | '15' | 'custom'>('10');
  const [donkeyCustomFinish, setDonkeyCustomFinish] = useState<string>('12');
  const [gameCategory, setGameCategory] = useState<GameCategory>('x01');
  
  // Update game type when category changes
  const handleCategoryChange = (category: GameCategory) => {
    setGameCategory(category);
    // Automatically set the game type based on category
    if (category === 'killer') {
      setSelectedGameType('killer');
    } else if (category === 'x01') {
      setSelectedGameType('501'); // Default X01 game
    } else if (category === 'other') {
      setSelectedGameType('shanghai'); // Default other game
    }
  };
  
  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
    
    let startingScore: number;
    switch (gameType) {
      case "301": startingScore = 301; break;
      case "701": startingScore = 701; break;
      case "custom": startingScore = parseInt(customScore) || 170; break;
      default: startingScore = 501;
    }
    
    setGameOptions(prev => ({ ...prev, startingScore }));
  };
  
  const handleCustomScoreChange = (value: string) => {
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
  
  const handleSharedValueChange = (value: number) => {
    setSharedLegsSetValue(value);
    setGameOptions(prev => ({
      ...prev,
      legs: value,
      sets: value
    }));
  };
  
  const handleLivesOption = (lives: number) => {
    setKillerOptions(prev => ({
      ...prev,
      maxHits: lives
    }));
  };
  
  const handleStartGame = () => {
    const finalGameOptions = {
      ...gameOptions,
      legs: activeInput === 'legs' ? sharedLegsSetValue : 1,
      sets: activeInput === 'sets' ? sharedLegsSetValue : 1
    };
    
    if (gameCategory === 'killer' && state.players.length < 2) {
      alert('Killer game requires at least 2 players to start!');
      return;
    }
    
    dispatch({
      type: 'START_GAME',
      gameType: selectedGameType,
      gameOptions: finalGameOptions,
      killerOptions,
      donkeyDerbyOptions: selectedGameType === 'donkey_derby' ? { finishLine: donkeyFinishLine } : undefined
    });
    
    if (selectedGameType === 'donkey_derby') {
      navigate('/games/donkey-derby');
    } else if (gameCategory === 'x01') {
      navigate("/games/X01");
    } else if (gameCategory === 'killer') {
      navigate("/games/killer");
    } else if (selectedGameType === 'shanghai') {
      navigate("/games/shanghai");
    } else {
      navigate("/games");
    }
  };
  
  const handleAddMorePlayers = () => {
    navigate('/players');
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <Layout>
      <Container>        
        <motion.div variants={itemAnimation} initial="hidden" animate="show">
          <Card>
            <Card.Header>
              <Card.Title>Game Settings</Card.Title>
              <Card.Subtitle>Configure your game</Card.Subtitle>
            </Card.Header>
            
            <Card.Content>
              <GameTypeSelector
                activeCategory={gameCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              <ScrollableContent>
                {gameCategory === 'x01' && (
                  <X01Settings
                    selectedGameType={selectedGameType}
                    gameOptions={gameOptions}
                    customScore={customScore}
                    sharedLegsSetValue={sharedLegsSetValue}
                    activeInput={activeInput}
                    checkoutRate={checkoutRate}
                    twoLegsDifference={twoLegsDifference}
                    onGameTypeSelect={handleGameTypeSelect}
                    onCustomScoreChange={handleCustomScoreChange}
                    onSharedValueChange={handleSharedValueChange}
                    onSelectOption={handleSelectOption}
                    onSwitchActiveInput={setActiveInput}
                    onCheckoutRateToggle={() => setCheckoutRate(!checkoutRate)}
                    onTwoLegsDifferenceToggle={() => setTwoLegsDifference(!twoLegsDifference)}
                  />
                )}
                
                {gameCategory === 'killer' && (
                  <KillerSettings
                    selectedGameType={selectedGameType}
                    killerOptions={killerOptions}
                    onGameTypeSelect={handleGameTypeSelect}
                    onLivesOptionChange={handleLivesOption}
                  />
                )}
                
                {gameCategory === 'other' && (
                  <OtherGamesSettings
                    selectedGameType={selectedGameType}
                    donkeyFinishLineMode={donkeyFinishLineMode}
                    donkeyCustomFinish={donkeyCustomFinish}
                    onGameTypeSelect={handleGameTypeSelect}
                    onDonkeyFinishLineModeChange={(mode, value) => {
                      setDonkeyFinishLineMode(mode);
                      setDonkeyFinishLine(value);
                    }}
                    onDonkeyCustomFinishChange={(val, numValue) => {
                      setDonkeyCustomFinish(val);
                      setDonkeyFinishLine(numValue);
                    }}
                  />
                )}
                
                <PlayerListSection
                  players={state.players}
                  onEditPlayers={handleAddMorePlayers}
                />
              </ScrollableContent>
              
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
