export enum Lane {
    LEFT_FAR = -2,
    LEFT = -1,
    CENTER = 0,
    RIGHT = 1,
    RIGHT_FAR = 2
}

export enum PlayerState {
    RUNNING = 'running',
    JUMPING = 'jumping',
    ROLLING = 'rolling'
}

export class Player {
    private lane: Lane = Lane.CENTER;
    private state: PlayerState = PlayerState.RUNNING;
    private yPosition: number = 0;
    private verticalVelocity: number = 0;
    private rollTimer: number = 0;

    private readonly JUMP_FORCE = 15;
    private readonly GRAVITY = -40;
    private readonly ROLL_DURATION = 0.6;

    public update(deltaTime: number): void {
        if (this.state === PlayerState.JUMPING) {
            this.yPosition += this.verticalVelocity * deltaTime;
            this.verticalVelocity += this.GRAVITY * deltaTime;
            if (this.yPosition <= 0) {
                this.yPosition = 0;
                this.verticalVelocity = 0;
                this.state = PlayerState.RUNNING;
            }
        }
        if (this.state === PlayerState.ROLLING) {
            this.rollTimer -= deltaTime;
            if (this.rollTimer <= 0) this.state = PlayerState.RUNNING;
        }
    }

    public jump(): void {
        if (this.state !== PlayerState.JUMPING) {
            this.verticalVelocity = this.JUMP_FORCE;
            this.state = PlayerState.JUMPING;
        }
    }

    public roll(): void {
        if (this.state === PlayerState.JUMPING) {
            this.verticalVelocity = -this.JUMP_FORCE;
        } else if (this.state !== PlayerState.ROLLING) {
            this.state = PlayerState.ROLLING;
            this.rollTimer = this.ROLL_DURATION;
        }
    }

    public slide(direction: 'left' | 'right', far: boolean = false): void {
        const change = far ? 2 : 1;
        const newLane = direction === 'left' ? this.lane - change : this.lane + change;
        if (newLane >= Lane.LEFT_FAR && newLane <= Lane.RIGHT_FAR) {
            this.lane = newLane as Lane;
        }
    }

    public getLane(): Lane { return this.lane; }
    public getState(): PlayerState { return this.state; }
    public getYPosition(): number { return this.yPosition; }
    public isRolling(): boolean { return this.state === PlayerState.ROLLING; }
    public isJumping(): boolean { return this.state === PlayerState.JUMPING; }
    
    // Геттеры для совместимости
    public get x(): number { return this.lane * 100; }
    public get y(): number { return this.yPosition; }
    public get width(): number { return this.isRolling() ? 80 : 100; }
    public get height(): number { return this.isRolling() ? 50 : 100; }
}

export default Player;
