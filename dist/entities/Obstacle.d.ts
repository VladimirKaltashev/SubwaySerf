export declare enum ObstacleType {
    BARRIER_LOW = "barrier_low",// Низкий барьер (нужно перепрыгнуть)
    BARRIER_HIGH = "barrier_high",// Высокий барьер (нужно подкатиться)
    TRAIN = "train",// Поезд (нужно обойти)
    CONE = "cone"
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
declare class Obstacle implements IObstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    lane: number;
    type: ObstacleType;
    speed: number;
    passed: boolean;
    constructor(lane: number, type: ObstacleType, startX?: number);
    update(): void;
    isOffScreen(): boolean;
    getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export default Obstacle;
//# sourceMappingURL=Obstacle.d.ts.map