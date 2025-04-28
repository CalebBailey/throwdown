import { Player } from '../context/GameContext';

// Checkout data from checkouts.txt
const checkoutData: Record<number, string[]> = {
  2: ['D1'],
  3: ['1', 'D1'],
  4: ['D2'],
  5: ['3', 'D1'],
  6: ['D3'],
  7: ['5', 'D1'],
  8: ['D4'],
  9: ['5', 'D2'],
  10: ['D5'],
  11: ['3', 'D4'],
  12: ['D6'],
  13: ['3', 'D5'],
  14: ['D7'],
  15: ['3', 'D6'],
  16: ['D8'],
  17: ['3', 'D7'],
  18: ['D9'],
  19: ['3', 'D8'],
  20: ['D10'],
  21: ['1', 'D10'],
  22: ['D11'],
  23: ['5', 'D9'],
  24: ['D12'],
  25: ['3', 'D11'],
  26: ['D13'],
  27: ['3', 'D12'],
  28: ['D14'],
  29: ['1', 'D14'],
  30: ['D15'],
  31: ['3', 'D14'],
  32: ['D16'],
  33: ['3', 'D15'],
  34: ['D17'],
  35: ['7', 'D14'],
  36: ['D18'],
  37: ['5', 'D16'],
  38: ['D19'],
  39: ['1', 'D19'],
  40: ['D20'],
  41: ['3', 'D19'],
  42: ['4', 'D19'],
  43: ['5', 'D19'],
  44: ['6', 'D19'],
  45: ['7', 'D19'],
  46: ['8', 'D19'],
  47: ['9', 'D19'],
  48: ['10', 'D19'],
  49: ['11', 'D19'],
  50: ['12', 'D19'],
  51: ['13', 'D19'],
  52: ['12', 'D20'],
  53: ['15', 'D19'],
  54: ['14', 'D20'],
  55: ['15', 'D20'],
  56: ['16', 'D20'],
  57: ['17', 'D20'],
  58: ['18', 'D20'],
  59: ['19', 'D20'],
  60: ['20', 'D20'],
  61: ['3', '20', 'D19'],
  62: ['16', '8', 'D19'],
  63: ['14', '9', 'D20'],
  64: ['9', '15', 'D20'],
  65: ['7', '18', 'D20'],
  66: ['6', '20', 'D20'],
  67: ['13', '16', 'D19'],
  68: ['11', '19', 'D19'],
  69: ['10', '19', 'D20'],
  70: ['10', '20', 'D20'],
  71: ['14', '19', 'D19'],
  72: ['18', '16', 'D19'],
  73: ['17', '18', 'D19'],
  74: ['16', '18', 'D20'],
  75: ['15', '20', 'D20'],
  76: ['20', '16', 'D20'],
  77: ['17', '20', 'D20'],
  78: ['18', '20', 'D20'],
  79: ['19', '20', 'D20'],
  80: ['20', '20', 'D20'],
  81: ['D19', '3', 'D20'],
  82: ['D19', '4', 'D20'],
  83: ['5', 'D20', 'D19'],
  84: ['6', 'D20', 'D19'],
  85: ['7', 'D19', 'D20'],
  86: ['D20', '8', 'D19'],
  87: ['9', 'D19', 'D20'],
  88: ['D20', '10', 'D19'],
  89: ['11', 'D19', 'D20'],
  90: ['12', 'D19', 'D20'],
  91: ['13', 'D19', 'D20'],
  92: ['D19', '14', 'D20'],
  93: ['15', 'D19', 'D20'],
  94: ['16', 'D20', 'D19'],
  95: ['17', 'D20', 'D19'],
  96: ['D20', '18', 'D19'],
  97: ['19', 'D20', 'D19'],
  98: ['D20', '20', 'D19'],
  99: ['19', 'D20', 'D20'],
  100: ['20', 'D20', 'D20'],
  101: ['6', 'T19', 'D19'],
  102: ['D20', 'D12', 'D19'],
  103: ['5', 'T20', 'D19'],
  104: ['9', 'T19', 'D19'],
  105: ['T20', '5', 'D20'],
  106: ['D14', 'D19', 'D20'],
  107: ['T19', '12', 'D19'],
  108: ['D19', 'D20', 'D15'],
  109: ['T20', '9', 'D20'],
  110: ['T19', '13', 'D20'],
  111: ['16', 'T19', 'D19'],
  112: ['D19', 'D20', 'D17'],
  113: ['T19', '18', 'D19'],
  114: ['T19', '19', 'D19'],
  115: ['T19', '18', 'D20'],
  116: ['16', 'T20', 'D20'],
  117: ['19', 'T20', 'D19'],
  118: ['18', 'T20', 'D20'],
  119: ['19', 'T20', 'D20'],
  120: ['T20', '20', 'D20'],
  121: ['T19', 'D19', 'D13'],
  122: ['D20', 'T20', 'D11'],
  123: ['T19', 'D19', 'D14'],
  124: ['D20', 'T20', 'D12'],
  125: ['D15', 'T19', 'D19'],
  126: ['T20', 'D19', 'D14'],
  127: ['D15', 'T19', 'D20'],
  128: ['D15', 'T20', 'D19'],
  129: ['D17', 'T19', 'D19'],
  130: ['T20', 'D15', 'D20'],
  131: ['T19', 'D17', 'D20'],
  132: ['T20', 'D17', 'D19'],
  133: ['D18', 'T19', 'D20'],
  134: ['D18', 'T20', 'D19'],
  135: ['T19', 'D20', 'D19'],
  136: ['D18', 'T20', 'D20'],
  137: ['T19', 'D20', 'D20'],
  138: ['T20', 'D19', 'D20'],
  139: ['T19', 'T14', 'D20'],
  140: ['T20', 'D20', 'D20'],
  141: ['T19', 'T20', 'D12'],
  142: ['T20', 'T14', 'D20'],
  143: ['T15', 'T20', 'D19'],
  144: ['T20', 'T18', 'D15'],
  145: ['T15', 'T20', 'D20'],
  146: ['T16', 'T20', 'D19'],
  147: ['T20', 'T19', 'D15'],
  148: ['T20', 'T16', 'D20'],
  149: ['T20', 'T19', 'D16'],
  150: ['T20', 'T18', 'D18'],
  151: ['T20', 'T19', 'D17'],
  152: ['T20', 'T18', 'D19'],
  153: ['T20', 'T19', 'D18'],
  154: ['T20', 'T18', 'D20'],
  155: ['T20', 'T19', 'D19'],
  156: ['T20', 'T20', 'D18'],
  157: ['T20', 'T19', 'D20'],
  158: ['T20', 'T20', 'D19'],
  159: ['No checkout'],
  160: ['T20', 'T20', 'D20'],
  161: ['T20', 'T17', 'Bull'],
  162: ['No checkout'],
  163: ['No checkout'],
  164: ['T20', 'T18', 'Bull'],
  165: ['No checkout'],
  166: ['No checkout'],
  167: ['T20', 'T19', 'Bull'],
  168: ['No checkout'],
  169: ['No checkout'],
  170: ['T20', 'T20', 'Bull']
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Get a random color from our predefined palette
export const getRandomColor = (): string => {
  const colors = [
    '#E94560', // Red
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FFEB3B', // Yellow
    '#795548', // Brown
  ];
  return colors[Math.floor(Math.random() * colors.length)];
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
export const getCheckoutSuggestions = (remainingScore: number, outMode: string): string[] => {
  if (remainingScore > 170) {
    return ['No checkout available yet'];
  }
  
  if (remainingScore <= 0) {
    return ['Game shot!'];
  }
  
  // Double out is required
  const doubleOutRequired = outMode === 'double' || outMode === 'master';
  
  // Handle cases where no checkout is possible (e.g., score of 1, 159, etc.)
  if (remainingScore === 1 || remainingScore === 159 || remainingScore === 162 || 
      remainingScore === 163 || remainingScore === 165 || remainingScore === 166 || 
      remainingScore === 168 || remainingScore === 169 || !doubleOutRequired) {
    return ['No checkout'];
  }
  
  // Use our detailed checkout data
  if (checkoutData[remainingScore]) {
    return checkoutData[remainingScore];
  }
  
  // For any score not in our table but still potentially checkout-able
  if (doubleOutRequired) {
    if (remainingScore % 2 === 1) {
      // Odd number with double out required
      return ['Odd number - not possible'];
    } else {
      // Even number
      if (remainingScore <= 40) {
        return [`D${remainingScore / 2}`];
      } else {
        return ['Try to leave a known checkout'];
      }
    }
  } else {
    // No double out required
    return ['Reduce to a smaller number'];
  }
};

// Parse a dart notation to score value
export const dartNotationToScore = (notation: string): number => {
  if (!notation || notation === 'Miss') return 0;
  
  if (notation === 'Bull') return 50;
  if (notation === 'Outer') return 25;
  
  const prefix = notation.charAt(0);
  const number = parseInt(notation.substring(1), 10);
  
  if (isNaN(number)) return 0;
  
  switch (prefix) {
    case 'S': return number; // Single
    case 'D': return number * 2; // Double
    case 'T': return number * 3; // Triple
    default:
      if (!isNaN(parseInt(notation, 10))) {
        return parseInt(notation, 10); // Just a number
      }
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
} => {
  const allThrows = player.throws.flat();
  const dartsThrown = allThrows.length;
  
  const average = dartsThrown > 0
    ? allThrows.reduce((sum, score) => sum + Number(score), 0) / dartsThrown
    : 0;
    
  const highest = dartsThrown > 0 
    ? Math.max(...allThrows.map(Number))
    : 0;
  
  // This is simplified - in a real app, you'd track checkout attempts
  const checkoutPercentage = 0;
  
  return {
    average,
    highest,
    dartsThrown,
    checkoutPercentage
  };
};