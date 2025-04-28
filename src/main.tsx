import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { theme, GlobalStyle } from './theme/theme';
import { GameProvider } from './context/GameContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <GameProvider>
        <App />
      </GameProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
