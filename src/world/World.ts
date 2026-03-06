// World.ts

// Class to manage the world-level interaction for SubwaySerf
class World {
    private level: number;

    constructor() {
        this.level = 1; // Initialize to level 1
    }

    public getLevel(): number {
        return this.level;
    }

    public incrementLevel(): void {
        this.level += 1;
    }

    public resetLevel(): void {
        this.level = 1; // Reset to level 1
    }
}

export default World;
