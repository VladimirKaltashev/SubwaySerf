// Player.ts - Игрок для Subway Surfers clone

export enum Lane {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
}

export interface PlayerState {
    x: number;
    y: number;
    width: number;
    height: number;
    lane: Lane;
    isJumping: boolean;
    isSliding: boolean;
    verticalVelocity: number;
    jumpPower: number;
    gravity: number;
    groundY: number;
    slideTimer: number;
    slideDuration: number;
}

class Player {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public lane: Lane;
    public isJumping: boolean;
    public isSliding: boolean;
    public verticalVelocity: number;
    public jumpPower: number;
    public gravity: number;
    public groundY: number;
    public slideTimer: number;
    public slideDuration: number;
    private score: number;
    private coins: number;

    constructor(groundY: number = 400) {
        this.width = 50;
        this.height = 80;
        this.lane = Lane.CENTER;
        this.isJumping = false;
        this.isSliding = false;
        this.verticalVelocity = 0;
        this.jumpPower = -15;
        this.gravity = 0.8;
        this.groundY = groundY;
        this.x = this.getLaneX(Lane.CENTER);
        this.y = groundY - this.height;
        this.slideTimer = 0;
        this.slideDuration = 40; // frames
        this.score = 0;
        this.coins = 0;
    }

    private getLaneX(lane: Lane): number {
        const laneWidth = 120;
        const centerX = 400;
        return centerX + (lane - Lane.CENTER) * laneWidth;
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
        if (!this.isJumping && !this.isSliding) {
            this.isJumping = true;
            this.verticalVelocity = this.jumpPower;
        }
    }

    public slide(): void {
        if (!this.isSliding && !this.isJumping) {
            this.isSliding = true;
            this.height = 40;
            this.slideTimer = this.slideDuration;
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

        // Handle sliding
        if (this.isSliding) {
            this.slideTimer--;
            if (this.slideTimer <= 0) {
                this.isSliding = false;
                this.height = 80;
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
        this.isSliding = false;
        this.verticalVelocity = 0;
        this.x = this.getLaneX(Lane.CENTER);
        this.y = groundY - this.height;
        this.slideTimer = 0;
        this.score = 0;
        this.coins = 0;
    }
}

export default Player;
