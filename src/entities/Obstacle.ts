// Obstacle.ts - Препятствия для Subway Surfers clone

export enum ObstacleType {
    BARRIER_LOW = 'barrier_low',      // Низкий барьер (нужно перепрыгнуть)
    BARRIER_HIGH = 'barrier_high',    // Высокий барьер (нужно подкатиться)
    TRAIN = 'train',                   // Поезд (нужно обойти)
    CONE = 'cone'                      // Конус (можно собрать)
}

export interface IObstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    lane: number;
    type: ObstacleType;
    speed: number;
    passed: boolean;
}

class Obstacle implements IObstacle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public lane: number;
    public type: ObstacleType;
    public speed: number;
    public passed: boolean;

    constructor(lane: number, type: ObstacleType, startX: number = 800) {
        this.lane = lane;
        this.type = type;
        this.x = startX;
        this.speed = 5;
        this.passed = false;
        
        // Настройка размеров в зависимости от типа
        switch (type) {
            case ObstacleType.BARRIER_LOW:
                this.width = 60;
                this.height = 40;
                this.y = 460; // На земле
                break;
            case ObstacleType.BARRIER_HIGH:
                this.width = 60;
                this.height = 50;
                this.y = 360; // В воздухе
                break;
            case ObstacleType.TRAIN:
                this.width = 80;
                this.height = 100;
                this.y = 400;
                break;
            case ObstacleType.CONE:
                this.width = 30;
                this.height = 30;
                this.y = 470;
                break;
        }
    }

    public update(): void {
        this.x -= this.speed;
    }

    public isOffScreen(): boolean {
        return this.x + this.width < 0;
    }

    public getBounds(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

export default Obstacle;
