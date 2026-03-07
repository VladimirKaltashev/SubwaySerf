import { Player } from './entities/Player';
import { InputHandler } from './input/InputHandler';

export class Game {
    private player: Player;
    private inputHandler: InputHandler;

    constructor() {
        this.player = new Player();
        this.inputHandler = new InputHandler(this.player);
    }

    public start() {
        console.log('Game started');
        setInterval(() => {
            console.log(`Player lane: ${this.player.getLane()}`);
        }, 500);
    }
}
