import Player from '../entities/Player';
import Obstacle from '../entities/Obstacle';
import Coin from '../entities/Coin';
export interface CollisionResult {
    collided: boolean;
    type?: 'obstacle' | 'coin';
    object?: Obstacle | Coin;
}
declare class CollisionSystem {
    private static instance;
    private constructor();
    static getInstance(): CollisionSystem;
    /**
     * Проверка AABB коллизии между двумя объектами
     */
    checkAABB(obj1: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, obj2: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): boolean;
    /**
     * Проверка коллизии игрока с препятствием
     */
    checkPlayerObstacleCollision(player: Player, obstacle: Obstacle): boolean;
    /**
     * Проверка коллизии игрока с монетой
     */
    checkPlayerCoinCollision(player: Player, coin: Coin): boolean;
    /**
     * Получение хитбокса игрока с учетом состояния
     */
    private getPlayerBounds;
    /**
     * Проверка всех коллизий и возврат результата
     */
    checkAllCollisions(player: Player, obstacles: Obstacle[], coins: Coin[]): {
        hitObstacle: boolean;
        collectedCoins: number[];
    };
    /**
     * Проверка, находится ли игрок в той же полосе, что и объект
     */
    checkLaneCollision(player: Player, lane: number): boolean;
}
export default CollisionSystem;
//# sourceMappingURL=CollisionSystem.d.ts.map