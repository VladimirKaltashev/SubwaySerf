// World.ts - Управление игровым миром для Subway Surfers

import { Obstacle, ObstacleType } from '../entities/Obstacle';
import { Coin } from '../entities/Coin';

export interface IWorld {
    speed: number;
    distance: number;
    obstacles: Obstacle[];
    coins: Coin[];
}

class World implements IWorld {
    public speed: number;
    public distance: number;
    public obstacles: Obstacle[];
    public coins: Coin[];
    
    private groundY: number;
    private spawnTimer: number;
    private coinSpawnTimer: number;
    private difficultyMultiplier: number;

    constructor(groundY: number = 400) {
        this.groundY = groundY;
        this.speed = 5;
        this.distance = 0;
        this.obstacles = [];
        this.coins = [];
        this.spawnTimer = 0;
        this.coinSpawnTimer = 0;
        this.difficultyMultiplier = 1;
    }

    public update(): void {
        // Увеличиваем дистанцию
        this.distance += this.speed;
        
        // Увеличиваем сложность со временем
        this.difficultyMultiplier = 1 + (this.distance / 10000);
        const currentSpeed = this.speed * this.difficultyMultiplier;

        // Спавн препятствий
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            this.spawnObstacle();
            this.spawnTimer = Math.floor(60 / this.difficultyMultiplier); // Чем выше сложность, тем чаще спавн
        }

        // Спавн монет
        this.coinSpawnTimer--;
        if (this.coinSpawnTimer <= 0) {
            this.spawnCoins();
            this.coinSpawnTimer = Math.floor(30 / this.difficultyMultiplier);
        }

        // Обновление препятствий
        this.obstacles.forEach(obstacle => {
            obstacle.speed = currentSpeed;
            obstacle.update();
        });

        // Обновление монет
        this.coins.forEach(coin => {
            coin.x -= currentSpeed;
            coin.update();
        });

        // Удаление объектов за экраном
        this.obstacles = this.obstacles.filter(o => !o.isOffScreen());
        this.coins = this.coins.filter(c => !c.isOffScreen());
    }

    private spawnObstacle(): void {
        const lane = Math.floor(Math.random() * 3); // 0, 1, или 2
        const types = [
            ObstacleType.BARRIER_LOW,
            ObstacleType.BARRIER_HIGH,
            ObstacleType.TRAIN
        ];
        
        // Не спавним поезд в той же полосе, что и последнее препятствие
        const lastObstacle = this.obstacles[this.obstacles.length - 1];
        let type: ObstacleType;
        
        if (lastObstacle && lastObstacle.type === ObstacleType.TRAIN && lastObstacle.lane === lane) {
            // Выбираем другой тип
            const otherTypes = types.filter(t => t !== ObstacleType.TRAIN);
            type = otherTypes[Math.floor(Math.random() * otherTypes.length)];
        } else {
            type = types[Math.floor(Math.random() * types.length)];
        }

        const obstacle = new Obstacle(lane, type);
        this.obstacles.push(obstacle);
    }

    private spawnCoins(): void {
        // Спавним линию монет в случайной полосе
        const lane = Math.floor(Math.random() * 3);
        const startY = 470;
        
        // Создаем линию из 3-5 монет
        const coinCount = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < coinCount; i++) {
            const coin = new Coin(lane, 800 + i * 50, startY);
            this.coins.push(coin);
        }
    }

    public getObstacles(): Obstacle[] {
        return this.obstacles;
    }

    public getCoins(): Coin[] {
        return this.coins;
    }

    public reset(): void {
        this.speed = 5;
        this.distance = 0;
        this.obstacles = [];
        this.coins = [];
        this.spawnTimer = 0;
        this.coinSpawnTimer = 0;
        this.difficultyMultiplier = 1;
    }

    public increaseSpeed(): void {
        this.speed += 0.5;
    }
}

export default World;
