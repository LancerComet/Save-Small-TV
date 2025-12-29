import { Sprite } from '../../../core/sprite'
import { SpriteDirection } from '../../../core/sprite/types.ts'

abstract class WeaponBase extends Sprite {
  protected _direction: SpriteDirection = null
  get direction (): SpriteDirection {
    return this._direction
  }

  set direction (value: SpriteDirection) {
    this._direction = value
  }

  attack: number = 0

  /**
   * 射击角度（弧度）
   * 用于无极方向射击
   */
  angle: number = 0

  /**
   * 速度分量（用于角度移动）
   */
  velocityX: number = 0
  velocityY: number = 0

  /**
   * 是否使用角度移动
   */
  useAngleMovement: boolean = false

  /**
   * 设置射击角度并计算速度分量
   * @param angle 角度（弧度）
   */
  setAngle (angle: number) {
    this.angle = angle
    this.velocityX = Math.cos(angle)
    this.velocityY = Math.sin(angle)
    this.useAngleMovement = true
  }

  /**
   * 按角度移动
   * @param deltaSpeed 速度增量
   */
  moveByAngle (deltaSpeed: number) {
    this.x += this.velocityX * deltaSpeed
    this.y += this.velocityY * deltaSpeed
  }
}

export {
  WeaponBase
}
