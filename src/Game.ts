import { Player } from './entities/Player';
import { Coin } from './entities/Coin';
import World from './world/World';
import Renderer from './graphics/Renderer';
import InputHandler from './input/InputHandler';
import CollisionSystem from './physics/CollisionSystem';

export enum GameState {
    MENU = 'menu',
    PLAYING = 'playing',
    GAME_OVER = 'game_over'
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private world: World;
    private renderer: Renderer;
    private inputHandler: InputHandler;
    private collisionSystem: CollisionSystem;
    private state: GameState = GameState.MENU;
    private score: number = 0;
    private coins: number = 0;
    private lastTime: number = 0;
    private gameSpeed: number = 5;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d')!;

        this.player = new Player();
        this.world = new World();
        this.renderer = new Renderer(this.canvas);
        this.inputHandler = new InputHandler(this.player);
        this.collisionSystem = new CollisionSystem();

        this.setupInputHandlers();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    private setupInputHandlers(): void {
        this.inputHandler.onJump = () => {
            if (this.state === GameState.MENU) this.startGame();
        };
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && this.state === GameState.GAME_OVER) this.restartGame();
        });
    }

    private startGame(): void {
        this.state = GameState.PLAYING;
        this.score = 0;
        this.coins = 0;
        this.gameSpeed = 5;
        this.world.reset();
        this.player = new Player();
        this.inputHandler = new InputHandler(this.player);
        this.setupInputHandlers();
    }

    private restartGame(): void { this.startGame(); }

    private gameLoop(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.update(deltaTime);
        this.render();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    private update(deltaTime: number): void {
        if (this.state !== GameState.PLAYING) return;
        this.player.update(deltaTime);
        this.world.update(deltaTime, this.gameSpeed);
        
        const collisions = this.collisionSystem.checkCollisions(this.player, this.world.getObstacles(), this.world.getCoins());
        for (const c of collisions) {
            if (c.type === 'obstacle') {
                this.state = GameState.GAME_OVER;
            } else if (c.type === 'coin') {
                this.coins++;
                this.score += 10;
                this.world.removeCoin((c.object as Coin).id);
            }
        }
        this.score += Math.floor(this.gameSpeed * deltaTime);
        this.gameSpeed += 0.001;
    }

    private render(): void {
        this.renderer.render(this.state, this.player, this.world, this.score, this.coins);
    }

    public getState(): GameState { return this.state; }
    public getScore(): number { return this.score; }
    public getCoins(): number { return this.coins; }
}

export default Game;
