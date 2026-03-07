import { Player } from '../entities/Player';

export enum InputAction {
    MOVE_LEFT = 'move_left',
    MOVE_RIGHT = 'move_right',
    JUMP = 'jump',
    ROLL = 'roll'
}

export class InputHandler {
    private player: Player;
    private onMoveLeft?: () => void;
    private onMoveRight?: () => void;
    private onJump?: () => void;
    private onRoll?: () => void;

    constructor(player: Player) {
        this.player = player;
        this.setupKeyboardListeners();
        this.setupTouchListeners();
    }

    private setupKeyboardListeners(): void {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.player.slide('left', event.key === 'a' || event.key === 'A');
                    if (this.onMoveLeft) this.onMoveLeft();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.player.slide('right', event.key === 'd' || event.key === 'D');
                    if (this.onMoveRight) this.onMoveRight();
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                case ' ':
                    this.player.jump();
                    if (this.onJump) this.onJump();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.player.roll();
                    if (this.onRoll) this.onRoll();
                    break;
            }
        });
    }

    private setupTouchListeners(): void {
        let touchStartX: number = 0;
        let touchStartY: number = 0;

        document.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });

        document.addEventListener('touchend', (event) => {
            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;
            
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 30) {
                    this.player.slide('right');
                    if (this.onMoveRight) this.onMoveRight();
                } else if (diffX < -30) {
                    this.player.slide('left');
                    if (this.onMoveLeft) this.onMoveLeft();
                }
            } else {
                if (diffY < -30) {
                    this.player.jump();
                    if (this.onJump) this.onJump();
                } else if (diffY > 30) {
                    this.player.roll();
                    if (this.onRoll) this.onRoll();
                }
            }
        });
    }

    public setOnMoveLeft(callback: () => void): void {
        this.onMoveLeft = callback;
    }

    public setOnMoveRight(callback: () => void): void {
        this.onMoveRight = callback;
    }

    public setOnJump(callback: () => void): void {
        this.onJump = callback;
    }

    public setOnRoll(callback: () => void): void {
        this.onRoll = callback;
    }
}

export default InputHandler;
