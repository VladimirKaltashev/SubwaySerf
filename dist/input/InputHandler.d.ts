export declare enum InputAction {
    MOVE_LEFT = "move_left",
    MOVE_RIGHT = "move_right",
    JUMP = "jump",
    SLIDE = "slide"
}
export interface IInputHandler {
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onJump: () => void;
    onSlide: () => void;
}
declare class InputHandler implements IInputHandler {
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onJump: () => void;
    onSlide: () => void;
    private keysPressed;
    constructor();
    private setupKeyboardListeners;
    setupTouchControls(canvas: HTMLCanvasElement): void;
    destroy(): void;
}
export default InputHandler;
//# sourceMappingURL=InputHandler.d.ts.map