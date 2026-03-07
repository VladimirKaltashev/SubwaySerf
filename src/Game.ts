import { Player, Lane } from './entities/Player';
import { Obstacle, ObstacleType } from './entities/Obstacle';
import { Coin } from './entities/Coin';
import { World } from './world/World';
import { Renderer } from './graphics/Renderer';
import { InputHandler, InputAction } from './input/InputHandler';
import { CollisionSystem } from './physics/CollisionSystem';

export enum GameState {
  MENU,
  PLAYING,
  GAME_OVER
}

export interface IGame {
  start(): void;
  stop(): void;
  reset(): void;
  update(deltaTime: number): void;
  render(): void;
}

export class Game implements IGame {
  private state: GameState = GameState.MENU;
  private score: number = 0;
  private coins: number = 0;
  private speed: number = 10;
  private lastTime: number = 0;
  
  private player: Player;
  private world: World;
  private renderer: Renderer;
  private inputHandler: InputHandler;
  private collisionSystem: CollisionSystem;
  
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Инициализация компонентов
    this.player = new Player(3, 0); // laneWidth = 3, centerX = 0
    this.world = new World();
    this.renderer = new Renderer(this.canvas);
    this.inputHandler = new InputHandler();
    this.collisionSystem = new CollisionSystem();
    
    this.setupInputHandlers();
    this.inputHandler.setupTouchControls(this.canvas);
  }
  
  private resizeCanvas(): void {
    this.canvas.width = 800;
    this.canvas.height = 600;
  }
  
  private setupInputHandlers(): void {
    this.inputHandler.onMoveLeft = () => {
      if (this.state === GameState.PLAYING) {
        this.player.changeLane(-1);
      }
    };
    
    this.inputHandler.onMoveRight = () => {
      if (this.state === GameState.PLAYING) {
        this.player.changeLane(1);
      }
    };
    
    this.inputHandler.onJump = () => {
      if (this.state === GameState.PLAYING) {
        this.player.jump();
      } else if (this.state === GameState.MENU) {
        this.start();
      } else if (this.state === GameState.GAME_OVER) {
        this.reset();
        this.start();
      }
    };
    
    this.inputHandler.onRoll = () => {
      if (this.state === GameState.PLAYING) {
        this.player.roll();
      }
    };
  }
  
  start(): void {
    this.state = GameState.PLAYING;
    this.lastTime = performance.now();
    this.gameLoop();
  }
  
  stop(): void {
    this.state = GameState.GAME_OVER;
  }
  
  reset(): void {
    this.player = new Player(3, 0);
    this.world = new World();
    this.score = 0;
    this.coins = 0;
    this.speed = 10;
    this.state = GameState.MENU;
  }
  
  private gameLoop(): void {
    if (this.state !== GameState.PLAYING) return;
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  update(deltaTime: number): void {
    // Обновляем игрока
    this.player.update(deltaTime);
    
    // Обновляем мир (спавн препятствий и монет)
    this.world.update(deltaTime, this.player.z, this.speed);
    
    // Проверка коллизий
    const obstacles = this.world.getObstacles();
    const coins = this.world.getCoins();
    
    for (const obstacle of obstacles) {
      if (this.collisionSystem.checkPlayerObstacle(this.player, obstacle)) {
        this.stop();
        return;
      }
    }
    
    for (const coin of coins) {
      if (this.collisionSystem.checkPlayerCoin(this.player, coin)) {
        coin.collect();
        this.coins++;
        this.score += 10;
      }
    }
    
    // Увеличиваем скорость и счет
    this.speed += 0.1 * deltaTime;
    this.score += Math.floor(10 * deltaTime);
  }
  
  render(): void {
    // Очистка
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Рендер мира
    this.renderer.renderWorld(this.world, this.player.z);
    
    // Рендер игрока
    this.renderer.renderPlayer(this.player);
    
    // Рендер препятствий и монет
    this.renderer.renderObstacles(this.world.getObstacles(), this.player.z);
    this.renderer.renderCoins(this.world.getCoins(), this.player.z);
    
    // UI
    this.renderer.renderUI(this.score, this.coins);
    
    // Меню или Game Over
    if (this.state === GameState.MENU) {
      this.renderer.renderMenu();
    } else if (this.state === GameState.GAME_OVER) {
      this.renderer.renderGameOver(this.score, this.coins);
    }
  }
}
