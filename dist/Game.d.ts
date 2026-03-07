import Player from './entities/Player';
import World from './world/World';
export declare enum GameState {
    MENU = "menu",
    PLAYING = "playing",
    GAME_OVER = "game_over"
}
declare class Game {
    private player;
    private world;
    private renderer;
    private inputHandler;
    private collisionSystem;
    private gameState;
    private score;
    private coins;
    private isRunning;
    private lastTime;
    private groundY;
    constructor(canvasId?: string);
    private setupInputHandlers;
    private setupTouchControls;
    start(): void;
    restart(): void;
    gameOver(): void;
    private update;
    private render;
    private drawMenu;
    private gameLoop;
    init(): void;
    getPlayer(): Player;
    getWorld(): World;
    getGameState(): GameState;
}
export default Game;
//# sourceMappingURL=Game.d.ts.map