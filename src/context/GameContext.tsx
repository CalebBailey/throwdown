import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { calculateScore, dartNotationToScore } from '../utils/gameUtils';

// Types for our game state
export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  throws: string[][]; // Changed from number[][] to string[][] for dart notations
  averageScore: number;
  highestScore: number;
  wins: number;
  legs: number;
  sets: number;
}

export type EntryMode = 'straight' | 'double' | 'master';
export type OutMode = 'straight' | 'double' | 'master';
export type FormatType = 'bestOf' | 'firstTo';

export interface GameOptions {
  startingScore: number;
  entryMode: EntryMode;
  outMode: OutMode;
  format: FormatType;
  legs: number;
  sets: number;
}

export type GameType = "501" | "301" | "701" | "custom";
export type GameStatus = "setup" | "active" | "complete";

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gameType: GameType;
  gameOptions: GameOptions;
  gameStatus: GameStatus;
  currentRound: number;
  winner: Player | null;
  sessionStats: {
    playerWins: Record<string, number>;
    gamesPlayed: number;
  };
  currentThrow: {
    darts: string[];
    isComplete: boolean;
  };
}

// Actions
export type GameAction =
  | { type: 'ADD_PLAYER'; player: Omit<Player, 'score' | 'throws' | 'averageScore' | 'highestScore'> }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'SET_PLAYER_ORDER'; players: Player[] }
  | { type: 'START_GAME'; gameType: GameType; gameOptions: GameOptions }
  | { type: 'ADD_DART'; dart: string }
  | { type: 'REMOVE_DART' }
  | { type: 'SUBMIT_THROW' }
  | { type: 'INPUT_SCORE'; playerId: string; score: number } // Keep for backward compatibility
  | { type: 'UNDO_SCORE'; playerId: string }
  | { type: 'END_TURN' }
  | { type: 'END_GAME'; winner: Player }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_SESSION_STATS' };

// Initial state
const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  gameType: "501",
  gameOptions: {
    startingScore: 501,
    entryMode: 'double',
    outMode: 'double',
    format: 'bestOf',
    legs: 1,
    sets: 1,
  },
  gameStatus: "setup",
  currentRound: 1,
  winner: null,
  sessionStats: {
    playerWins: {},
    gamesPlayed: 0,
  },
  currentThrow: {
    darts: [],
    isComplete: false
  }
};

// Load session data from localStorage if available
const loadInitialState = (): GameState => {
  const savedState = localStorage.getItem('throwdown_game_state');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      return {
        ...initialState,
        sessionStats: parsedState.sessionStats || initialState.sessionStats
      };
    } catch (error) {
      console.error('Error loading saved game state:', error);
      return initialState;
    }
  }
  return initialState;
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const { player } = action;
      const newPlayer: Player = {
        ...player,
        score: state.gameOptions.startingScore,
        throws: [],
        averageScore: 0,
        highestScore: 0,
        wins: state.sessionStats.playerWins[player.id] || 0,
        legs: 0,
        sets: 0,
      };
      return { ...state, players: [...state.players, newPlayer] };
    }
    
    case 'REMOVE_PLAYER': {
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.id)
      };
    }
    
    case 'SET_PLAYER_ORDER': {
      return { ...state, players: action.players };
    }
    
    case 'START_GAME': {
      const { gameType, gameOptions } = action;
      return {
        ...state,
        gameType,
        gameOptions,
        gameStatus: "active",
        currentRound: 1,
        currentPlayerIndex: 0,
        players: state.players.map(player => ({
          ...player,
          score: gameOptions.startingScore,
          throws: [],
          averageScore: 0,
          highestScore: 0
        })),
        winner: null,
        currentThrow: {
          darts: [],
          isComplete: false
        }
      };
    }
    
    case 'ADD_DART': {
      // Only add dart if we have less than 3 darts
      if (state.currentThrow.darts.length >= 3 || state.gameStatus !== 'active') {
        return state;
      }
      
      return {
        ...state,
        currentThrow: {
          darts: [...state.currentThrow.darts, action.dart],
          isComplete: state.currentThrow.darts.length === 2 // This will be the 3rd dart
        }
      };
    }
    
    case 'REMOVE_DART': {
      if (state.currentThrow.darts.length === 0) {
        return state;
      }
      
      const newDarts = [...state.currentThrow.darts];
      newDarts.pop();
      
      return {
        ...state,
        currentThrow: {
          darts: newDarts,
          isComplete: false
        }
      };
    }
    
    case 'SUBMIT_THROW': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer) return state;
      
      const dartsThrown = [...state.currentThrow.darts];
      const score = calculateScore(dartsThrown);
      
      // Check entry requirements
      const isFirstThrow = currentPlayer.throws.length === 0;
      
      if (isFirstThrow) {
        // Check entry mode requirements
        if (state.gameOptions.entryMode === 'double') {
          const hasDouble = dartsThrown.some(dart => dart.startsWith('D'));
          if (!hasDouble && score > 0) {
            // Entry requirement not met
            return {
              ...state,
              currentThrow: { darts: [], isComplete: false },
            };
          }
        } else if (state.gameOptions.entryMode === 'master') {
          const hasMaster = dartsThrown.some(dart => dart.startsWith('D') || dart.startsWith('T'));
          if (!hasMaster && score > 0) {
            // Entry requirement not met
            return {
              ...state,
              currentThrow: { darts: [], isComplete: false },
            };
          }
        }
      }
      
      // Calculate new score
      const newScore = currentPlayer.score - score;
      
      // Check for bust conditions based on out mode
      let isBust = newScore < 0 || newScore === 1;
      
      if (newScore === 0) {
        if (state.gameOptions.outMode === 'double' && !dartsThrown.some(dart => dart.startsWith('D'))) {
          isBust = true;
        } else if (state.gameOptions.outMode === 'master' && !dartsThrown.some(dart => dart.startsWith('D') || dart.startsWith('T'))) {
          isBust = true;
        }
      }
      
      // Clone and update the throws
      const newThrows = [...currentPlayer.throws];
      if (!newThrows[state.currentRound - 1]) {
        newThrows[state.currentRound - 1] = [];
      }
      newThrows[state.currentRound - 1] = dartsThrown;
      
      // Calculate stats
      const allThrows = newThrows.flat();
      const dartsCount = allThrows.length;
      
      // Calculate average per throw (turn) instead of per dart
      const totalTurnScores = newThrows.reduce((sum, turn) => {
        return sum + turn.reduce((turnSum, dart) => turnSum + dartNotationToScore(dart), 0);
      }, 0);
      const turnCount = newThrows.length;
      const averageScore = turnCount > 0 ? totalTurnScores / turnCount : 0;
      
      // Find the highest score in a single turn
      const highScores = newThrows.map(turnDarts => 
        turnDarts.reduce((sum, dart) => sum + dartNotationToScore(dart), 0)
      );
      const highestScore = highScores.length > 0 ? Math.max(...highScores, 0) : 0;
      
      // Update the player
      const updatedPlayer = {
        ...currentPlayer,
        throws: newThrows,
        score: isBust ? currentPlayer.score : Math.max(0, newScore),
        averageScore,
        highestScore
      };
      
      // Create new players array with updated player
      let updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
      
      // Check for winner
      if (!isBust && newScore === 0) {
        // Player has hit a checkout
        const updatedPlayer = {
          ...updatedPlayers[state.currentPlayerIndex],
          legs: updatedPlayers[state.currentPlayerIndex].legs + 1
        };
        updatedPlayers[state.currentPlayerIndex] = updatedPlayer;
        
        // For "Best of" format
        const totalLegsNeeded = Math.ceil(state.gameOptions.legs / 2);
        // For "First to" format
        const firstToLegsNeeded = state.gameOptions.legs;
        
        const legsNeeded = state.gameOptions.format === 'bestOf' ? totalLegsNeeded : firstToLegsNeeded;
        
        // Check if player has won enough legs to win a set
        if (updatedPlayer.legs >= legsNeeded) {
          // Player wins a set
          updatedPlayer.sets += 1;
          
          // Reset legs for all players for the next set
          updatedPlayers = updatedPlayers.map(player => ({
            ...player,
            legs: 0
          }));
          
          // For "Best of" format
          const totalSetsNeeded = Math.ceil(state.gameOptions.sets / 2);
          // For "First to" format
          const firstToSetsNeeded = state.gameOptions.sets;
          
          const setsNeeded = state.gameOptions.format === 'bestOf' ? totalSetsNeeded : firstToSetsNeeded;
          
          // Check if player has won enough sets to win the game
          if (state.gameOptions.sets > 1 && updatedPlayer.sets >= setsNeeded) {
            // Player wins the game
            const winningPlayer = {
              ...updatedPlayer,
              wins: updatedPlayer.wins + 1
            };
            updatedPlayers[state.currentPlayerIndex] = winningPlayer;
            
            // Update session stats
            const newPlayerWins = { ...state.sessionStats.playerWins };
            newPlayerWins[winningPlayer.id] = (newPlayerWins[winningPlayer.id] || 0) + 1;
            
            return {
              ...state,
              players: updatedPlayers,
              currentThrow: { darts: [], isComplete: false },
              gameStatus: 'complete',
              winner: winningPlayer,
              sessionStats: {
                ...state.sessionStats,
                playerWins: newPlayerWins,
                gamesPlayed: state.sessionStats.gamesPlayed + 1
              }
            };
          } else if (state.gameOptions.sets > 1) {
            // Not enough sets won yet, reset scores for next leg in the set
            updatedPlayers = updatedPlayers.map(player => ({
              ...player,
              score: state.gameOptions.startingScore,
              throws: []
            }));
            
            // Continue to next leg
            return {
              ...state,
              players: updatedPlayers,
              currentPlayerIndex: 0,
              currentThrow: { darts: [], isComplete: false },
              currentRound: 1
            };
          } else {
            // No sets in play (sets = 1), this is a direct win
            const winningPlayer = {
              ...updatedPlayer,
              wins: updatedPlayer.wins + 1
            };
            updatedPlayers[state.currentPlayerIndex] = winningPlayer;
            
            // Update session stats
            const newPlayerWins = { ...state.sessionStats.playerWins };
            newPlayerWins[winningPlayer.id] = (newPlayerWins[winningPlayer.id] || 0) + 1;
            
            return {
              ...state,
              players: updatedPlayers,
              currentThrow: { darts: [], isComplete: false },
              gameStatus: 'complete',
              winner: winningPlayer,
              sessionStats: {
                ...state.sessionStats,
                playerWins: newPlayerWins,
                gamesPlayed: state.sessionStats.gamesPlayed + 1
              }
            };
          }
        } else {
          // Player has won a leg but not enough to win a set/game
          // Reset scores for next leg
          updatedPlayers = updatedPlayers.map(player => ({
            ...player,
            score: state.gameOptions.startingScore,
            throws: []
          }));
          
          // Continue to next leg
          return {
            ...state,
            players: updatedPlayers,
            currentPlayerIndex: 0,
            currentThrow: { darts: [], isComplete: false },
            currentRound: 1
          };
        }
      }
      
      // Move to next player
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const newRound = nextPlayerIndex === 0 ? state.currentRound + 1 : state.currentRound;
      
      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentRound: newRound,
        currentThrow: { darts: [], isComplete: false }
      };
    }
    
    case 'INPUT_SCORE': {
      const { playerId, score } = action;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      
      // Simulate darts for backward compatibility
      const simulatedDarts = [`S${score}`]; // Just a simple approximation
      
      const newThrows = [...player.throws];
      if (!newThrows[state.currentRound - 1]) {
        newThrows[state.currentRound - 1] = [];
      }
      newThrows[state.currentRound - 1] = simulatedDarts;
      
      // Calculate new player score
      const newScore = player.score - score;
      
      // Check for bust (score < 0 or score = 1 or doubleOut required but impossible)
      const isBust = newScore < 0 || 
                     newScore === 1 || 
                     (state.gameOptions.outMode === 'double' && newScore === 0 && score % 2 !== 0);
      
      // Calculate stats
      const allDarts = newThrows.flat();
      const dartsCount = allDarts.length;
      
      // Calculate average per throw (turn) instead of per dart
      const totalTurnScores = newThrows.reduce((sum, turn) => {
        return sum + turn.reduce((turnSum, dart) => turnSum + dartNotationToScore(dart), 0);
      }, 0);
      const turnCount = newThrows.length;
      const averageScore = turnCount > 0 ? totalTurnScores / turnCount : 0;
      
      // Find the highest score in a single turn
      const highScores = newThrows.map(turnDarts => 
        turnDarts.reduce((sum, dart) => sum + dartNotationToScore(dart), 0)
      );
      const highestScore = highScores.length > 0 ? Math.max(...highScores, 0) : 0;
      
      // Update the player
      const updatedPlayer = {
        ...player,
        throws: newThrows,
        score: isBust ? player.score : Math.max(0, newScore),
        averageScore,
        highestScore
      };
      
      // Create new players array with updated player
      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = updatedPlayer;
      
      return { ...state, players: updatedPlayers };
    }
    
    case 'UNDO_SCORE': {
      const { playerId } = action;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      const currentRoundIndex = state.currentRound - 1;
      
      // Check if there are any throws to undo
      if (!player.throws[currentRoundIndex] || player.throws[currentRoundIndex].length === 0) {
        return state;
      }
      
      // Calculate the score from the current round's darts
      const currentRoundDarts = player.throws[currentRoundIndex];
      const scoreToAdd = currentRoundDarts.reduce((sum, dart) => sum + dartNotationToScore(dart), 0);
      
      // Clone throws array and remove the current round
      const newThrows = [...player.throws];
      newThrows[currentRoundIndex] = [];
      
      // Calculate stats
      const allDarts = newThrows.flat();
      const dartsCount = allDarts.length;
      
      // Calculate average per throw (turn) instead of per dart
      const totalTurnScores = newThrows.reduce((sum, turn) => {
        return sum + turn.reduce((turnSum, dart) => turnSum + dartNotationToScore(dart), 0);
      }, 0);
      const turnCount = newThrows.length;
      const averageScore = turnCount > 0 ? totalTurnScores / turnCount : 0;
      
      // Find the highest score in a single turn
      const highScores = newThrows.map(turnDarts => 
        turnDarts.reduce((sum, dart) => sum + dartNotationToScore(dart), 0)
      );
      const highestScore = highScores.length > 0 ? Math.max(...highScores, 0) : 0;
      
      // Update the player
      const updatedPlayer = {
        ...player,
        throws: newThrows,
        score: player.score + scoreToAdd,
        averageScore,
        highestScore
      };
      
      // Create new players array with updated player
      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = updatedPlayer;
      
      return { ...state, players: updatedPlayers };
    }
    
    case 'END_TURN': {
      // Move to the next player
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      
      // If we've gone through all players, increment the round
      const newRound = nextPlayerIndex === 0 
        ? state.currentRound + 1 
        : state.currentRound;
      
      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        currentRound: newRound,
        currentThrow: { darts: [], isComplete: false }
      };
    }
    
    case 'END_GAME': {
      const { winner } = action;
      
      // Update session stats
      const newPlayerWins = { ...state.sessionStats.playerWins };
      newPlayerWins[winner.id] = (newPlayerWins[winner.id] || 0) + 1;
      
      return {
        ...state,
        gameStatus: "complete",
        winner,
        sessionStats: {
          playerWins: newPlayerWins,
          gamesPlayed: state.sessionStats.gamesPlayed + 1
        }
      };
    }
    
    case 'RESET_GAME': {
      return {
        ...initialState,
        sessionStats: state.sessionStats,
        players: state.players.map(player => ({
          ...player,
          score: state.gameOptions.startingScore,
          throws: [],
          averageScore: 0,
          highestScore: 0
        })),
        gameStatus: "setup",
        currentThrow: { darts: [], isComplete: false }
      };
    }
    
    case 'UPDATE_SESSION_STATS': {
      return state; // This is handled automatically in other actions
    }
    
    default:
      return state;
  }
};

// Create the context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, loadInitialState());
  
  // Save session stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('throwdown_game_state', JSON.stringify({
      sessionStats: state.sessionStats
    }));
  }, [state.sessionStats]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};