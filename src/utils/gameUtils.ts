import { Player } from '../context/GameContext';

// Checkout data from checkouts.txt
// Format: [primaryRoute, backupRoute]
// Where each route is an array of dart notations
const checkoutData: Record<number, { primary: string[], backup: string[] | null }> = {
  170: { primary: ['T20', 'T20', 'Bull'], backup: null },
  169: { primary: ['NO OUTSHOT'], backup: null },
  168: { primary: ['NO OUTSHOT'], backup: null },
  167: { primary: ['T20', 'T19', 'Bull'], backup: null },
  166: { primary: ['NO OUTSHOT'], backup: null },
  165: { primary: ['NO OUTSHOT'], backup: null },
  164: { primary: ['T20', 'T18', 'Bull'], backup: null },
  163: { primary: ['NO OUTSHOT'], backup: null },
  162: { primary: ['NO OUTSHOT'], backup: null },
  161: { primary: ['T20', 'T17', 'Bull'], backup: null },
  160: { primary: ['T20', 'T20', 'D20'], backup: null },
  159: { primary: ['NO OUTSHOT'], backup: null },
  158: { primary: ['T20', 'T20', 'D19'], backup: null },
  157: { primary: ['T20', 'T19', 'D20'], backup: null },
  156: { primary: ['T20', 'T20', 'D18'], backup: null },
  155: { primary: ['T20', 'T19', 'D19'], backup: null },
  154: { primary: ['T20', 'T18', 'D20'], backup: null },
  153: { primary: ['T20', 'T19', 'D18'], backup: null },
  152: { primary: ['T20', 'T20', 'D16'], backup: null },
  151: { primary: ['T20', 'T17', 'D20'], backup: null },
  150: { primary: ['T20', 'T18', 'D18'], backup: null },
  149: { primary: ['T20', 'T19', 'D16'], backup: null },
  148: { primary: ['T20', 'T16', 'D20'], backup: null },
  147: { primary: ['T20', 'T17', 'D18'], backup: null },
  146: { primary: ['T20', 'T18', 'D16'], backup: null },
  145: { primary: ['T20', 'T15', 'D20'], backup: null },
  144: { primary: ['T20', 'T20', 'D12'], backup: null },
  143: { primary: ['T20', 'T17', 'D16'], backup: null },
  142: { primary: ['T20', 'T14', 'D20'], backup: null },
  141: { primary: ['T20', 'T19', 'D12'], backup: null },
  140: { primary: ['T20', 'T16', 'D16'], backup: null },
  139: { primary: ['T20', 'T13', 'D20'], backup: null },
  138: { primary: ['T20', 'T18', 'D12'], backup: null },
  137: { primary: ['T20', 'T15', 'D16'], backup: null },
  136: { primary: ['T20', 'T20', 'D8'], backup: null },
  135: { primary: ['T20', 'T17', 'D12'], backup: null },
  134: { primary: ['T20', 'T14', 'D16'], backup: null },
  133: { primary: ['T20', 'T19', 'D8'], backup: null },
  132: { primary: ['T20', 'T16', 'D12'], backup: null },
  131: { primary: ['T20', 'T13', 'D16'], backup: null },
  130: { primary: ['T20', 'T20', 'D5'], backup: null },
  129: { primary: ['T19', 'T16', 'D12'], backup: null },
  128: { primary: ['T18', 'T14', 'D16'], backup: null },
  127: { primary: ['T20', 'T17', 'D8'], backup: null },
  126: { primary: ['T19', 'T19', 'D6'], backup: null },
  125: { primary: ['T20', 'T15', 'D10'], backup: null },
  124: { primary: ['T20', 'T16', 'D8'], backup: null },
  123: { primary: ['T19', 'T16', 'D9'], backup: null },
  122: { primary: ['T18', 'T20', 'D4'], backup: null },
  121: { primary: ['T20', 'T11', 'D14'], backup: null },
  120: { primary: ['T20', 'S20', 'D20'], backup: null },
  119: { primary: ['T19', 'S12', 'D16'], backup: null },
  118: { primary: ['T20', 'S18', 'D20'], backup: null },
  117: { primary: ['T20', 'S17', 'D20'], backup: null },
  116: { primary: ['T20', 'S16', 'D20'], backup: null },
  115: { primary: ['T20', 'S15', 'D20'], backup: null },
  114: { primary: ['T20', 'S14', 'D20'], backup: null },
  113: { primary: ['T20', 'S13', 'D20'], backup: null },
  112: { primary: ['T20', 'S12', 'D20'], backup: null },
  111: { primary: ['T20', 'S11', 'D20'], backup: null },
  110: { primary: ['T20', 'S10', 'D20'], backup: null },
  109: { primary: ['T20', 'S9', 'D20'], backup: null },
  108: { primary: ['T20', 'S8', 'D20'], backup: null },
  107: { primary: ['T19', 'S10', 'D20'], backup: null },
  106: { primary: ['T20', 'S6', 'D20'], backup: null },
  105: { primary: ['T19', 'S8', 'D20'], backup: null },
  104: { primary: ['T18', 'S10', 'D20'], backup: null },
  103: { primary: ['T17', 'S12', 'D20'], backup: null },
  102: { primary: ['T20', 'S10', 'D16'], backup: null },
  101: { primary: ['T17', 'S10', 'D20'], backup: null },
  100: { primary: ['T20', 'D20'], backup: null },
  99: { primary: ['T19', '10', 'D16'], backup: null },
  98: { primary: ['T20', 'D19'], backup: null },
  97: { primary: ['T19', 'D20'], backup: null },
  96: { primary: ['T20', 'D18'], backup: null },
  95: { primary: ['T19', 'D19'], backup: null },
  94: { primary: ['T18', 'D20'], backup: null },
  93: { primary: ['T19', 'D18'], backup: null },
  92: { primary: ['T20', 'D16'], backup: null },
  91: { primary: ['T17', 'D20'], backup: null },
  90: { primary: ['T18', 'D18'], backup: null },
  89: { primary: ['T19', 'D16'], backup: null },
  88: { primary: ['T20', 'D14'], backup: ['T16', 'D20'] },
  87: { primary: ['T17', 'D18'], backup: ['T13', 'D18'] },
  86: { primary: ['T18', 'D16'], backup: ['T20', 'D13'] },
  85: { primary: ['T15', 'D20'], backup: ['T19', 'D14'] },
  84: { primary: ['T20', 'D12'], backup: ['T16', 'D18'] },
  83: { primary: ['T17', 'D16'], backup: ['T13', 'D22'] },
  82: { primary: ['Bull', 'D16'], backup: ['T14', 'D20'] },
  81: { primary: ['T19', 'D12'], backup: ['T15', 'D18'] },
  80: { primary: ['T20', 'D10'], backup: ['S20', 'D20'] },
  79: { primary: ['T13', 'D20'], backup: ['T19', 'D11'] },
  78: { primary: ['T18', 'D12'], backup: ['T14', 'D18'] },
  77: { primary: ['T19', 'D10'], backup: ['T15', 'D16'] },
  76: { primary: ['T20', 'D8'], backup: ['T16', 'D14'] },
  75: { primary: ['T17', 'D12'], backup: ['T13', 'D18'] },
  74: { primary: ['T14', 'D16'], backup: ['T18', 'D10'] },
  73: { primary: ['T19', 'D8'], backup: ['T11', 'D20'] },
  72: { primary: ['T16', 'D12'], backup: ['S20', 'D16'] },
  71: { primary: ['T13', 'D16'], backup: ['T17', 'D10'] },
  70: { primary: ['T18', 'D8'], backup: ['S20', 'Bull'] },
  69: { primary: ['T19', 'D6'], backup: ['S19', 'Bull'] },
  68: { primary: ['T20', 'D4'], backup: ['S20', 'D4', 'D2'] },
  67: { primary: ['T17', 'D8'], backup: ['T9', 'D20'] },
  66: { primary: ['T10', 'D18'], backup: ['T14', 'D12'] },
  65: { primary: ['T19', 'D4'], backup: ['T11', 'D16'] },
  64: { primary: ['T16', 'D8'], backup: ['S14', 'Bull'] },
  63: { primary: ['T13', 'D12'], backup: ['S13', 'Bull'] },
  62: { primary: ['T10', 'D16'], backup: ['S12', 'Bull'] },
  61: { primary: ['T15', 'D8'], backup: ['S11', 'Bull'] },
  60: { primary: ['S20', 'D20'], backup: ['T20', 'D10'] },
  59: { primary: ['S19', 'D20'], backup: ['T17', 'D4'] },
  58: { primary: ['S18', 'D20'], backup: ['T16', 'D5'] },
  57: { primary: ['S17', 'D20'], backup: ['T17', 'D3'] },
  56: { primary: ['S16', 'D20'], backup: ['T20', 'D8'] },
  55: { primary: ['S15', 'D20'], backup: ['T15', 'D5'] },
  54: { primary: ['S14', 'D20'], backup: ['T14', 'D6'] },
  53: { primary: ['S13', 'D20'], backup: ['T13', 'D7'] },
  52: { primary: ['S12', 'D20'], backup: ['T12', 'D8'] },
  51: { primary: ['S11', 'D20'], backup: ['T13', 'D6'] },
  50: { primary: ['S10', 'D20'], backup: ['Bull'] },
  49: { primary: ['S9', 'D20'], backup: ['S17', 'D16'] },
  48: { primary: ['S16', 'D16'], backup: null },
  47: { primary: ['S15', 'D16'], backup: null },
  46: { primary: ['S14', 'D16'], backup: null },
  45: { primary: ['S13', 'D16'], backup: null },
  44: { primary: ['S12', 'D16'], backup: null },
  43: { primary: ['S11', 'D16'], backup: null },
  42: { primary: ['S10', 'D16'], backup: null },
  41: { primary: ['S9', 'D16'], backup: null },
  40: { primary: ['D20'], backup: null },
  39: { primary: ['S7', 'D16'], backup: null },
  38: { primary: ['D19'], backup: null },
  37: { primary: ['S5', 'D16'], backup: null },
  36: { primary: ['D18'], backup: null },
  35: { primary: ['S3', 'D16'], backup: null },
  34: { primary: ['D17'], backup: null },
  33: { primary: ['S1', 'D16'], backup: null },
  32: { primary: ['D16'], backup: null },
  31: { primary: ['S15', 'D8'], backup: null },
  30: { primary: ['D15'], backup: null },
  29: { primary: ['S13', 'D8'], backup: null },
  28: { primary: ['D14'], backup: null },
  27: { primary: ['S11', 'D8'], backup: null },
  26: { primary: ['D13'], backup: null },
  25: { primary: ['S9', 'D8'], backup: null },
  24: { primary: ['D12'], backup: null },
  23: { primary: ['S7', 'D8'], backup: null },
  22: { primary: ['D11'], backup: null },
  21: { primary: ['S5', 'D8'], backup: null },
  20: { primary: ['D10'], backup: null },
  19: { primary: ['S3', 'D8'], backup: null },
  18: { primary: ['D9'], backup: null },
  17: { primary: ['S1', 'D8'], backup: null },
  16: { primary: ['D8'], backup: null },
  15: { primary: ['S7', 'D4'], backup: null },
  14: { primary: ['D7'], backup: null },
  13: { primary: ['S5', 'D4'], backup: null },
  12: { primary: ['D6'], backup: null },
  11: { primary: ['S3', 'D4'], backup: null },
  10: { primary: ['D5'], backup: null },
  9: { primary: ['S1', 'D4'], backup: null },
  8: { primary: ['D4'], backup: null },
  7: { primary: ['S3', 'D2'], backup: null },
  6: { primary: ['D3'], backup: null },
  5: { primary: ['S1', 'D2'], backup: null },
  4: { primary: ['D2'], backup: null },
  3: { primary: ['S1', 'D1'], backup: null },
  2: { primary: ['D1'], backup: null }
};

// Colour palette (matching ColourPickerPopup)
const PLAYER_COLOURS = [
  '#E94560', // Red (highlight)
  '#FF6B6B', // Coral red
  '#FFA500', // Orange
  '#FFD700', // Gold
  '#90EE90', // Light green
  '#4CAF50', // Green
  '#00CED1', // Turquoise
  '#1E90FF', // Dodger blue
  '#6A5ACD', // Slate blue
  '#9370DB', // Medium purple
  '#FF69B4', // Hot pink
  '#FF1493', // Deep pink
  '#C0C0C0', // Silver
  '#FFFFFF', // White
];

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Get a random colour from our predefined palette
export const getRandomColour = (): string => {
  return PLAYER_COLOURS[Math.floor(Math.random() * PLAYER_COLOURS.length)];
};

// Get a unique colour not used by any existing players
export const getUniquePlayerColour = (existingPlayers: Array<{colour: string}>): string => {
  // Get colours already in use
  const usedColours = new Set(existingPlayers.map(player => player.colour));
  
  // Find available colours
  const availableColours = PLAYER_COLOURS.filter(colour => !usedColours.has(colour));
  
  // If we have available colours, pick one randomly
  if (availableColours.length > 0) {
    return availableColours[Math.floor(Math.random() * availableColours.length)];
  }
  
  // If all colours are used, just cycle through them again
  return PLAYER_COLOURS[existingPlayers.length % PLAYER_COLOURS.length];
};

// Shuffle array (for randomizing player order)
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Function to calculate checkout suggestions for 501
export const getCheckoutSuggestions = (remainingScore: number, outMode: string, dartsRemaining: number = 3): string[] => {
  // Check for out of range scores
  if (remainingScore > 170) {
    return ["NO OUTSHOT"];
  }
  
  if (remainingScore <= 0) {
    return ["Game shot!"];
  }
  
  // Check for impossible checkouts with a double out
  if ((outMode === 'double' || outMode === 'master') && 
      (remainingScore === 169 || remainingScore === 168 || remainingScore === 166 || 
       remainingScore === 165 || remainingScore === 163 || remainingScore === 162 || 
       remainingScore === 159 || remainingScore === 1)) {
    return ["NO OUTSHOT"];
  }

  // Straight out mode (no double required to finish)
  if (outMode !== 'double' && outMode !== 'master') {
    if (remainingScore <= dartsRemaining * 60) { // Maximum possible score per dart
      // For straight out, we can just hit any combinations that add up to the score
      if (remainingScore <= 20 || remainingScore === 25 || remainingScore === 50) {
        // Direct checkout possible with one dart
        if (remainingScore === 25) return ["Outer"];
        if (remainingScore === 50) return ["Bull"];
        if (remainingScore <= 20) return [remainingScore.toString()];
      }
      // For multi-dart checkouts, use strategic targeting
      return getStrategicTarget(remainingScore, dartsRemaining);
    }
    return ["NO OUTSHOT"];
  }
  
  // Check if we have the checkout data for this score
  if (checkoutData[remainingScore]) {
    const suggestedCheckout = checkoutData[remainingScore];
    
    // If primary route says "NO OUTSHOT"
    if (suggestedCheckout.primary.length === 1 && suggestedCheckout.primary[0] === "NO OUTSHOT") {
      return ["NO OUTSHOT"];
    }
    
    // If we have enough darts for the complete checkout via primary route
    if (suggestedCheckout.primary.length <= dartsRemaining) {
      return suggestedCheckout.primary;
    }

    // If we have a backup route and exactly enough darts for it
    // This is for special cases when we have 1 or 2 darts remaining
    if (suggestedCheckout.backup && suggestedCheckout.backup.length === dartsRemaining) {
      return suggestedCheckout.backup;
    }
    
    // If we only have 1 or 2 darts left, check if backup route is better
    if (dartsRemaining < 3 && suggestedCheckout.backup && suggestedCheckout.backup.length <= dartsRemaining) {
      return suggestedCheckout.backup;
    }
    
    // If we don't have enough darts for the complete checkout,
    // but we have partial checkout data, show what we should aim for first
    if (dartsRemaining > 0 && dartsRemaining < suggestedCheckout.primary.length) {
      // Return just the first N darts where N is dartsRemaining
      return suggestedCheckout.primary.slice(0, dartsRemaining);
    }
  }
  
  // If we get here, either:
  // 1. We don't have checkout data for this score, or
  // 2. We don't have enough darts to complete the checkout
  
  // In either case, suggest a strategic target to set up for next turn
  return getStrategicTarget(remainingScore, dartsRemaining);
};

// Strategic target suggestions for when checkout isn't possible this turn
const getStrategicTarget = (remainingScore: number, dartsRemaining: number): string[] => {
  // For any score > 170 or when we don't have enough darts
  if (dartsRemaining === 1) {
    // With 1 dart left, try to leave a finish-able score for next turn
    if (remainingScore > 60) {
      // With scores over 60, aim for a big number to reduce the score
      return ["T20"];
    }
    // With scores under 60, aim to leave a nice finish
    if (remainingScore > 40 && remainingScore <= 60) {
      return [`${remainingScore - 40}`]; // Leave D20
    }
    return [`${remainingScore % 2 === 0 ? remainingScore / 2 : remainingScore - 32}`]; // Leave D16
  }
  
  if (dartsRemaining === 2) {
    if (remainingScore > 110) {
      // With scores over 110, aim for T20
      return ["T20"];
    }
    if (remainingScore > 70 && remainingScore <= 110) {
      // Try to set up a finish
      return ["T20", "T16"];
    }
    // Try to leave a common double
    return ["T19"];
  }
  
  // Default strategic targets for 3+ darts
  if (remainingScore > 180) {
    return ["T20"]; // Maximum score reduction
  }
  
  if (remainingScore > 130 && remainingScore <= 170) {
    // Within range but need all 3 darts
    return ["T20"]; // Start with T20
  }
  
  return ["T20"]; // Default to highest scoring dart
};

// Parse a dart notation to score value
export const dartNotationToScore = (notation: string): number => {
  if (!notation || notation === 'Miss') return 0;
  
  if (notation === 'Bull') return 50;
  if (notation === 'Outer') return 25;
  
  // Handle plain numbers (without prefix) first
  if (!isNaN(parseInt(notation, 10))) {
    return parseInt(notation, 10); // Just a number
  }
  
  const prefix = notation.charAt(0);
  const number = parseInt(notation.substring(1), 10);
  
  if (isNaN(number)) return 0;
  
  switch (prefix) {
    case 'S': return number; // Single
    case 'D': return number * 2; // Double
    case 'T': return number * 3; // Triple
    default:
      return 0;
  }
};

// Function to validate if a throw is valid
export const isThrowValid = (dartsThrown: string[]): boolean => {
  if (!dartsThrown || dartsThrown.length > 3) return false;
  
  // Check individual darts
  for (const dart of dartsThrown) {
    if (dart !== 'Miss' && dart !== 'Bull' && dart !== 'Outer') {
      const prefix = dart.charAt(0);
      const number = parseInt(dart.substring(1), 10);
      
      if (prefix === 'D' || prefix === 'T' || prefix === 'S') {
        // Valid prefix, now check number
        if (isNaN(number) || number < 1 || number > 20) return false;
      } else if (isNaN(parseInt(dart, 10)) || parseInt(dart, 10) < 1 || parseInt(dart, 10) > 20) {
        return false;
      }
    }
  }
  
  return true;
};

// Calculate the score from an array of dart notations
export const calculateScore = (dartsThrown: string[]): number => {
  return dartsThrown.reduce((total, dart) => total + dartNotationToScore(dart), 0);
};

// Function to validate if a score is valid
export const isScoreValid = (score: number): boolean => {
  // Maximum score with 3 darts is 180 (3 triple 20s)
  if (score < 0 || score > 180) {
    return false;
  }
  
  // Check if score is possible with darts
  if (score > 60) {
    // If > 60, need at least one triple
    return true; // We're simplifying here - a more complex validation would check specific number combinations
  }
  
  return true;
};

// Calculate player statistics
export const calculatePlayerStats = (player: Player): { 
  average: number; 
  highest: number;
  dartsThrown: number;
  checkoutPercentage: number;
  threeDartAverage: number;
  first9Average: number;
  checkoutsCompleted: number;
  checkoutsAttempted: number;
  highestFinish: number;
  bestLeg: number;
  worstLeg: number;
  lastScore: number;
} => {
  const { throws } = player;
  const dartsThrown = throws.flat().length;
  
  // Calculate total score from all darts
  const totalScore = throws.reduce((sum, turn) => {
    return sum + calculateScore(turn);
  }, 0);
  
  // Calculate 3 dart average (based on actual darts thrown)
  const threeDartAverage = dartsThrown > 0 ? (totalScore / dartsThrown) * 3 : 0;
  
  // Calculate average per throw (for backward compatibility)
  const turnCount = throws.length;
  const average = turnCount > 0 ? totalScore / turnCount : 0;
  
  // Calculate first 9 dart average (first 3 turns)
  const first9Darts = throws.slice(0, 3).flat();
  const first9Score = first9Darts.reduce((sum, dart) => sum + dartNotationToScore(dart), 0);
  const first9Average = first9Darts.length > 0 ? (first9Score / first9Darts.length) * 3 : 0;
  
  // Calculate highest throw (not just highest dart)
  const turnScores = throws.map(turn => calculateScore(turn));
  const highest = turnScores.length > 0 ? Math.max(...turnScores) : 0;
  
  // Get the last score (most recent throw)
  const lastScore = turnScores.length > 0 ? turnScores[turnScores.length - 1] : 0;
  
  // Checkouts statistics
  // In a real implementation, we'd track actual checkout attempts
  // For now, we'll estimate based on available data
  const checkoutsCompleted = player.checkoutsCompleted || 0;
  const checkoutsAttempted = player.checkoutAttempts || 0;
  const checkoutPercentage = checkoutsAttempted > 0 ? (checkoutsCompleted / checkoutsAttempted) * 100 : 0;
  
  // Highest finish (in a real app, you'd track the actual checkout value)
  const highestFinish = player.highestFinish || 0;
  
  // Leg statistics (in darts)
  const bestLeg = player.bestLeg || 0;
  const worstLeg = player.worstLeg || 0;
  
  return {
    average,
    highest,
    dartsThrown,
    checkoutPercentage,
    threeDartAverage,
    first9Average,
    checkoutsCompleted,
    checkoutsAttempted,
    highestFinish,
    bestLeg,
    worstLeg,
    lastScore
  };
};