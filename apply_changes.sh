#!/bin/bash

# Скрипт применения изменений для Subway Surfers clone
# Исправляет инверсию управления и переименовывает slide -> roll

echo "🚀 Применяем изменения к проекту Subway Surfers..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Запустите скрипт из корня проекта."
    exit 1
fi

# 1. Обновляем src/entities/Player.ts
echo "📝 Обновляем src/entities/Player.ts..."
cat > src/entities/Player.ts << 'EOF'
export enum Lane {
  LEFT = -2,
  CENTER_LEFT = -1,
  CENTER = 0,
  CENTER_RIGHT = 1,
  RIGHT = 2
}

export interface IPlayer {
  lane: Lane;
  x: number;
  y: number;
  z: number;
  isJumping: boolean;
  isRolling: boolean;
  width: number;
  height: number;
  depth: number;
  
  changeLane(direction: number): void;
  jump(): void;
  roll(): void;
  update(deltaTime: number): void;
  getLaneX(lane: Lane): number;
}

export class Player implements IPlayer {
  private _lane: Lane = Lane.CENTER;
  private _y: number = 0;
  private _z: number = 0;
  private _isJumping: boolean = false;
  private _isRolling: boolean = false;
  
  private verticalVelocity: number = 0;
  private rollTimer: number = 0;
  
  private readonly gravity: number = -30;
  private readonly jumpForce: number = 15;
  private readonly rollDuration: number = 0.8;
  private readonly normalHeight: number = 2;
  private readonly rollHeight: number = 1;
  
  constructor(
    private laneWidth: number = 3,
    private startX: number = 0
  ) {}
  
  get lane(): Lane {
    return this._lane;
  }
  
  get x(): number {
    return this.getLaneX(this._lane);
  }
  
  get y(): number {
    return this._y;
  }
  
  get z(): number {
    return this._z;
  }
  
  get isJumping(): boolean {
    return this._isJumping;
  }
  
  get isRolling(): boolean {
    return this._isRolling;
  }
  
  get width(): number {
    return 1.5;
  }
  
  get height(): number {
    return this._isRolling ? this.rollHeight : this.normalHeight;
  }
  
  get depth(): number {
    return 1.5;
  }
  
  getLaneX(lane: Lane): number {
    return this.startX + lane * this.laneWidth;
  }
  
  changeLane(direction: number): void {
    const newLane = this._lane + direction;
    if (newLane >= Lane.LEFT && newLane <= Lane.RIGHT) {
      this._lane = newLane;
    }
  }
  
  jump(): void {
    if (!this._isJumping) {
      this.verticalVelocity = this.jumpForce;
      this._isJumping = true;
      
      // Если был в приседе, встаем
      if (this._isRolling) {
        this._isRolling = false;
        this._y = this.normalHeight / 2;
      }
    }
  }
  
  roll(): void {
    if (!this._isRolling && !this._isJumping) {
      this._isRolling = true;
      this.rollTimer = this.rollDuration;
      this._y = this.rollHeight / 2;
    }
  }
  
  update(deltaTime: number): void {
    // Обновляем таймер приседа
    if (this._isRolling) {
      this.rollTimer -= deltaTime;
      if (this.rollTimer <= 0) {
        this._isRolling = false;
        if (!this._isJumping) {
          this._y = this.normalHeight / 2;
        }
      }
    }
    
    // Физика прыжка
    if (this._isJumping) {
      this._y += this.verticalVelocity * deltaTime;
      this.verticalVelocity += this.gravity * deltaTime;
      
      const minHeight = this._isRolling ? this.rollHeight / 2 : this.normalHeight / 2;
      
      if (this._y <= minHeight) {
        this._y = minHeight;
        this._isJumping = false;
        this.verticalVelocity = 0;
        
        // Если закончили прыжок и не в приседе, возвращаем нормальную высоту
        if (!this._isRolling) {
          this._y = this.normalHeight / 2;
        }
      }
    } else if (!this._isRolling) {
      this._y = this.normalHeight / 2;
    }
    
    // Движение вперед
    this._z += 10 * deltaTime;
  }
}
EOF

# 2. Обновляем src/input/InputHandler.ts
echo "📝 Обновляем src/input/InputHandler.ts..."
cat > src/input/InputHandler.ts << 'EOF'
export enum InputAction {
  MOVE_LEFT,
  MOVE_RIGHT,
  JUMP,
  ROLL
}

export interface IInputHandler {
  onMoveLeft: (() => void) | null;
  onMoveRight: (() => void) | null;
  onJump: (() => void) | null;
  onRoll: (() => void) | null;
  
  handleKey(key: string, isPressed: boolean): void;
  setupTouchControls(canvas: HTMLCanvasElement): void;
}

export class InputHandler implements IInputHandler {
  onMoveLeft: (() => void) | null = null;
  onMoveRight: (() => void) | null = null;
  onJump: (() => void) | null = null;
  onRoll: (() => void) | null = null;
  
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  
  constructor() {
    this.setupKeyboardListeners();
  }
  
  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.handleKey(e.code, true);
    });
    
    window.addEventListener('keyup', (e) => {
      this.handleKey(e.code, false);
    });
  }
  
  handleKey(key: string, isPressed: boolean): void {
    if (!isPressed) return;
    
    switch (key) {
      case 'ArrowLeft':
      case 'KeyA':
        if (this.onMoveLeft) this.onMoveLeft();
        break;
        
      case 'ArrowRight':
      case 'KeyD':
        if (this.onMoveRight) this.onMoveRight();
        break;
        
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        if (this.onJump) this.onJump();
        break;
        
      case 'ArrowDown':
      case 'KeyS':
        if (this.onRoll) this.onRoll();
        break;
    }
  }
  
  setupTouchControls(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      
      const minSwipeDistance = 30;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Горизонтальный свайп
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            if (this.onMoveRight) this.onMoveRight();
          } else {
            if (this.onMoveLeft) this.onMoveLeft();
          }
        }
      } else {
        // Вертикальный свайп
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY < 0) {
            if (this.onJump) this.onJump();
          } else {
            if (this.onRoll) this.onRoll();
          }
        }
      }
    }, { passive: false });
  }
}
EOF

# 3. Обновляем src/Game.ts
echo "📝 Обновляем src/Game.ts..."
cat > src/Game.ts << 'EOF'
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
EOF

# 4. Делаем git add, commit, push
echo "🔄 Добавляем изменения в git..."
git add .

echo "💾 Создаем коммит..."
git commit -m "fix: Исправлено управление полосами и переименовано slide -> roll

- Изменен enum Lane с 0-4 на -2..2 для корректной работы с 5 полосами
- Упрощена формула расчета X позиции игрока
- Переименованы методы и свойства slide -> roll
- Исправлена инверсия управления стрелками влево/вправо
- Обновлен InputHandler для вызова onRoll вместо onSlide"

echo "📤 Отправляем изменения на GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Изменения успешно отправлены!"
    echo ""
    echo "🔗 Создайте Pull Request по ссылке:"
    echo "https://github.com/VladimirKaltashev/SubwaySerf/pulls"
    echo ""
    echo "Или перейдите в репозиторий и нажмите 'Compare & pull request'"
else
    echo ""
    echo "⚠️ Не удалось отправить изменения. Проверьте настройки git remote."
    echo "Выполните: git remote add origin https://github.com/VladimirKaltashev/SubwaySerf.git"
    echo "Затем запустите скрипт снова."
fi

echo ""
echo "🎉 Готово!"
