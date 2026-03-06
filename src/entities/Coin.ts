// Coin.ts - Монеты для Subway Surfers clone

export interface ICoin {
    x: number;
    y: number;
    width: number;
    height: number;
    lane: number;
    collected: boolean;
    rotation: number;
}

class Coin implements ICoin {
    public x: number;
    public y: number;
    public width: number = 30;
    public height: number = 30;
    public lane: number;
    public collected: boolean;
    public rotation: number;

    constructor(lane: number, startX: number = 800, yOffset: number = 470) {
        this.lane = lane;
        this.x = startX;
        this.y = yOffset;
        this.collected = false;
        this.rotation = 0;
    }

    public update(): void {
        this.x -= 5; // Движение влево вместе с миром
        this.rotation += 5; // Вращение для анимации
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

export default Coin;
