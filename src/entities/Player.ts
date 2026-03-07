export enum Lane {
  LEFT = -2,
  CENTER_LEFT = -1,
  CENTER = 0,
  CENTER_RIGHT = 1,
  RIGHT = 2
}

export interface IPlayer {
  lane: Lane;
  x: number;
  y: number;
  z: number;
  isJumping: boolean;
  isRolling: boolean;
  width: number;
  height: number;
  depth: number;
  
  changeLane(direction: number): void;
  jump(): void;
  roll(): void;
  update(deltaTime: number): void;
  getLaneX(lane: Lane): number;
}

export class Player implements IPlayer {
  private _lane: Lane = Lane.CENTER;
  private _y: number = 0;
  private _z: number = 0;
  private _isJumping: boolean = false;
  private _isRolling: boolean = false;
  
  private verticalVelocity: number = 0;
  private rollTimer: number = 0;
  
  private readonly gravity: number = -30;
  private readonly jumpForce: number = 15;
  private readonly rollDuration: number = 0.8;
  private readonly normalHeight: number = 2;
  private readonly rollHeight: number = 1;
  
  constructor(
    private laneWidth: number = 3,
    private startX: number = 0
  ) {}
  
  get lane(): Lane {
    return this._lane;
  }
  
  get x(): number {
    return this.getLaneX(this._lane);
  }
  
  get y(): number {
    return this._y;
  }
  
  get z(): number {
    return this._z;
  }
  
  get isJumping(): boolean {
    return this._isJumping;
  }
  
  get isRolling(): boolean {
    return this._isRolling;
  }
  
  get width(): number {
    return 1.5;
  }
  
  get height(): number {
    return this._isRolling ? this.rollHeight : this.normalHeight;
  }
  
  get depth(): number {
    return 1.5;
  }
  
  getLaneX(lane: Lane): number {
    return this.startX + lane * this.laneWidth;
  }
  
  changeLane(direction: number): void {
    const newLane = this._lane + direction;
    if (newLane >= Lane.LEFT && newLane <= Lane.RIGHT) {
      this._lane = newLane;
    }
  }
  
  jump(): void {
    if (!this._isJumping) {
      this.verticalVelocity = this.jumpForce;
      this._isJumping = true;
      
      // Если был в приседе, встаем
      if (this._isRolling) {
        this._isRolling = false;
        this._y = this.normalHeight / 2;
      }
    }
  }
  
  roll(): void {
    if (!this._isRolling && !this._isJumping) {
      this._isRolling = true;
      this.rollTimer = this.rollDuration;
      this._y = this.rollHeight / 2;
    }
  }
  
  update(deltaTime: number): void {
    // Обновляем таймер приседа
    if (this._isRolling) {
      this.rollTimer -= deltaTime;
      if (this.rollTimer <= 0) {
        this._isRolling = false;
        if (!this._isJumping) {
          this._y = this.normalHeight / 2;
        }
      }
    }
    
    // Физика прыжка
    if (this._isJumping) {
      this._y += this.verticalVelocity * deltaTime;
      this.verticalVelocity += this.gravity * deltaTime;
      
      const minHeight = this._isRolling ? this.rollHeight / 2 : this.normalHeight / 2;
      
      if (this._y <= minHeight) {
        this._y = minHeight;
        this._isJumping = false;
        this.verticalVelocity = 0;
        
        // Если закончили прыжок и не в приседе, возвращаем нормальную высоту
        if (!this._isRolling) {
          this._y = this.normalHeight / 2;
        }
      }
    } else if (!this._isRolling) {
      this._y = this.normalHeight / 2;
    }
    
    // Движение вперед
    this._z += 10 * deltaTime;
  }
}
