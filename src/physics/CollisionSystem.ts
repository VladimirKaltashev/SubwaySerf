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
