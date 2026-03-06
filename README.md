# Subway Surfers Clone

A simple Subway Surfers clone game built with TypeScript and HTML5 Canvas.

## Features

- **3-lane runner gameplay** - Move between left, center, and right lanes
- **Jump and slide mechanics** - Avoid obstacles by jumping over or sliding under them
- **Coin collection** - Collect coins for bonus points
- **Progressive difficulty** - Game speed increases as you run further
- **Touch controls** - Swipe to move on mobile devices
- **Keyboard controls** - Arrow keys or WASD for desktop

## Controls

### Desktop
- **Left Arrow / A** - Move left
- **Right Arrow / D** - Move right
- **Up Arrow / W / Space** - Jump
- **Down Arrow / S** - Slide

### Mobile
- **Swipe Left** - Move left
- **Swipe Right** - Move right
- **Swipe Up** - Jump
- **Swipe Down** - Slide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the game:
```bash
npm run build
```

3. Open `index.html` in a browser or start a local server:
```bash
npm start
```

Then open http://localhost:8080 in your browser.

## Development

For hot-reloading during development:
```bash
npm run dev
```

## Project Structure

```
/workspace
├── src/
│   ├── entities/          # Game entities (Player, Obstacle, Coin)
│   │   ├── Player.ts      # Player character with movement and physics
│   │   ├── Obstacle.ts    # Different types of obstacles
│   │   ├── Coin.ts        # Collectible coins
│   │   └── index.ts       # Entity exports
│   ├── graphics/
│   │   └── Renderer.ts    # Canvas rendering system
│   ├── input/
│   │   └── InputHandler.ts # Keyboard and touch input handling
│   ├── physics/
│   │   └── CollisionSystem.ts # Collision detection
│   ├── world/
│   │   └── World.ts       # Game world management
│   ├── modes/
│   │   └── GameMode.ts    # Game mode definitions
│   ├── Game.ts            # Main game class
│   └── index.ts           # Entry point
├── index.html             # HTML template
├── package.json           # NPM configuration
├── tsconfig.json          # TypeScript configuration
└── webpack.config.js      # Webpack bundler configuration
```

## Game Mechanics

### Obstacles
- **Low Barrier** (orange) - Jump over it
- **High Barrier** (brown) - Slide under it
- **Train** (blue) - Avoid by changing lanes

### Scoring
- Distance traveled: +1 point per meter
- Coins collected: +10 points each

## License

MIT
