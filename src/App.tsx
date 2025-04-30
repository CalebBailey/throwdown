import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import HomeScreen from './components/home/HomeScreen';
import PlayerSetupScreen from './components/playerSetup/PlayerSetupScreen';
import GameHubScreen from './components/gameHub/GameHubScreen';
import Game501Screen from './components/game501/Game501Screen';
import GameSummaryScreen from './components/gameSummary/GameSummaryScreen';
import SplashScreen from './components/splash/SplashScreen';
import KillerGameScreen from './components/killer/KillerGameScreen';
import KillerGameSummaryScreen from './components/killer/summary/KillerGameSummaryScreen';
import { useGameContext } from './context/GameContext';

// Protected route component to check if we have players before allowing access
const GameProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { state } = useGameContext();
  
  // Navigate to player setup if there are no players
  if (state.players.length === 0) {
    return <Navigate to="/players" replace />;
  }
  
  return element;
};

// Protected route component to check if a game exists (either active or completed with winner)
const GameExistsRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { state } = useGameContext();
  
  // Navigate to game hub if there is no active game or completed game with winner
  if (state.gameStatus !== 'active' && !(state.gameStatus === 'complete' && state.winner)) {
    return <Navigate to="/games" replace />;
  }
  
  return element;
};

// Protected route component to check if we have a winner
const GameSummaryRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { state } = useGameContext();
  
  // Navigate to game hub if there is no winner
  if (!state.winner) {
    return <Navigate to="/games" replace />;
  }
  
  return element;
};

// Home route component that shows splash screen before HomeScreen
const HomeRouteWithSplash: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <HomeScreen />
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route with splash screen */}
        <Route path="/" element={<HomeRouteWithSplash />} />
        
        {/* Player Setup route */}
        <Route path="/players" element={<PlayerSetupScreen />} />
        
        {/* Game Hub route - requires players to exist */}
        <Route 
          path="/games" 
          element={<GameProtectedRoute element={<GameHubScreen />} />} 
        />
        
        {/* Game Routes - require an active game or complete game with winner */}
        <Route 
          path="/games/501" 
          element={<GameExistsRoute element={<Game501Screen />} />} 
        />
        
        {/* Backward compatibility for X01 route */}
        <Route 
          path="/games/X01" 
          element={<GameExistsRoute element={<Game501Screen />} />} 
        />
        
        {/* Killer Game Route */}
        <Route 
          path="/games/killer" 
          element={<GameExistsRoute element={<KillerGameScreen />} />} 
        />
        
        {/* Game Summary routes - requires a winner */}
        <Route 
          path="/summary" 
          element={<GameSummaryRoute element={<GameSummaryScreen />} />} 
        />
        
        {/* Killer Game Summary route - requires a winner */}
        <Route 
          path="/killer/summary" 
          element={<GameSummaryRoute element={<KillerGameSummaryScreen />} />} 
        />
        
        {/* Redirect any other paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
