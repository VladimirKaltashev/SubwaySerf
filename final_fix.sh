#!/bin/bash
echo "🔧 Полное восстановление файлов..."

# 1. Player.ts (полный, рабочий)
cat > src/entities/Player.ts << 'EOF'
export enum Lane {
    LEFT_FAR = -2,
    LEFT = -1,
    CENTER = 0,
    RIGHT = 1,
    RIGHT_FAR = 2
}

export enum PlayerState {
    RUNNING = 'running',
    JUMPING = 'jumping',
    ROLLING = 'rolling'
}

export class Player {
    private lane: Lane = Lane.CENTER;
    private state: PlayerState = PlayerState.RUNNING;
    private yPosition: number = 0;
    private verticalVelocity: number = 0;
    private rollTimer: number = 0;

    private readonly JUMP_FORCE = 15;
    private readonly GRAVITY = -40;
    private readonly ROLL_DURATION = 0.6;

    public update(deltaTime: number): void {
        if (this.state === PlayerState.JUMPING) {
            this.yPosition += this.verticalVelocity * deltaTime;
            this.verticalVelocity += this.GRAVITY * deltaTime;
            if (this.yPosition <= 0) {
                this.yPosition = 0;
                this.verticalVelocity = 0;
                this.state = PlayerState.RUNNING;
            }
        }
        if (this.state === PlayerState.ROLLING) {
            this.rollTimer -= deltaTime;
            if (this.rollTimer <= 0) this.state = PlayerState.RUNNING;
        }
    }

    public jump(): void {
        if (this.state !== PlayerState.JUMPING) {
            this.verticalVelocity = this.JUMP_FORCE;
            this.state = PlayerState.JUMPING;
        }
    }

    public roll(): void {
        if (this.state === PlayerState.JUMPING) {
            this.verticalVelocity = -this.JUMP_FORCE;
        } else if (this.state !== PlayerState.ROLLING) {
            this.state = PlayerState.ROLLING;
            this.rollTimer = this.ROLL_DURATION;
        }
    }

    public slide(direction: 'left' | 'right', far: boolean = false): void {
        const change = far ? 2 : 1;
        const newLane = direction === 'left' ? this.lane - change : this.lane + change;
        if (newLane >= Lane.LEFT_FAR && newLane <= Lane.RIGHT_FAR) {
            this.lane = newLane as Lane;
        }
    }

    public getLane(): Lane { return this.lane; }
    public getState(): PlayerState { return this.state; }
    public getYPosition(): number { return this.yPosition; }
    public isRolling(): boolean { return this.state === PlayerState.ROLLING; }
    public isJumping(): boolean { return this.state === PlayerState.JUMPING; }
    
    // Геттеры для совместимости
    public get x(): number { return this.lane * 100; }
    public get y(): number { return this.yPosition; }
    public get width(): number { return this.isRolling() ? 80 : 100; }
    public get height(): number { return this.isRolling() ? 50 : 100; }
}

export default Player;
EOF

# 2. InputHandler.ts
cat > src/input/InputHandler.ts << 'EOF'
import Player from '../entities/Player';

export enum InputAction {
    MOVE_LEFT = 'move_left',
    MOVE_RIGHT = 'move_right',
    JUMP = 'jump',
    ROLL = 'roll'
}

export class InputHandler {
    private player: Player;
    public onMoveLeft?: () => void;
    public onMoveRight?: () => void;
    public onJump?: () => void;
    public onRoll?: () => void;

    constructor(player: Player) {
        this.player = player;
        this.setupKeyboard();
        this.setupTouch();
    }

    private setupKeyboard(): void {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.player.slide('left', e.key === 'a' || e.key === 'A');
                    this.onMoveLeft?.();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.player.slide('right', e.key === 'd' || e.key === 'D');
                    this.onMoveRight?.();
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                case ' ':
                    this.player.jump();
                    this.onJump?.();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.player.roll();
                    this.onRoll?.();
                    break;
            }
        });
    }

    private setupTouch(): void {
        let startX = 0, startY = 0;
        document.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        document.addEventListener('touchend', e => {
            const diffX = e.changedTouches[0].clientX - startX;
            const diffY = e.changedTouches[0].clientY - startY;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 30) { this.player.slide('right'); this.onMoveRight?.(); }
                else if (diffX < -30) { this.player.slide('left'); this.onMoveLeft?.(); }
            } else {
                if (diffY < -30) { this.player.jump(); this.onJump?.(); }
                else if (diffY > 30) { this.player.roll(); this.onRoll?.(); }
            }
        });
    }
}

export default InputHandler;
EOF

# 3. World.ts (полностью переписан)
cat > src/world/World.ts << 'EOF'
import Obstacle, { ObstacleType } from '../entities/Obstacle';
import Coin from '../entities/Coin';

export class World {
    private speed: number = 5;
    private distance: number = 0;
    private obstacles: Obstacle[] = [];
    private coins: Coin[] = [];
    private spawnTimer: number = 0;
    private coinSpawnTimer: number = 0;
    private difficultyMultiplier: number = 1;
    private groundY: number = 400;

    constructor(groundY: number = 400) {
        this.groundY = groundY;
    }

    public update(deltaTime: number, speed: number): void {
        this.speed = speed;
        this.distance += this.speed * deltaTime;
        this.difficultyMultiplier = 1 + (this.distance / 10000);

        this.spawnTimer -= deltaTime;
        this.coinSpawnTimer -= deltaTime;

        if (this.spawnTimer <= 0) {
            this.spawnObstacle();
            this.spawnTimer = 2 / this.difficultyMultiplier;
        }

        if (this.coinSpawnTimer <= 0) {
            this.spawnCoins();
            this.coinSpawnTimer = 1.5 / this.difficultyMultiplier;
        }

        this.obstacles.forEach(o => o.update(deltaTime, this.speed));
        this.coins.forEach(c => c.update(deltaTime, this.speed));

        this.obstacles = this.obstacles.filter(o => o.x > -100);
        this.coins = this.coins.filter(c => c.x > -100);
    }

    private spawnObstacle(): void {
        const lane = Math.floor(Math.random() * 3) - 1;
        const type = Math.random() > 0.5 ? ObstacleType.BARRIER : ObstacleType.TRAIN;
        this.obstacles.push(new Obstacle(900, this.groundY, lane, type));
    }

    private spawnCoins(): void {
        const lane = Math.floor(Math.random() * 3) - 1;
        for (let i = 0; i < 5; i++) {
            this.coins.push(new Coin(900 + i * 60, this.groundY - 50, lane));
        }
    }

    public getObstacles(): Obstacle[] { return this.obstacles; }
    public getCoins(): Coin[] { return this.coins; }
    public removeCoin(id: number): void {
        this.coins = this.coins.filter(c => c.id !== id);
    }
    public reset(): void {
        this.obstacles = [];
        this.coins = [];
        this.distance = 0;
        this.spawnTimer = 0;
        this.coinSpawnTimer = 0;
        this.difficultyMultiplier = 1;
    }
}

export default World;
EOF

# 4. Renderer.ts
cat > src/graphics/Renderer.ts << 'EOF'
import Player from '../entities/Player';
import World from '../world/World';
import { GameState } from '../Game';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    public render(state: GameState, player: Player, world: World, score: number, coins: number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Дорога
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 350, this.canvas.width, 250);
        
        // Линии
        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([20, 20]);
        [-1.5, -0.5, 0.5, 1.5].forEach(x => {
            const lineX = this.canvas.width / 2 + x * 100;
            this.ctx.beginPath();
            this.ctx.moveTo(lineX, 350);
            this.ctx.lineTo(lineX, 600);
            this.ctx.stroke();
        });

        // Игрок
        const playerX = this.canvas.width / 2 + player.getLane() * 100 - 25;
        const playerY = 400 - player.getYPosition() - (player.isRolling() ? 50 : 100);
        const playerW = player.isRolling() ? 50 : 50;
        const playerH = player.isRolling() ? 50 : 100;
        
        this.ctx.fillStyle = '#007bff';
        this.ctx.fillRect(playerX, playerY, playerW, playerH);

        // Препятствия
        world.getObstacles().forEach(obs => {
            const obsX = obs.x - 30;
            const obsY = 400 - (obs.type === 'train' ? 80 : 40);
            this.ctx.fillStyle = obs.type === 'train' ? '#ff4444' : '#ff8800';
            this.ctx.fillRect(obsX, obsY, 60, obs.type === 'train' ? 80 : 40);
        });

        // Монеты
        world.getCoins().forEach(coin => {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.beginPath();
            this.ctx.arc(coin.x, coin.y, 15, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // UI
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${score}`, 20, 40);
        this.ctx.fillText(`Coins: ${coins}`, 20, 70);

        if (state === GameState.MENU) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Subway Surfers', this.canvas.width/2, this.canvas.height/2 - 50);
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Press Space to Start', this.canvas.width/2, this.canvas.height/2 + 20);
            this.ctx.textAlign = 'left';
        } else if (state === GameState.GAME_OVER) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over', this.canvas.width/2, this.canvas.height/2 - 20);
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Score: ${score}`, this.canvas.width/2, this.canvas.height/2 + 30);
            this.ctx.fillText('Press Space to Restart', this.canvas.width/2, this.canvas.height/2 + 70);
            this.ctx.textAlign = 'left';
        }
    }
}

export default Renderer;
EOF

# 5. CollisionSystem.ts
cat > src/physics/CollisionSystem.ts << 'EOF'
import Player from '../entities/Player';
import Obstacle from '../entities/Obstacle';
import Coin from '../entities/Coin';

export interface CollisionResult {
    type: 'obstacle' | 'coin';
    object: Obstacle | Coin;
}

export class CollisionSystem {
    public checkCollisions(player: Player, obstacles: Obstacle[], coins: Coin[]): CollisionResult[] {
        const results: CollisionResult[] = [];
        const playerRect = this.getPlayerRect(player);

        obstacles.forEach(obs => {
            const obsRect = { x: obs.x - 30, y: 400 - (obs.type === 'train' ? 80 : 40), width: 60, height: obs.type === 'train' ? 80 : 40 };
            if (this.rectIntersect(playerRect, obsRect)) {
                results.push({ type: 'obstacle', object: obs });
            }
        });

        coins.forEach(coin => {
            const coinRect = { x: coin.x - 15, y: coin.y - 15, width: 30, height: 30 };
            if (this.rectIntersect(playerRect, coinRect)) {
                results.push({ type: 'coin', object: coin });
            }
        });

        return results;
    }

    private getPlayerRect(player: Player): { x: number, y: number, width: number, height: number } {
        const laneWidth = 100;
        const x = this.canvasCenter() + player.getLane() * laneWidth - 25;
        const y = 400 - player.getYPosition() - (player.isRolling() ? 50 : 100);
        return {
            x: x,
            y: y,
            width: player.isRolling() ? 50 : 50,
            height: player.isRolling() ? 50 : 100
        };
    }

    private canvasCenter(): number { return 400; } // Половина ширины канваса

    private rectIntersect(r1: any, r2: any): boolean {
        return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
    }
}

export default CollisionSystem;
EOF

# 6. entities/index.ts
cat > src/entities/index.ts << 'EOF'
export { default as Player, Lane, PlayerState } from './Player';
export { default as Obstacle, ObstacleType, IObstacle } from './Obstacle';
export { default as Coin, ICoin } from './Coin';
EOF

# 7. Game.ts
cat > src/Game.ts << 'EOF'
import { Player } from './entities/Player';
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
        this.world = new World(400);
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
EOF

# 8. index.ts
cat > src/index.ts << 'EOF'
import Game from './Game';

window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
EOF

git add .
git commit -m "fix: Complete rewrite of core modules with correct exports"
git push origin main

echo "✅ Все файлы восстановлены!"
echo "🚀 Запустите: npm run build && npm start"
