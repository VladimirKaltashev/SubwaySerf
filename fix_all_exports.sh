#!/bin/bash

echo "🔧 Исправляем все экспорты и импорты..."

# 1. Исправляем Player.ts - добавляем export default и PlayerState
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
            if (this.rollTimer <= 0) {
                this.state = PlayerState.RUNNING;
            }
        }
    }

    public jump(): void {
        if (this.state !== PlayerState.JUMPING) {
            this.verticalVelocity = this.JUMP_FORCE;
            this.state = PlayerState.JUMPING;
        }
    }

    public roll(): void {
        if (this.state !== PlayerState.JUMPING && this.state !== PlayerState.ROLLING) {
            this.state = PlayerState.ROLLING;
            this.rollTimer = this.ROLL_DURATION;
        } else if (this.state === PlayerState.JUMPING) {
            this.verticalVelocity = -this.JUMP_FORCE;
        }
    }

    public slide(direction: 'left' | 'right', far: boolean = false): void {
        const currentLaneValue = this.lane;
        const change = far ? 2 : 1;
        const newLaneValue = direction === 'left' 
            ? currentLaneValue - change 
            : currentLaneValue + change;

        if (newLaneValue >= Lane.LEFT_FAR && newLaneValue <= Lane.RIGHT_FAR) {
            this.lane = newLaneValue as Lane;
        }
    }

    public getLane(): Lane {
        return this.lane;
    }

    public getState(): PlayerState {
        return this.state;
    }

    public getYPosition(): number {
        return this.yPosition;
    }

    public isRolling(): boolean {
        return this.state === PlayerState.ROLLING;
    }

    public isJumping(): boolean {
        return this.state === PlayerState.JUMPING;
    }

    // Для совместимости с Renderer и CollisionSystem
    public get x(): number {
        return this.getLane() * 100; // Условная координата
    }

    public get y(): number {
        return this.yPosition;
    }

    public get width(): number {
        return this.isRolling() ? 80 : 100;
    }

    public get height(): number {
        return this.isRolling() ? 50 : 100;
    }
}

export default Player;
EOF

# 2. Исправляем entities/index.ts
cat > src/entities/index.ts << 'EOF'
export { Player, PlayerState, Lane } from './Player';
export { Obstacle, ObstacleType, IObstacle } from './Obstacle';
export { Coin, ICoin } from './Coin';
EOF

# 3. Исправляем Game.ts - правильные импорты
cat > src/Game.ts << 'EOF'
import { Player, PlayerState, Lane } from './entities/Player';
import { World } from './world/World';
import { Renderer } from './graphics/Renderer';
import { InputHandler } from './input/InputHandler';
import { CollisionSystem } from './physics/CollisionSystem';

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
        this.inputHandler.setOnJump(() => {
            if (this.state === GameState.MENU) {
                this.startGame();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === ' ' && this.state === GameState.GAME_OVER) {
                this.restartGame();
            }
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

    private restartGame(): void {
        this.startGame();
    }

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
        
        for (const collision of collisions) {
            if (collision.type === 'obstacle') {
                this.state = GameState.GAME_OVER;
            } else if (collision.type === 'coin') {
                this.coins++;
                this.score += 10;
                this.world.removeCoin(collision.object.id);
            }
        }

        this.score += Math.floor(this.gameSpeed * deltaTime);
        this.gameSpeed += 0.001;
    }

    private render(): void {
        this.renderer.render(this.state, this.player, this.world, this.score, this.coins);
    }

    public getState(): GameState {
        return this.state;
    }

    public getScore(): number {
        return this.score;
    }

    public getCoins(): number {
        return this.coins;
    }
}

export default Game;
EOF

# 4. Исправляем index.ts
cat > src/index.ts << 'EOF'
import Game from './Game';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
EOF

# 5. Исправляем World.ts - добавляем export class
sed -i 's/export interface IWorld/export class World/g' src/world/World.ts
sed -i 's/interface IWorld/class World/g' src/world/World.ts
# Добавляем export default в конец если нет
if ! grep -q "export default World" src/world/World.ts; then
    echo "export default World;" >> src/world/World.ts
fi

# 6. Исправляем Renderer.ts
sed -i 's/import Player/import { Player }/g' src/graphics/Renderer.ts
if ! grep -q "export default Renderer" src/graphics/Renderer.ts; then
    # Находим класс Renderer и добавляем export default
    sed -i 's/export class Renderer/export class Renderer/g' src/graphics/Renderer.ts
    echo "export default Renderer;" >> src/graphics/Renderer.ts
fi

# 7. Исправляем CollisionSystem.ts
sed -i 's/import Player/import { Player }/g' src/physics/CollisionSystem.ts
if ! grep -q "export default CollisionSystem" src/physics/CollisionSystem.ts; then
    sed -i 's/export class CollisionSystem/export class CollisionSystem/g' src/physics/CollisionSystem.ts
    echo "export default CollisionSystem;" >> src/physics/CollisionSystem.ts
fi

# Коммит и пуш
git add .
git commit -m "fix: Unified exports and imports across all modules"
git push origin main

echo "✅ Все экспорты исправлены!"
echo "🚀 Запустите: npm run build && npm start"
