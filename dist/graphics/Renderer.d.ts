import Player from '../entities/Player';
import Obstacle from '../entities/Obstacle';
import Coin from '../entities/Coin';
export interface IRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
}
declare class Renderer implements IRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor(canvasId?: string);
    clear(): void;
    drawPlayer(player: Player): void;
    drawObstacle(obstacle: Obstacle): void;
    drawCoin(coin: Coin): void;
    drawUI(score: number, coins: number, distance: number): void;
    drawGameOver(score: number): void;
    resize(width: number, height: number): void;
}
export default Renderer;
//# sourceMappingURL=Renderer.d.ts.map