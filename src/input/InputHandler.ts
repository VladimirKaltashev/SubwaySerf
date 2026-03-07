export enum InputAction {
  MOVE_LEFT,
  MOVE_RIGHT,
  JUMP,
  ROLL
}

export interface IInputHandler {
  onMoveLeft: (() => void) | null;
  onMoveRight: (() => void) | null;
  onJump: (() => void) | null;
  onRoll: (() => void) | null;
  
  handleKey(key: string, isPressed: boolean): void;
  setupTouchControls(canvas: HTMLCanvasElement): void;
}

export class InputHandler implements IInputHandler {
  onMoveLeft: (() => void) | null = null;
  onMoveRight: (() => void) | null = null;
  onJump: (() => void) | null = null;
  onRoll: (() => void) | null = null;
  
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  
  constructor() {
    this.setupKeyboardListeners();
  }
  
  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.handleKey(e.code, true);
    });
    
    window.addEventListener('keyup', (e) => {
      this.handleKey(e.code, false);
    });
  }
  
  handleKey(key: string, isPressed: boolean): void {
    if (!isPressed) return;
    
    switch (key) {
      case 'ArrowLeft':
      case 'KeyA':
        if (this.onMoveLeft) this.onMoveLeft();
        break;
        
      case 'ArrowRight':
      case 'KeyD':
        if (this.onMoveRight) this.onMoveRight();
        break;
        
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        if (this.onJump) this.onJump();
        break;
        
      case 'ArrowDown':
      case 'KeyS':
        if (this.onRoll) this.onRoll();
        break;
    }
  }
  
  setupTouchControls(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      
      const minSwipeDistance = 30;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Горизонтальный свайп
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            if (this.onMoveRight) this.onMoveRight();
          } else {
            if (this.onMoveLeft) this.onMoveLeft();
          }
        }
      } else {
        // Вертикальный свайп
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY < 0) {
            if (this.onJump) this.onJump();
          } else {
            if (this.onRoll) this.onRoll();
          }
        }
      }
    }, { passive: false });
  }
}
