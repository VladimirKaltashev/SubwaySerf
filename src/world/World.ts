import { Obstacle, ObstacleType } from '../entities/Obstacle';
import { Coin } from '../entities/Coin';

export class World {
    private speed: number = 5;
    private distance: number = 0;
    private obstacles: Obstacle[] = [];
    private coins: Coin[] = [];
    private groundY: number = 400;
    private spawnTimer: number = 0;
    private coinSpawnTimer: number = 0;
    private difficultyMultiplier: number = 1;
    private nextObstacleId: number = 1;
    private nextCoinId: number = 1;

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.speed = 5;
        this.distance = 0;
        this.obstacles = [];
        this.coins = [];
        this.spawnTimer = 0;
        this.coinSpawnTimer = 0;
        this.difficultyMultiplier = 1;
        this.nextObstacleId = 1;
        this.nextCoinId = 1;
    }

    public update(deltaTime: number, gameSpeed: number): void {
        this.speed = gameSpeed;
        this.distance += this.speed * deltaTime;
        this.difficultyMultiplier = 1 + (this.distance / 10000);

        // Spawn obstacles
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.spawnObstacle();
            this.spawnTimer = 2 / this.difficultyMultiplier;
        }

        // Spawn coins
        this.coinSpawnTimer -= deltaTime;
        if (this.coinSpawnTimer <= 0) {
            this.spawnCoins();
            this.coinSpawnTimer = 1.5 / this.difficultyMultiplier;
        }

        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(this.speed);
            if (this.obstacles[i].x < -100) {
                this.obstacles.splice(i, 1);
            }
        }

        // Update coins
        for (let i = this.coins.length - 1; i >= 0; i--) {
            this.coins[i].update(this.speed);
            if (this.coins[i].x < -100) {
                this.coins.splice(i, 1);
            }
        }
    }

    private spawnObstacle(): void {
        const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const type = Math.random() > 0.7 ? ObstacleType.TRAIN : ObstacleType.BARRIER;
        const obstacle = new Obstacle(this.nextObstacleId++, lane, this.groundY, type);
        this.obstacles.push(obstacle);
    }

    private spawnCoins(): void {
        const lane = Math.floor(Math.random() * 3) - 1;
        // Проверяем, нет ли уже монет на этой полосе
        const hasCoins = this.coins.some(c => c.lane === lane && !c.collected);
        if (!hasCoins) {
            for (let i = 0; i < 3; i++) {
                const coin = new Coin(this.nextCoinId++, lane, this.groundY);
                coin.x += i * 50; // Размещаем монеты в ряд
                this.coins.push(coin);
            }
        }
    }

    public getObstacles(): Obstacle[] {
        return this.obstacles;
    }

    public getCoins(): Coin[] {
        return this.coins;
    }

    public removeCoin(id: number): void {
        const index = this.coins.findIndex(c => c.id === id);
        if (index !== -1) {
            this.coins.splice(index, 1);
        }
    }

    public getGroundY(): number {
        return this.groundY;
    }
}

export default World;
