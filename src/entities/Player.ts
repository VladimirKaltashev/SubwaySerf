// Player.ts - Игрок для Subway Surfers clone с 5 полосами

export enum Lane {
    LEFT = -2,
    CENTER_LEFT = -1,
    CENTER = 0,
    CENTER_RIGHT = 1,
    RIGHT = 2
}

export interface PlayerState {
    x: number;
    y: number;
    width: number;
    height: number;
    lane: Lane;
    isJumping: boolean;
    isRolling: boolean;
    verticalVelocity: number;
    jumpPower: number;
    gravity: number;
    groundY: number;
    rollTimer: number;
    rollDuration: number;
}

class Player {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public normalHeight: number;
    public rollHeight: number;
    public lane: Lane;
    public isJumping: boolean;
    public isRolling: boolean;
    public verticalVelocity: number;
    public jumpPower: number;
    public gravity: number;
    public groundY: number;
    public rollTimer: number;
    public rollDuration: number;
    private score: number;
    private coins: number;

    constructor(groundY: number = 400) {
        this.width = 50;
        this.normalHeight = 80;
        this.rollHeight = 40;
        this.height = this.normalHeight;
        this.lane = Lane.CENTER;
        this.isJumping = false;
        this.isRolling = false;
        this.verticalVelocity = 0;
        this.jumpPower = -15;
        this.gravity = 0.8;
        this.groundY = groundY;
        this.x = this.getLaneX(Lane.CENTER);
        this.y = groundY - this.height;
        this.rollTimer = 0;
        this.rollDuration = 40; // frames
        this.score = 0;
        this.coins = 0;
    }

    private getLaneX(lane: Lane): number {
        const laneWidth = 100;
        const centerX = 400;
        return centerX + lane * laneWidth;
    }

    public moveLeft(): void {
        if (this.lane > Lane.LEFT) {
            this.lane--;
            this.x = this.getLaneX(this.lane);
        }
    }

    public moveRight(): void {
        if (this.lane < Lane.RIGHT) {
            this.lane++;
            this.x = this.getLaneX(this.lane);
        }
    }

    public jump(): void {
        if (!this.isJumping && !this.isRolling) {
            this.isJumping = true;
            this.verticalVelocity = this.jumpPower;
        }
    }

    public roll(): void {
        if (!this.isRolling && !this.isJumping) {
            this.isRolling = true;
            this.height = this.rollHeight;
            this.rollTimer = this.rollDuration;
        } else if (this.isJumping) {
            // Fast fall
            this.verticalVelocity = 15;
        }
    }

    public update(): void {
        // Apply gravity
        if (this.isJumping) {
            this.verticalVelocity += this.gravity;
            this.y += this.verticalVelocity;

            // Check if landed
            if (this.y >= this.groundY - this.height) {
                this.y = this.groundY - this.height;
                this.isJumping = false;
                this.verticalVelocity = 0;
            }
        }

        // Handle rolling
        if (this.isRolling) {
            this.rollTimer--;
            if (this.rollTimer <= 0) {
                this.isRolling = false;
                this.height = this.normalHeight;
                this.y = this.groundY - this.height;
            }
        }

        // Smooth lane transition
        const targetX = this.getLaneX(this.lane);
        this.x += (targetX - this.x) * 0.3;
    }

    public increaseScore(points: number): void {
        this.score += points;
    }

    public collectCoin(): void {
        this.coins++;
        this.score += 10;
    }

    public getScore(): number {
        return this.score;
    }

    public getCoins(): number {
        return this.coins;
    }

    public reset(groundY: number = 400): void {
        this.lane = Lane.CENTER;
        this.isJumping = false;
        this.isRolling = false;
        this.verticalVelocity = 0;
        this.height = this.normalHeight;
        this.x = this.getLaneX(Lane.CENTER);
        this.y = groundY - this.height;
        this.rollTimer = 0;
        this.score = 0;
        this.coins = 0;
    }
}

export default Player;
