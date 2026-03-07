// CollisionSystem.ts - Система коллизий для Subway Surfers

import { Player } from '../entities/Player';
import Obstacle, { ObstacleType } from '../entities/Obstacle';
import Coin from '../entities/Coin';

export interface CollisionResult {
    collided: boolean;
    type?: 'obstacle' | 'coin';
    object?: Obstacle | Coin;
}

class CollisionSystem {
    private static instance: CollisionSystem;

    private constructor() {}

    public static getInstance(): CollisionSystem {
        if (!CollisionSystem.instance) {
            CollisionSystem.instance = new CollisionSystem();
        }
        return CollisionSystem.instance;
    }

    /**
     * Проверка AABB коллизии между двумя объектами
     */
    public checkAABB(
        obj1: { x: number; y: number; width: number; height: number },
        obj2: { x: number; y: number; width: number; height: number }
    ): boolean {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }

    /**
     * Проверка коллизии игрока с препятствием
     */
    public checkPlayerObstacleCollision(player: Player, obstacle: Obstacle): boolean {
        // Получаем хитбоксы
        const playerBounds = this.getPlayerBounds(player);
        const obstacleBounds = obstacle.getBounds();

        // Для высоких барьеров проверяем только если игрок не присел
        if (obstacle.type === ObstacleType.BARRIER_HIGH) {
            if (player.isRolling) {
                return false; // Игрок подкатился под барьер
            }
        }

        // Для низких барьеров проверяем только если игрок не прыгает достаточно высоко
        if (obstacle.type === ObstacleType.BARRIER_LOW) {
            if (player.isJumping && player.y < obstacle.y - player.height) {
                return false; // Игрок перепрыгнул барьер
            }
        }

        return this.checkAABB(playerBounds, obstacleBounds);
    }

    /**
     * Проверка коллизии игрока с монетой
     */
    public checkPlayerCoinCollision(player: Player, coin: Coin): boolean {
        if (coin.collected) return false;

        const playerBounds = this.getPlayerBounds(player);
        const coinBounds = coin.getBounds();

        // Уменьшаем хитбокс монеты для более честной коллизии
        const reducedCoinBounds = {
            x: coinBounds.x + 5,
            y: coinBounds.y + 5,
            width: coinBounds.width - 10,
            height: coinBounds.height - 10
        };

        return this.checkAABB(playerBounds, reducedCoinBounds);
    }

    /**
     * Получение хитбокса игрока с учетом состояния
     */
    private getPlayerBounds(player: Player): { x: number; y: number; width: number; height: number } {
        // Добавляем небольшой отступ для более честной коллизии
        const padding = 5;
        return {
            x: player.x + padding,
            y: player.y + padding,
            width: player.width - padding * 2,
            height: player.height - padding * 2
        };
    }

    /**
     * Проверка всех коллизий и возврат результата
     */
    public checkAllCollisions(
        player: Player,
        obstacles: Obstacle[],
        coins: Coin[]
    ): { 
        hitObstacle: boolean;
        collectedCoins: number[];
    } {
        const result = {
            hitObstacle: false,
            collectedCoins: [] as number[]
        };

        // Проверка препятствий
        for (let i = 0; i < obstacles.length; i++) {
            if (this.checkPlayerObstacleCollision(player, obstacles[i])) {
                result.hitObstacle = true;
                break;
            }
        }

        // Проверка монет
        for (let i = 0; i < coins.length; i++) {
            if (this.checkPlayerCoinCollision(player, coins[i])) {
                result.collectedCoins.push(i);
            }
        }

        return result;
    }

    /**
     * Проверка, находится ли игрок в той же полосе, что и объект
     */
    public checkLaneCollision(player: Player, lane: number): boolean {
        const laneWidth = 120;
        const centerX = 400;
        const objectX = centerX + (lane - 1) * laneWidth;
        
        // Проверяем, находится ли игрок близко к центру полосы
        return Math.abs(player.x - objectX) < laneWidth / 2;
    }
}

export default CollisionSystem;
