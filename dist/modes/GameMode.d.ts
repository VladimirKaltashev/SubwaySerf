export declare enum GameMode {
    CLASSIC = "classic",
    TIME_ATTACK = "time_attack",
    SURVIVAL = "survival",
    CHALLENGE = "challenge"
}
export declare class BaseGameMode {
    protected mode: GameMode;
    constructor(mode: GameMode);
    getMode(): GameMode;
    start(): void;
}
export declare class SurvivalGameMode extends BaseGameMode {
    constructor();
    start(): void;
}
//# sourceMappingURL=GameMode.d.ts.map