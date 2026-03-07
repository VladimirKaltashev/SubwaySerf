import { Player } from '../entities/Player';

export class InputHandler {
    private player: Player;

    constructor(player: Player) {
        this.player = player;
        
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.player.slide('left');
                    break;
                case 'ArrowRight':
                    this.player.slide('right');
                    break;
                case 'a':
                    this.player.slide('left', true);
                    break;
                case 'd':
                    this.player.slide('right', true);
                    break;
            }
        });
    }
}
