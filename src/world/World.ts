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
