import Obstacle from '../entities/Obstacle';
import Coin from '../entities/Coin';
export interface IWorld {
    speed: number;
    distance: number;
    obstacles: Obstacle[];
    coins: Coin[];
}
declare class World implements IWorld {
    speed: number;
    distance: number;
    obstacles: Obstacle[];
    coins: Coin[];
    private groundY;
    private spawnTimer;
    private coinSpawnTimer;
    private difficultyMultiplier;
    constructor(groundY?: number);
    update(): void;
    private spawnObstacle;
    private spawnCoins;
    getObstacles(): Obstacle[];
    getCoins(): Coin[];
    reset(): void;
    increaseSpeed(): void;
}
export default World;
//# sourceMappingURL=World.d.ts.map