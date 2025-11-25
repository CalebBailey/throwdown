import { createGlobalStyle } from 'styled-components';

// Colour palette from design brief
export const theme = {
  colours: {
    primary: '#1A1A2E',         // Dark blue base
    secondary: '#16213E',       // Slightly lighter blue
    accent: '#0F3460',          // Highlight blue
    highlight: '#d93232',       // Vibrant red for important elements d93232 , E94560
    lightHighlight: '#E94560',  // Lighter red for hover effects
    text: '#F5F5F5',            // Light for contrast
    background: 'linear-gradient(to bottom, #1A1A2E, #16213E)',
    darkText: '#333333',
    lightAccent: '#1F4B8E',
    error: '#FF4C4C',
    success: '#4CAF50',
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32'
  },
  fonts: {
    primary: "'Inter', sans-serif",
    headings: "'Montserrat', sans-serif",
    monospace: "'Roboto Mono', monospace"
  },
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',      // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    xxl: '1.5rem',   // 24px
    xxxl: '2rem',    // 32px
    huge: '2.5rem'   // 40px
  },
  space: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem'      // 48px
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    pill: '999px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 4px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
  }
};

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body, #root {
    height: 100%;
    font-size: 16px;
  }
  
  body {
    font-family: ${theme.fonts.primary};
    background: ${theme.colours.background};
    color: ${theme.colours.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.headings};
    font-weight: 700;
    margin-bottom: ${theme.space.md};
  }
  
  button, input, textarea, select {
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.md};
  }
  
  a {
    color: ${theme.colours.highlight};
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    
    &:hover {
      color: ${theme.colours.accent};
    }
  }
  
  button {
    cursor: pointer;
    border: none;
    background: none;
  }
  
  /* For numeric displays in the game */
  .number-display {
    font-family: ${theme.fonts.monospace};
  }
`;

export type Theme = typeof theme;

// Types for styled-components theme
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}