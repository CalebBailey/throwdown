import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { calculateScore, dartNotationToScore } from '../utils/gameUtils';

// Types for our game state
export interface Player {
  id: string;
  name: string;
  colour: string;
  score: number;
  throws: string[][]; // Changed from number[][] to string[][] for dart notations
  averageScore: number;
  highestScore: number;
  lastScore: number; // Last score thrown
  wins: number;
  legs: number;
  sets: number;
  // Additional statistics
  threeDartAverage: number; // Average based on darts thrown
  first9Average: number; // First 9 darts average
  checkoutRate: number; // Percentage of successful checkouts
  checkoutsCompleted: number; // Number of successful checkouts
  checkoutAttempts: number; // Number of checkout opportunities
  highestFinish: number; // Highest checkout completed
  bestLeg: number; // Best leg in darts
  worstLeg: number; // Worst leg in darts
  // Killer game specific properties
  segment?: number; // Assigned segment in Killer game
  isKiller?: boolean; // Whether player is a "killer" in Killer game
  segmentHits?: number; // Number of times player has hit their segment (0-3)
  lives?: number; // Lives remaining in Killer game (starting at segmentHits)
  isEliminated?: boolean; // Whether player is eliminated in Killer game
  // New Killer game statistics
  singlesHit?: number; // Number of singles hit in Killer game
  doublesHit?: number; // Number of doubles hit in Killer game
  triplesHit?: number; // Number of triples hit in Killer game
  playersEliminated?: number; // Number of players eliminated by this player
  // Shanghai game specific properties
  shanghaiSegmentScores?: Record<number, number>; // Segment scores for Shanghai game, keyed by segment number
  shanghaisHit?: number; // Number of Shanghais hit
  // Donkey Derby specific
  donkeyProgress?: number; // Distance advanced toward finish line
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

export interface KillerOptions {
  maxHits: number; // Maximum segment hits needed to become a killer (3, 5, or 7)
  lives?: number; // Optional number of lives for killer game
}

export interface ShanghaiOptions {
  segments?: number[]; // Optional custom segment order, defaults to [1-9]
}

export type GameType = "501" | "301" | "701" | "custom" | "killer" | "shanghai" | "donkey_derby";
export type GameStatus = "setup" | "active" | "complete";

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gameType: GameType;
  gameOptions: GameOptions;
  killerOptions?: KillerOptions;
  shanghaiOptions?: ShanghaiOptions;
  donkeyDerbyOptions?: { finishLine: number };
  gameStatus: GameStatus;
  currentTurn: number;
  winner: Player | null;
  sessionStats: {
    playerWins: Record<string, number>;
    gamesPlayed: number;
  };
  currentThrow: {
    darts: string[];
    isComplete: boolean;
  };
  // Track which player starts each leg (advances after each leg)
  legStarterIndex: number;
}

// Actions
export type GameAction =
  | { type: 'ADD_PLAYER'; player: Omit<Player, 'score' | 'throws' | 'averageScore' | 'highestScore'> }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'UPDATE_PLAYER_COLOUR'; id: string; colour: string }
  | { type: 'SET_PLAYER_ORDER'; players: Player[] }
  | { type: 'START_GAME'; gameType: GameType; gameOptions: GameOptions; killerOptions?: KillerOptions; shanghaiOptions?: ShanghaiOptions; donkeyDerbyOptions?: { finishLine: number } }
  | { type: 'ADD_DART'; dart: string }
  | { type: 'REMOVE_DART' }
  | { type: 'REMOVE_KILLER_DART' }
  | { type: 'PROCESS_KILLER_DART_HIT' } // New action to process darts immediately
  | { type: 'SUBMIT_THROW' }
  | { type: 'KILLER_SUBMIT_THROW' } // New action type for Killer game
  | { type: 'INPUT_SCORE'; playerId: string; score: number } // Keep for backward compatibility
  | { type: 'UNDO_SCORE'; playerId: string }
  | { type: 'END_TURN' }
  | { type: 'END_GAME'; winner: Player }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_SESSION_STATS' }
  | { type: 'ASSIGN_SEGMENTS' } // For Killer game
  | { type: 'ADD_SEGMENT_HIT'; playerId: string; hits: number }
  | { type: 'REDUCE_LIFE'; playerId: string; hits: number }
  | { type: 'ELIMINATE_PLAYER'; playerId: string };

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
  killerOptions: {
    maxHits: 3, // Default to 3 hits to become a killer
  },
  shanghaiOptions: {
    segments: [1, 2, 3, 4, 5, 6, 7, 8, 9], // Default segments for Shanghai
  },
  donkeyDerbyOptions: {
    finishLine: 10
  },
  gameStatus: "setup",
  currentTurn: 1,
  winner: null,
  sessionStats: {
    playerWins: {},
    gamesPlayed: 0,
  },
  currentThrow: {
    darts: [],
    isComplete: false
  },
  legStarterIndex: 0,
};

// Load session data from localStorage if available
const loadInitialState = (): GameState => {
  const savedState = localStorage.getItem('throwdown_game_state');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      // If we have an active game, restore the full state
      if (parsedState.gameStatus === 'active' && parsedState.players && parsedState.players.length > 0) {
        console.log('Restoring active game state from localStorage');
        return {
          ...initialState,
          ...parsedState,
          // Ensure we have proper defaults for any missing properties
          currentThrow: parsedState.currentThrow || initialState.currentThrow,
          killerOptions: parsedState.killerOptions || initialState.killerOptions,
          shanghaiOptions: parsedState.shanghaiOptions || initialState.shanghaiOptions,
          donkeyDerbyOptions: parsedState.donkeyDerbyOptions || initialState.donkeyDerbyOptions
        };
      }
      // Otherwise, just restore session stats
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

// Helper function to assign random segments to players for Killer game
const assignRandomSegments = (players: Player[]): Player[] => {
  // Create an array of numbers from 1 to 20
  const availableSegments = Array.from({ length: 20 }, (_, i) => i + 1);
  
  // Shuffle the array to randomize segment assignments
  const shuffledSegments = availableSegments.sort(() => Math.random() - 0.5);
  
  // Make sure we have enough segments for all players
  const finalSegments = shuffledSegments.slice(0, players.length);
  
  // Assign segments to players
  return players.map((player, index) => ({
    ...player,
    segment: finalSegments[index],
    segmentHits: 0,
    lives: 0,
    isKiller: false,
    isEliminated: false
  }));
};

// Assign random unique segments (1-20) for Donkey Derby without killer properties
const assignRandomSegmentsSimple = (players: Player[]): Player[] => {
  const availableSegments = Array.from({ length: 20 }, (_, i) => i + 1);
  const shuffled = availableSegments.sort(() => Math.random() - 0.5);
  return players.map((p, idx) => ({
    ...p,
    segment: shuffled[idx],
    donkeyProgress: 0,
    singlesHit: 0,
    doublesHit: 0,
    triplesHit: 0
  }));
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
        lastScore: 0,
        wins: state.sessionStats.playerWins[player.id] || 0,
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
      return { ...state, players: [...state.players, newPlayer] };
    }
    
    case 'REMOVE_PLAYER': {
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.id)
      };
    }
    
    case 'UPDATE_PLAYER_COLOUR': {
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.id ? { ...player, colour: action.colour } : player
        )
      };
    }
    
    case 'SET_PLAYER_ORDER': {
      return { ...state, players: action.players };
    }
    
    case 'START_GAME': {
      const { gameType, gameOptions, killerOptions, shanghaiOptions, donkeyDerbyOptions } = action;
      
      // Validate that Killer game must have at least 2 players
      if (gameType === 'killer' && state.players.length < 2) {
        console.error('Cannot start Killer game with less than 2 players');
        return state; // Don't start the game
      }
      
      // Initialize players based on game type
      let updatedPlayers: Player[] = state.players.map(player => ({
        ...player,
        score: gameOptions.startingScore,
        throws: [],
        averageScore: 0,
        highestScore: 0,
        legs: 0,
        sets: 0,
        donkeyProgress: 0
      }));
      
      // For Killer game, assign random segments to players
      if (gameType === 'killer') {
        updatedPlayers = assignRandomSegments(updatedPlayers);
      } else if (gameType === 'donkey_derby') {
        updatedPlayers = assignRandomSegmentsSimple(updatedPlayers);
      }
      
      return {
        ...state,
        gameType,
        gameOptions,
  killerOptions: killerOptions || state.killerOptions,
  shanghaiOptions: shanghaiOptions || state.shanghaiOptions,
  donkeyDerbyOptions: donkeyDerbyOptions || state.donkeyDerbyOptions,
        gameStatus: "active",
        currentTurn: 1,
        currentPlayerIndex: 0,
        legStarterIndex: 0,
        players: updatedPlayers,
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
      newDarts.pop(); // Remove the last dart
      
      return {
        ...state,
        currentThrow: {
          darts: newDarts,
          isComplete: false
        }
      };
    }

    case 'REMOVE_KILLER_DART': {
      if (state.currentThrow.darts.length === 0) {
        return state;
      }
      
      const newDarts = [...state.currentThrow.darts];
      const removedDart = newDarts.pop();
      
      if (removedDart) {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (!currentPlayer) return state;
        
        // Get segment and hit value from the removed dart
        const multiplier = removedDart[0];
        const segment = parseInt(removedDart.substring(1));
        
        // Determine hit value based on multiplier
        let hitValue = 1;
        if (multiplier === 'D') hitValue = 2;
        if (multiplier === 'T') hitValue = 3;
        
        const updatedPlayers = [...state.players];
        
        // Case 1: Player hit their own segment
        if (segment === currentPlayer.segment) {
          // Reduce segment hits
          const currentHits = currentPlayer.segmentHits || 0;
          const newHits = Math.max(0, currentHits - hitValue);
          
          // Update player status
          updatedPlayers[state.currentPlayerIndex] = {
            ...currentPlayer,
            segmentHits: newHits,
            isKiller: newHits >= (state.killerOptions?.maxHits || 3)
          };
        } 
        // Case 2: Current player is a killer and hit another player's segment
        else if (currentPlayer.isKiller) {
          // Find target player with this segment
          const targetPlayerIndex = updatedPlayers.findIndex(
            p => p.segment === segment && !p.isEliminated
          );
          
          if (targetPlayerIndex >= 0) {
            const targetPlayer = updatedPlayers[targetPlayerIndex];
            // Add back hit value to target player's lives
            updatedPlayers[targetPlayerIndex] = {
              ...targetPlayer,
              segmentHits: (targetPlayer.segmentHits || 0) + hitValue,
              isEliminated: false // Revive player since they got hits back
            };
          }
        }
        
        return {
          ...state,
          players: updatedPlayers,
          currentThrow: {
            darts: newDarts,
            isComplete: false
          }
        };
      }
      // If no dart was removed, just return the state
      return state;
    }
    
    case 'PROCESS_KILLER_DART_HIT': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer) return state;
      
      // Get the last dart thrown (the one we just added)
      const lastDartIndex = state.currentThrow.darts.length - 1;
      if (lastDartIndex < 0) return state;
      
      const lastDart = state.currentThrow.darts[lastDartIndex];
      const updatedPlayers = [...state.players];
      const maxHits = state.killerOptions?.maxHits || 3;
      
      // Process just the last dart thrown
      const multiplier = lastDart[0];
      const segment = parseInt(lastDart.substring(1));
      
      // Determine hit value based on multiplier
      let hitValue = 1;
      if (multiplier === 'D') hitValue = 2;
      if (multiplier === 'T') hitValue = 3;
      
      // Update killer-specific statistics
      let { singlesHit = 0, doublesHit = 0, triplesHit = 0, playersEliminated = 0 } = currentPlayer;
      
      // Increment the appropriate counter based on multiplier
      if (multiplier === 'S') singlesHit++;
      else if (multiplier === 'D') doublesHit++;
      else if (multiplier === 'T') triplesHit++;
      
      // Case 1: Player hits their own segment
      if (segment === currentPlayer.segment) {
        // Add hits to become a killer
        const currentHits = currentPlayer.segmentHits || 0;
        const newHits = Math.min(maxHits, currentHits + hitValue); // Cap at maxHits
        
        // Update player status
        updatedPlayers[state.currentPlayerIndex] = {
          ...currentPlayer,
          segmentHits: newHits,
          isKiller: newHits >= maxHits, // Becomes killer when hits threshold reached
          singlesHit,
          doublesHit,
          triplesHit,
          playersEliminated
        };
      } 
      // Case 2: Current player is a killer and hits another player's segment
      else if (currentPlayer.isKiller) {
        // Find target player with this segment
        const targetPlayerIndex = updatedPlayers.findIndex(
          p => p.segment === segment && !p.isEliminated
        );
        
        if (targetPlayerIndex >= 0) {
          const targetPlayer = updatedPlayers[targetPlayerIndex];
          const newSegmentHits = (targetPlayer.segmentHits || 0) - hitValue;
          const isNewlyEliminated = newSegmentHits <= -1 && !(targetPlayer.isEliminated || false);
          
          // Reduce target player's lives by hit value
          updatedPlayers[targetPlayerIndex] = {
            ...targetPlayer,
            segmentHits: newSegmentHits,
            isEliminated: newSegmentHits <= -1,
            isKiller: false // Target player is no longer a killer
          };
          
          // Increment players eliminated count if the target player was just eliminated
          if (isNewlyEliminated) {
            playersEliminated++;
          }
          
          // Update current player with updated stats
          updatedPlayers[state.currentPlayerIndex] = {
            ...currentPlayer,
            singlesHit,
            doublesHit,
            triplesHit,
            playersEliminated
          };
        } else {
          // Update current player with updated stats even if target wasn't found
          updatedPlayers[state.currentPlayerIndex] = {
            ...currentPlayer,
            singlesHit,
            doublesHit,
            triplesHit,
            playersEliminated
          };
        }
      } else {
        // Case 3: Player hits another player's segment but isn't a killer yet
        // Just update statistics
        updatedPlayers[state.currentPlayerIndex] = {
          ...currentPlayer,
          singlesHit,
          doublesHit,
          triplesHit,
          playersEliminated
        };
      }
      
      // Check if there's only one player left (winner)
      const playersStillIn = updatedPlayers.filter(player => !player.isEliminated);
      
      if (playersStillIn.length === 1 && updatedPlayers.some(p => p.isEliminated)) {
        const winner = playersStillIn[0];
        winner.wins = (winner.wins || 0) + 1;
        
        // IMPORTANT: Record the current throw before ending the game
        // so that darts thrown statistics are accurate
        const winnerWithThrows = {
          ...winner,
          throws: [...winner.throws, [...state.currentThrow.darts]]
        };
        
        // Update the winner in the players array
        const finalPlayers = updatedPlayers.map(p => 
          p.id === winner.id ? winnerWithThrows : p
        );
        
        // Update session stats
        const newPlayerWins = { ...state.sessionStats.playerWins };
        newPlayerWins[winner.id] = (newPlayerWins[winner.id] || 0) + 1;
        
        return {
          ...state,
          players: finalPlayers,
          gameStatus: 'complete',
          winner: winnerWithThrows,
          sessionStats: {
            ...state.sessionStats,
            playerWins: newPlayerWins,
            gamesPlayed: state.sessionStats.gamesPlayed + 1
          }
        };
      }
      
      // Return the updated state WITHOUT changing the current player
      return {
        ...state,
        players: updatedPlayers
      };
    }

    case 'SUBMIT_THROW': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer) return state;
      
      const dartsThrown = [...state.currentThrow.darts];
      if (dartsThrown.length === 0) return state; // Don't submit empty throws
      
      const score = calculateScore(dartsThrown);
      
      console.log(`X01 game: Processing score ${score} for player ${currentPlayer.name}`);
      
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
      
      // Calculate new score - IMPORTANT: This is where the score is subtracted
      const newScore = currentPlayer.score - score;
      console.log(`X01 game: Player ${currentPlayer.name} score before: ${currentPlayer.score}, after: ${newScore}`);
      
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
      if (!newThrows[state.currentTurn - 1]) {
        newThrows[state.currentTurn - 1] = [];
      }
      newThrows[state.currentTurn - 1] = dartsThrown;
      
      // Calculate total darts thrown in all legs
  const allDarts = newThrows.flat();
  const dartsCount = allDarts.length;
      
      // Calculate scores for various statistics
      const totalScore = newThrows.reduce((sum, turn) => {
        return sum + turn.reduce((turnSum, dart) => turnSum + dartNotationToScore(dart), 0);
      }, 0);
      
      // Calculate averages
      const turnCount = newThrows.length;
      const averageScore = turnCount > 0 ? totalScore / turnCount : 0;
  const threeDartAverage = dartsCount > 0 ? (totalScore / dartsCount) * 3 : 0;
      
      // Calculate first 9 dart average
      const first9Darts = newThrows.slice(0, 3).flat();
      const first9Score = first9Darts.reduce((sum, dart) => sum + dartNotationToScore(dart), 0);
      const first9Average = first9Darts.length > 0 ? (first9Score / first9Darts.length) * 3 : 0;
      
      // Find the highest score in a single turn
      const turnScores = newThrows.map(turnDarts => 
        turnDarts.reduce((sum, dart) => sum + dartNotationToScore(dart), 0)
      );
      const highestScore = turnScores.length > 0 ? Math.max(...turnScores, 0) : 0;
      const lastScore = score; // Current throw score
      
      // Track checkout statistics
      let checkoutsCompleted = currentPlayer.checkoutsCompleted || 0;
      let highestFinish = currentPlayer.highestFinish || 0;
      
      // If this was a checkout, update the statistics
      if (!isBust && newScore === 0) {
        checkoutsCompleted++;
        // Track highest finish - the score before this throw
        if (currentPlayer.score > highestFinish) {
          highestFinish = currentPlayer.score;
        }
      }
      
      // Track checkout attempts - when player could potentially check out
      const wasCheckoutAttempt = currentPlayer.score <= 170;
      const checkoutAttempts = wasCheckoutAttempt ? 
        (currentPlayer.checkoutAttempts || 0) + 1 : 
        (currentPlayer.checkoutAttempts || 0);
      
      // Calculate checkout rate
      const checkoutRate = checkoutAttempts > 0 ? 
        (checkoutsCompleted / checkoutAttempts) * 100 : 0;
      
      // Track leg statistics (in darts)
      let bestLeg = currentPlayer.bestLeg || 0;
      let worstLeg = currentPlayer.worstLeg || 0;
      
      // If this was a checkout, update leg statistics
      if (!isBust && newScore === 0) {
  const currentLegDarts = dartsCount;
        
        // Update best leg
        if (bestLeg === 0 || currentLegDarts < bestLeg) {
          bestLeg = currentLegDarts;
        }
        
        // Update worst leg
        if (worstLeg === 0 || currentLegDarts > worstLeg) {
          worstLeg = currentLegDarts;
        }
      }
      
      // Update the player with all statistics
      const updatedPlayer = {
        ...currentPlayer,
        throws: newThrows,
        score: isBust ? currentPlayer.score : Math.max(0, newScore),
        averageScore,
        highestScore,
        lastScore,
        threeDartAverage,
        first9Average,
        checkoutRate,
        checkoutsCompleted,
        checkoutAttempts,
        highestFinish,
        bestLeg,
        worstLeg
      };
      
      // Create new players array with updated player
      const updatedPlayers = state.players.map((p, idx) => 
        idx === state.currentPlayerIndex ? updatedPlayer : p
      );
      
      // Check for winner
      if (!isBust && newScore === 0) {
        // Player has hit a checkout
        const playerWithLegIncrement = {
          ...updatedPlayer,
          legs: updatedPlayer.legs + 1
        };
        
        // Update players array with leg increment
        const playersWithLegUpdate = state.players.map((p, idx) => 
          idx === state.currentPlayerIndex ? playerWithLegIncrement : p
        );
        
        // For "Best of" format
        const totalLegsNeeded = Math.ceil(state.gameOptions.legs / 2);
        // For "First to" format
        const firstToLegsNeeded = state.gameOptions.legs;
        
        const legsNeeded = state.gameOptions.format === 'bestOf' ? totalLegsNeeded : firstToLegsNeeded;
        
        // Check if player has won enough legs to win a set
        if (playerWithLegIncrement.legs >= legsNeeded) {
          // Player wins a set
          const playerWithSetIncrement = {
            ...playerWithLegIncrement,
            sets: playerWithLegIncrement.sets + 1
          };
          
          // Reset legs for all players for the next set
          const playersWithLegsReset = playersWithLegUpdate.map(player => ({
            ...player,
            legs: 0
          }));
          
          // For "Best of" format
          const totalSetsNeeded = Math.ceil(state.gameOptions.sets / 2);
          // For "First to" format
          const firstToSetsNeeded = state.gameOptions.sets;
          
          const setsNeeded = state.gameOptions.format === 'bestOf' ? totalSetsNeeded : firstToSetsNeeded;
          
          // Check if player has won enough sets to win the game
          if (state.gameOptions.sets > 1 && playerWithSetIncrement.sets >= setsNeeded) {
            // Player wins the game
            const winningPlayer = {
              ...playerWithSetIncrement,
              wins: playerWithSetIncrement.wins + 1
            };
            
            // Final players array with winner updated
            const finalPlayers = playersWithLegsReset.map((p, idx) => 
              idx === state.currentPlayerIndex ? winningPlayer : p
            );
            
            // Update session stats
            const newPlayerWins = { ...state.sessionStats.playerWins };
            newPlayerWins[winningPlayer.id] = (newPlayerWins[winningPlayer.id] || 0) + 1;
            
            return {
              ...state,
              players: finalPlayers,
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
            const playersWithScoresReset = playersWithLegsReset.map(player => ({
              ...player,
              score: state.gameOptions.startingScore,
              throws: []
            }));
            
            // For next leg, advance the leg starter index according to standard darts rules
            const nextLegStarterIndex = (state.legStarterIndex + 1) % state.players.length;
            
            // Continue to next leg
            return {
              ...state,
              players: playersWithScoresReset,
              // Set the current player to the next leg's starter
              currentPlayerIndex: nextLegStarterIndex,
              // Update the leg starter for the next leg
              legStarterIndex: nextLegStarterIndex,
              currentThrow: { darts: [], isComplete: false },
              currentTurn: 1
            };
          } else {
            // No sets in play (sets = 1), this is a direct win
            const winningPlayer = {
              ...playerWithSetIncrement,
              wins: playerWithSetIncrement.wins + 1
            };
            
            // Final players array with winner updated
            const finalPlayers = playersWithLegsReset.map((p, idx) => 
              idx === state.currentPlayerIndex ? winningPlayer : p
            );
            
            // Update session stats
            const newPlayerWins = { ...state.sessionStats.playerWins };
            newPlayerWins[winningPlayer.id] = (newPlayerWins[winningPlayer.id] || 0) + 1;
            
            return {
              ...state,
              players: finalPlayers,
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
          const playersWithScoresReset = playersWithLegUpdate.map(player => ({
            ...player,
            score: state.gameOptions.startingScore,
            throws: []
          }));
          
          // For next leg, advance the leg starter index according to standard darts rules
          const nextLegStarterIndex = (state.legStarterIndex + 1) % state.players.length;
          
          // Continue to next leg
          return {
            ...state,
            players: playersWithScoresReset,
            // Set the current player to the next leg's starter
            currentPlayerIndex: nextLegStarterIndex,
            // Update the leg starter for the next leg
            legStarterIndex: nextLegStarterIndex,
            currentThrow: { darts: [], isComplete: false },
            currentTurn: 1
          };
        }
      }
      
      // Move to next player
      let nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const newRound = nextPlayerIndex === 0 ? state.currentTurn + 1 : state.currentTurn;
      
      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentTurn: newRound,
        currentThrow: { darts: [], isComplete: false }
      };
    }
    
    case 'KILLER_SUBMIT_THROW': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer) return state;
      
      // Get the darts thrown in this turn
      const dartsThrown = [...state.currentThrow.darts];
      
      // Record the throws
      const newThrows = [...currentPlayer.throws];
      newThrows.push(dartsThrown);
      
      // Update the player with their latest throws
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = {
        ...currentPlayer,
        throws: newThrows
      };
      
      // Find the next active player by skipping all eliminated players
      let nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      let loopCount = 0; // Prevent infinite loop
      
      // Loop until we find a non-eliminated player or we've gone through all players
      while (
        updatedPlayers[nextPlayerIndex].isEliminated && 
        loopCount < updatedPlayers.length
      ) {
        nextPlayerIndex = (nextPlayerIndex + 1) % updatedPlayers.length;
        loopCount++;
      }
      
      // If we've completed a full round (back to current player or passed them)
      const newTurn = nextPlayerIndex <= state.currentPlayerIndex 
        ? state.currentTurn + 1 
        : state.currentTurn;
      
      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentTurn: newTurn,
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
      if (!newThrows[state.currentTurn - 1]) {
        newThrows[state.currentTurn - 1] = [];
      }
      newThrows[state.currentTurn - 1] = simulatedDarts;
      
      // Calculate new player score
      const newScore = player.score - score;
      
      // Check for bust (score < 0 or score = 1 or doubleOut required but impossible)
      const isBust = newScore < 0 || 
                     newScore === 1 || 
                     (state.gameOptions.outMode === 'double' && newScore === 0 && score % 2 !== 0);
      
      // Calculate stats
      
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
      const currentRoundIndex = state.currentTurn - 1;
      
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
  // Flattened darts not required for current average calculation
      
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
        ? state.currentTurn + 1 
        : state.currentTurn;
      
      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        currentTurn: newRound,
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
      // Clear the saved game state from localStorage
      localStorage.removeItem('throwdown_game_state');
      localStorage.setItem('throwdown_game_state', JSON.stringify({
        sessionStats: state.sessionStats
      }));
      
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
    
    case 'ASSIGN_SEGMENTS': {
      return {
        ...state,
        players: assignRandomSegments([...state.players])
      };
    }
    
    case 'ADD_SEGMENT_HIT': {
      const { playerId, hits } = action;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      const maxHits = state.killerOptions?.maxHits || 3;
      const currentHits = player.segmentHits || 0;
      const newHits = Math.min(maxHits, currentHits + hits);
      
      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...player,
        segmentHits: newHits,
        lives: newHits, // Lives equals segment hits
        isKiller: newHits >= maxHits // Becomes killer when max hits reached
      };
      
      return {
        ...state,
        players: updatedPlayers
      };
    }
    
    case 'REDUCE_LIFE': {
      const { playerId, hits } = action;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      const currentLives = player.lives || 0;
      const newLives = Math.max(0, currentLives - hits);
      
      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...player,
        lives: newLives,
        isEliminated: newLives === 0
      };
      
      // Check if there's only one player left (winner)
      const playersStillIn = updatedPlayers.filter(player => !player.isEliminated);
      
      if (playersStillIn.length === 1 && updatedPlayers.some(p => p.isEliminated)) {
        const winner = playersStillIn[0];
        return {
          ...state,
          players: updatedPlayers,
          gameStatus: 'complete',
          winner
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
    }
    
    case 'ELIMINATE_PLAYER': {
      const playerIndex = state.players.findIndex(p => p.id === action.playerId);
      if (playerIndex === -1) return state;
      
      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        lives: 0,
        isEliminated: true
      };
      
      // Check if there's only one player left (winner)
      const playersStillIn = updatedPlayers.filter(player => !player.isEliminated);
      
      if (playersStillIn.length === 1 && updatedPlayers.some(p => p.isEliminated)) {
        const winner = playersStillIn[0];
        winner.wins = (winner.wins || 0) + 1;
        
        // Update session stats
        const newPlayerWins = { ...state.sessionStats.playerWins };
        newPlayerWins[winner.id] = (newPlayerWins[winner.id] || 0) + 1;
        
        return {
          ...state,
          players: updatedPlayers,
          gameStatus: 'complete',
          winner,
          sessionStats: {
            ...state.sessionStats,
            playerWins: newPlayerWins,
            gamesPlayed: state.sessionStats.gamesPlayed + 1
          }
        };
      }
      
      return {
        ...state,
        players: updatedPlayers
      };
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
  
  // Save full game state to localStorage when it changes (for active games)
  useEffect(() => {
    // Only save if we have an active game
    if (state.gameStatus === 'active' && state.players.length > 0) {
      localStorage.setItem('throwdown_game_state', JSON.stringify(state));
    } else if (state.gameStatus === 'complete' || state.gameStatus === 'setup') {
      // Save only session stats when game is complete or in setup
      localStorage.setItem('throwdown_game_state', JSON.stringify({
        sessionStats: state.sessionStats
      }));
    }
  }, [state]);
  
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