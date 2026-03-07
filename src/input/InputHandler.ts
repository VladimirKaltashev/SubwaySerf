// InputHandler.ts - Обработка ввода для Subway Surfers

export enum InputAction {
    MOVE_LEFT = 'move_left',
    MOVE_RIGHT = 'move_right',
    JUMP = 'jump',
    ROLL = 'roll'
}

export interface IInputHandler {
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onJump: () => void;
    onRoll: () => void;
}

class InputHandler implements IInputHandler {
    public onMoveLeft: () => void;
    public onMoveRight: () => void;
    public onJump: () => void;
    public onRoll: () => void;

    private keysPressed: Set<string>;

    constructor() {
        this.keysPressed = new Set();
        this.onMoveLeft = () => {};
        this.onMoveRight = () => {};
        this.onJump = () => {};
        this.onRoll = () => {};

        this.setupKeyboardListeners();
    }

    private setupKeyboardListeners(): void {
        document.addEventListener('keydown', (e) => {
            if (this.keysPressed.has(e.code)) return;
            this.keysPressed.add(e.code);

            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.onMoveLeft();
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.onMoveRight();
                    break;
                case 'ArrowUp':
                case 'KeyW':
                case 'Space':
                    this.onJump();
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.onRoll();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keysPressed.delete(e.code);
        });
    }

    public setupTouchControls(canvas: HTMLCanvasElement): void {
        let touchStartX: number = 0;
        let touchStartY: number = 0;

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Определяем направление свайпа
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Горизонтальный свайп
                if (deltaX > 30) {
                    this.onMoveRight();
                } else if (deltaX < -30) {
                    this.onMoveLeft();
                }
            } else {
                // Вертикальный свайп
                if (deltaY < -30) {
                    this.onJump();
                } else if (deltaY > 30) {
                    this.onRoll();
                }
            }
        }, { passive: false });
    }

    public destroy(): void {
        // Очистка слушателей при необходимости
    }
}

export default InputHandler;
