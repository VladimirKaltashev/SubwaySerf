export enum Lane {
    LEFT_FAR = -2,
    LEFT = -1,
    CENTER = 0,
    RIGHT = 1,
    RIGHT_FAR = 2
}

export class Player {
    private lane: Lane = Lane.CENTER;

    public slide(direction: 'left' | 'right', far: boolean = false): void {
        const newLane = far ? 
            (direction === 'left' ? this.lane - 2 : this.lane + 2) :
            (direction === 'left' ? this.lane - 1 : this.lane + 1);

        if (newLane >= Lane.LEFT_FAR && newLane <= Lane.RIGHT_FAR) {
            this.lane = newLane;
        }
    }

    public getLane(): Lane {
        return this.lane;
    }
}
