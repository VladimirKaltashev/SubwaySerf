// Game.ts - Основной класс игры Subway Surfers

import { Player, Lane } from './entities/Player';
import { Obstacle } from './entities/Obstacle';
import { Coin } from './entities/Coin';
import { World } from './world/World';
import { Renderer } from './graphics/Renderer';
import { InputHandler } from './input/InputHandler';
import CollisionSystem from './physics/CollisionSystem';

export enum GameState {
    MENU = 'menu',
    PLAYING = 'playing',
    GAME_OVER = 'game_over'
}

class Game {
    private player: Player;
    private world: World;
    private renderer: Renderer;
    private inputHandler: InputHandler;
    private collisionSystem: CollisionSystem;
    
    private gameState: GameState;
    private score: number;
    private coins: number;
    private isRunning: boolean;
    private lastTime: number;
    private groundY: number;

    constructor(canvasId: string = 'gameCanvas') {
        this.groundY = 500;
        this.player = new Player(this.groundY);
        this.world = new World(this.groundY);
        this.renderer = new Renderer(canvasId);
        this.inputHandler = new InputHandler();
        this.collisionSystem = CollisionSystem.getInstance();
        
        this.gameState = GameState.MENU;
        this.score = 0;
        this.coins = 0;
        this.isRunning = false;
        this.lastTime = 0;

        this.setupInputHandlers();
        this.setupTouchControls();
    }

    private setupInputHandlers(): void {
        this.inputHandler.onMoveLeft = () => {
            if (this.gameState === GameState.PLAYING) {
                this.player.moveLeft();
            }
        };

        this.inputHandler.onMoveRight = () => {
            if (this.gameState === GameState.PLAYING) {
                this.player.moveRight();
            }
        };

        this.inputHandler.onJump = () => {
            if (this.gameState === GameState.PLAYING) {
                this.player.jump();
            } else if (this.gameState === GameState.GAME_OVER) {
                this.restart();
            } else if (this.gameState === GameState.MENU) {
                this.start();
            }
        };

        this.inputHandler.onSlide = () => {
            if (this.gameState === GameState.PLAYING) {
                this.player.slide();
            }
        };

        // Обработка перезапуска по пробелу
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameState === GameState.GAME_OVER) {
                this.restart();
            } else if (e.code === 'Space' && this.gameState === GameState.MENU) {
                this.start();
            }
        });
    }

    private setupTouchControls(): void {
        this.inputHandler.setupTouchControls(this.renderer.canvas);
    }

    public start(): void {
        this.gameState = GameState.PLAYING;
        this.score = 0;
        this.coins = 0;
        this.player.reset(this.groundY);
        this.world.reset();
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    public restart(): void {
        this.start();
    }

    public gameOver(): void {
        this.gameState = GameState.GAME_OVER;
        this.isRunning = false;
    }

    private update(deltaTime: number): void {
        if (this.gameState !== GameState.PLAYING) return;

        // Обновление игрока
        this.player.update();

        // Обновление мира
        this.world.update();

        // Увеличение счета за дистанцию
        this.score += this.world.speed * 0.01;

        // Проверка коллизий
        const obstacles = this.world.getObstacles();
        const coins = this.world.getCoins();

        const collisionResult = this.collisionSystem.checkAllCollisions(
            this.player,
            obstacles,
            coins
        );

        // Обработка столкновения с препятствием
        if (collisionResult.hitObstacle) {
            this.gameOver();
            return;
        }

        // Сбор монет
        for (const coinIndex of collisionResult.collectedCoins.reverse()) {
            if (!coins[coinIndex].collected) {
                coins[coinIndex].collected = true;
                this.player.collectCoin();
                this.coins++;
            }
        }
    }

    private render(): void {
        // Очистка и отрисовка фона
        this.renderer.clear();

        // Отрисовка монет
        for (const coin of this.world.getCoins()) {
            if (!coin.collected) {
                this.renderer.drawCoin(coin);
            }
        }

        // Отрисовка препятствий
        for (const obstacle of this.world.getObstacles()) {
            this.renderer.drawObstacle(obstacle);
        }

        // Отрисовка игрока
        this.renderer.drawPlayer(this.player);

        // Отрисовка UI
        this.renderer.drawUI(
            this.score + this.world.distance,
            this.coins,
            this.world.distance
        );

        // Отрисовка Game Over экрана
        if (this.gameState === GameState.GAME_OVER) {
            this.renderer.drawGameOver(this.score + this.world.distance);
        }

        // Отрисовка меню
        if (this.gameState === GameState.MENU) {
            this.drawMenu();
        }
    }

    private drawMenu(): void {
        const ctx = this.renderer.context;
        const width = this.renderer.width;
        const height = this.renderer.height;

        // Полупрозрачный фон
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);

        // Заголовок
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SUBWAY SURFERS', width / 2, height / 2 - 100);

        // Инструкция
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.fillText('Controls:', width / 2, height / 2);
        
        ctx.font = '18px Arial';
        ctx.fillText('Arrow Keys / WASD - Move, Jump, Slide', width / 2, height / 2 + 40);
        ctx.fillText('Touch - Swipe to move', width / 2, height / 2 + 70);

        // Кнопка старта
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(width / 2 - 100, height / 2 + 100, 200, 50);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Press SPACE to Start', width / 2, height / 2 + 135);
    }

    private gameLoop(currentTime: number = 0): void {
        if (!this.isRunning && this.gameState !== GameState.MENU) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        if (this.isRunning || this.gameState === GameState.MENU) {
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    public init(): void {
        // Начальная отрисовка меню
        this.gameState = GameState.MENU;
        this.render();
        
        // Запуск цикла для обработки меню
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getWorld(): World {
        return this.world;
    }

    public getGameState(): GameState {
        return this.gameState;
    }
}

export default Game;
