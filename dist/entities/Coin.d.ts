export interface ICoin {
    x: number;
    y: number;
    width: number;
    height: number;
    lane: number;
    collected: boolean;
    rotation: number;
}
declare class Coin implements ICoin {
    x: number;
    y: number;
    width: number;
    height: number;
    lane: number;
    collected: boolean;
    rotation: number;
    constructor(lane: number, startX?: number, yOffset?: number);
    update(): void;
    isOffScreen(): boolean;
    getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export default Coin;
//# sourceMappingURL=Coin.d.ts.map