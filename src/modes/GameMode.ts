// GameMode.ts

// Enum for different game modes
export enum GameMode {
    CLASSIC = "classic",
    TIME_ATTACK = "time_attack",
    SURVIVAL = "survival",
    CHALLENGE = "challenge"
}

// Base class for a game mode
export class BaseGameMode {
    protected mode: GameMode;

    constructor(mode: GameMode) {
        this.mode = mode;
    }

    public getMode(): GameMode {
        return this.mode;
    }

    public start(): void {
        console.log(`Starting mode: ${this.mode}`);
    }
}

// Sample derived class for a survival mode
export class SurvivalGameMode extends BaseGameMode {
    constructor() {
        super(GameMode.SURVIVAL);
    }

    public start(): void {
        super.start();
        console.log("Survival mode started. Stay alive!");
    }
}