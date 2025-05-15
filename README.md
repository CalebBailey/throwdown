# Throw Down - Darts Scoring App

Throw Down is a modern darts scoring application designed to enhance the experience of playing darts. With a clean, intuitive interface, Throw Down helps track scores, suggest checkouts, and manage player statistics for 501, 301, and 701 darts games.

## Features

- **Player Management**: Add, remove, and randomise player order
- **Game Modes**: Play standard 501, quick 301, or advanced 701 games
- **Game Options**: Configure double-in/out rules according to your preferences
- **Score Tracking**: Easy and fast score entry with validation
- **Checkout Suggestions**: Get recommendations for efficient checkouts
- **Game Statistics**: Track player averages, highest scores, and wins
- **Session Stats**: Keep track of wins across multiple games in a session
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- React 18+ with TypeScript
- Vite for fast development and optimised builds
- Styled Components for styling
- React Router for navigation
- Framer Motion for animations
- React Context API for state management

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/throwdown.git
   cd Throw Down
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Development

To start the development server:

```
npm run dev
```

This will start the application at `http://localhost:5173`

### Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Home Screen**: Start by adding players
2. **Player Setup**: Add player names and randomise the player order
3. **Game Hub**: Select a game type and configure game options
4. **Game**: Enter scores for each player's throw
5. **Summary**: View detailed game statistics after a winner is declared

## Project Structure

```
src/
├── assets/          # Images and static files
├── components/      # UI components
│   ├── home/        # Home screen components
│   ├── playerSetup/ # Player management components
│   ├── gameHub/     # Game selection components
│   ├── game501/     # 501 game implementation
│   ├── gameSummary/ # Game statistics and summary
│   └── shared/      # Shared UI components
├── context/         # React Context for state management
├── hooks/           # Custom React hooks
├── theme/           # Theme configuration
├── utils/           # Utility functions
├── App.tsx          # Main App component with routing
└── main.tsx         # Entry point
```

## License

[MIT License](LICENSE)

## Acknowledgments

- Design inspiration from modern gaming applications
- Built with a focus on user experience and performance
- Created for darts enthusiasts by darts enthusiasts
