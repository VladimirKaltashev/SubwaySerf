export interface IObstacle {
    id: number;
    x: number;
    y: number;
    lane: number;
    type: string;
    width: number;
    height: number;
}

export enum ObstacleType {
    BARRIER = 'barrier',
    TRAIN = 'train'
}

export class Obstacle {
    public id: number;
    public x: number;
    public y: number;
    public lane: number;
    public type: ObstacleType;
    public width: number;
    public height: number;

    constructor(id: number, lane: number, groundY: number, type: ObstacleType = ObstacleType.BARRIER) {
        this.id = id;
        this.lane = lane;
        this.type = type;
        this.x = lane * 100 + 400;
        
        if (type === ObstacleType.BARRIER) {
            this.y = groundY - 40;
            this.width = 80;
            this.height = 40;
        } else {
            this.y = groundY - 100;
            this.width = 100;
            this.height = 100;
        }
    }

    update(speed: number): void {
        this.x -= speed;
    }
}

export default Obstacle;
