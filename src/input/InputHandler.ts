import Player from '../entities/Player';

export enum InputAction {
    MOVE_LEFT = 'move_left',
    MOVE_RIGHT = 'move_right',
    JUMP = 'jump',
    ROLL = 'roll'
}

export class InputHandler {
    private player: Player;
    public onMoveLeft?: () => void;
    public onMoveRight?: () => void;
    public onJump?: () => void;
    public onRoll?: () => void;

    constructor(player: Player) {
        this.player = player;
        this.setupKeyboard();
        this.setupTouch();
    }

    private setupKeyboard(): void {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.player.slide('left', e.key === 'a' || e.key === 'A');
                    this.onMoveLeft?.();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.player.slide('right', e.key === 'd' || e.key === 'D');
                    this.onMoveRight?.();
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                case ' ':
                    this.player.jump();
                    this.onJump?.();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.player.roll();
                    this.onRoll?.();
                    break;
            }
        });
    }

    private setupTouch(): void {
        let startX = 0, startY = 0;
        document.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        document.addEventListener('touchend', e => {
            const diffX = e.changedTouches[0].clientX - startX;
            const diffY = e.changedTouches[0].clientY - startY;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 30) { this.player.slide('right'); this.onMoveRight?.(); }
                else if (diffX < -30) { this.player.slide('left'); this.onMoveLeft?.(); }
            } else {
                if (diffY < -30) { this.player.jump(); this.onJump?.(); }
                else if (diffY > 30) { this.player.roll(); this.onRoll?.(); }
            }
        });
    }
}

export default InputHandler;
