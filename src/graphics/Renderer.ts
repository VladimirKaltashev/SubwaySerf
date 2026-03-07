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
