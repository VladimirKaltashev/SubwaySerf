export declare enum Lane {
    LEFT = 0,
    CENTER_LEFT = 1,
    CENTER = 2,
    CENTER_RIGHT = 3,
    RIGHT = 4
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
declare class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    normalHeight: number;
    slideHeight: number;
    lane: Lane;
    isJumping: boolean;
    isSliding: boolean;
    verticalVelocity: number;
    jumpPower: number;
    gravity: number;
    groundY: number;
    slideTimer: number;
    slideDuration: number;
    private score;
    private coins;
    constructor(groundY?: number);
    private getLaneX;
    moveLeft(): void;
    moveRight(): void;
    jump(): void;
    slide(): void;
    update(): void;
    increaseScore(points: number): void;
    collectCoin(): void;
    getScore(): number;
    getCoins(): number;
    reset(groundY?: number): void;
}
export default Player;
//# sourceMappingURL=Player.d.ts.map