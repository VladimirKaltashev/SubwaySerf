// Renderer.ts - Рендеринг для Subway Surfers

import Player, { Lane } from '../entities/Player';
import Obstacle, { ObstacleType } from '../entities/Obstacle';
import Coin from '../entities/Coin';

export interface IRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
}

class Renderer implements IRenderer {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public width: number;
    public height: number;

    constructor(canvasId: string = 'gameCanvas') {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            document.body.appendChild(this.canvas);
        }
        
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext('2d')!;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    public clear(): void {
        // Градиентный фон (небо)
        const gradient = this.context.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, this.height);

        // Земля/дорога
        this.context.fillStyle = '#654321';
        this.context.fillRect(0, 500, this.width, 100);
        
        // Разметка дороги
        this.context.strokeStyle = '#FFFFFF';
        this.context.setLineDash([20, 20]);
        this.context.lineWidth = 2;
        
        // Линии между полосами
        const lanePositions = [280, 400, 520];
        for (let i = 1; i < lanePositions.length; i++) {
            this.context.beginPath();
            this.context.moveTo(lanePositions[i], 500);
            this.context.lineTo(lanePositions[i], 600);
            this.context.stroke();
        }
        this.context.setLineDash([]);
    }

    public drawPlayer(player: Player): void {
        this.context.save();
        
        // Тень
        this.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.context.beginPath();
        this.context.ellipse(player.x + player.width / 2, player.y + player.height, player.width / 2, 10, 0, 0, Math.PI * 2);
        this.context.fill();

        // Тело игрока
        if (player.isSliding) {
            // Приседание
            this.context.fillStyle = '#FF6B6B';
            this.context.fillRect(player.x, player.y, player.width, player.height);
        } else {
            // Обычная поза
            this.context.fillStyle = '#FF6B6B';
            this.context.fillRect(player.x, player.y, player.width, player.height);
            
            // Голова
            this.context.fillStyle = '#FFE4C4';
            this.context.beginPath();
            this.context.arc(player.x + player.width / 2, player.y - 10, 20, 0, Math.PI * 2);
            this.context.fill();
        }

        // Глаза
        this.context.fillStyle = '#000000';
        this.context.beginPath();
        this.context.arc(player.x + player.width / 2 + 5, player.y - 12, 3, 0, Math.PI * 2);
        this.context.fill();

        this.context.restore();
    }

    public drawObstacle(obstacle: Obstacle): void {
        this.context.save();
        
        switch (obstacle.type) {
            case ObstacleType.BARRIER_LOW:
                // Низкий барьер
                this.context.fillStyle = '#FF4500';
                this.context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                // Полоски
                this.context.strokeStyle = '#FFFFFF';
                this.context.lineWidth = 2;
                for (let i = 0; i < obstacle.height; i += 10) {
                    this.context.beginPath();
                    this.context.moveTo(obstacle.x, obstacle.y + i);
                    this.context.lineTo(obstacle.x + obstacle.width, obstacle.y + i);
                    this.context.stroke();
                }
                break;
                
            case ObstacleType.BARRIER_HIGH:
                // Высокий барьер
                this.context.fillStyle = '#8B4513';
                this.context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                // Ножки
                this.context.fillStyle = '#654321';
                this.context.fillRect(obstacle.x, obstacle.y + obstacle.height, 10, 40);
                this.context.fillRect(obstacle.x + obstacle.width - 10, obstacle.y + obstacle.height, 10, 40);
                break;
                
            case ObstacleType.TRAIN:
                // Поезд
                this.context.fillStyle = '#4169E1';
                this.context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                // Окна
                this.context.fillStyle = '#87CEEB';
                this.context.fillRect(obstacle.x + 10, obstacle.y + 10, 25, 25);
                this.context.fillRect(obstacle.x + 45, obstacle.y + 10, 25, 25);
                // Колеса
                this.context.fillStyle = '#333333';
                this.context.beginPath();
                this.context.arc(obstacle.x + 20, obstacle.y + obstacle.height, 10, 0, Math.PI * 2);
                this.context.arc(obstacle.x + obstacle.width - 20, obstacle.y + obstacle.height, 10, 0, Math.PI * 2);
                this.context.fill();
                break;
                
            case ObstacleType.CONE:
                // Конус
                this.context.fillStyle = '#FFA500';
                this.context.beginPath();
                this.context.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
                this.context.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
                this.context.lineTo(obstacle.x, obstacle.y + obstacle.height);
                this.context.closePath();
                this.context.fill();
                break;
        }
        
        this.context.restore();
    }

    public drawCoin(coin: Coin): void {
        this.context.save();
        
        // Монета
        this.context.fillStyle = '#FFD700';
        this.context.beginPath();
        this.context.arc(
            coin.x + coin.width / 2,
            coin.y + coin.height / 2,
            coin.width / 2,
            0,
            Math.PI * 2
        );
        this.context.fill();
        
        // Блеск
        this.context.fillStyle = '#FFFACD';
        this.context.beginPath();
        this.context.arc(
            coin.x + coin.width / 2 - 5,
            coin.y + coin.height / 2 - 5,
            5,
            0,
            Math.PI * 2
        );
        this.context.fill();
        
        // Знак доллара
        this.context.fillStyle = '#DAA520';
        this.context.font = 'bold 16px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('$', coin.x + coin.width / 2, coin.y + coin.height / 2);
        
        this.context.restore();
    }

    public drawUI(score: number, coins: number, distance: number): void {
        this.context.save();
        
        // Фон для UI
        this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.fillRect(10, 10, 200, 100);
        
        // Счет
        this.context.fillStyle = '#FFFFFF';
        this.context.font = 'bold 20px Arial';
        this.context.textAlign = 'left';
        this.context.fillText(`Score: ${Math.floor(score)}`, 20, 35);
        
        // Монеты
        this.context.fillStyle = '#FFD700';
        this.context.fillText(`Coins: ${coins}`, 20, 60);
        
        // Дистанция
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(`Distance: ${Math.floor(distance)}m`, 20, 85);
        
        this.context.restore();
    }

    public drawGameOver(score: number): void {
        this.context.save();
        
        // Полупрозрачный фон
        this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.context.fillRect(0, 0, this.width, this.height);
        
        // Текст Game Over
        this.context.fillStyle = '#FF4500';
        this.context.font = 'bold 60px Arial';
        this.context.textAlign = 'center';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 50);
        
        // Финальный счет
        this.context.fillStyle = '#FFFFFF';
        this.context.font = 'bold 30px Arial';
        this.context.fillText(`Final Score: ${Math.floor(score)}`, this.width / 2, this.height / 2 + 20);
        
        // Инструкция
        this.context.fillStyle = '#CCCCCC';
        this.context.font = '20px Arial';
        this.context.fillText('Press SPACE to restart', this.width / 2, this.height / 2 + 70);
        
        this.context.restore();
    }

    public resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
    }
}

export default Renderer;
