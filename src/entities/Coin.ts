export interface ICoin {
    id: number;
    x: number;
    y: number;
    lane: number;
    collected: boolean;
}

export class Coin {
    public id: number;
    public x: number;
    public y: number;
    public lane: number;
    public collected: boolean;
    public width: number = 30;
    public height: number = 30;

    constructor(id: number, lane: number, groundY: number) {
        this.id = id;
        this.lane = lane;
        this.x = lane * 100 + 400;
        this.y = groundY - 30;
        this.collected = false;
    }

    update(speed: number): void {
        this.x -= speed;
    }
}

export default Coin;
