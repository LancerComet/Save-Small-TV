/**
 * Fixed Behavior - 固定方向移动行为
 * 精灵按固定速度向量移动，忽略目标
 */

import { Sprite } from '../../../core/sprite'
import { BaseBehavior, IBehavior, BehaviorTarget } from '../base.ts'

interface IFixedConfig {
  /** X 方向速度 */
  velocityX: number
  /** Y 方向速度 */
  velocityY: number
}

/**
 * 固定方向移动行为
 */
class FixedBehavior extends BaseBehavior {
  private readonly velocityX: number
  private readonly velocityY: number

  readonly name = 'Fixed'

  static createHorizontalBehavior (direction: 1 | -1, speed: number): FixedBehavior {
    return new FixedBehavior({
      velocityX: direction * speed,
      velocityY: 0
    })
  }

  static createVerticalBehavior (direction: 1 | -1, speed: number): FixedBehavior {
    return new FixedBehavior({
      velocityX: 0,
      velocityY: direction * speed
    })
  }

  update (sprite: Sprite, _target: BehaviorTarget, deltaTime: number): void {
    sprite.x += this.velocityX * deltaTime
    sprite.y += this.velocityY * deltaTime
  }

  clone (): IBehavior {
    return new FixedBehavior({
      velocityX: this.velocityX,
      velocityY: this.velocityY
    })
  }

  init () {
    // ...
  }

  constructor (config: IFixedConfig) {
    super()
    this.velocityX = config.velocityX
    this.velocityY = config.velocityY
  }
}

export {
  FixedBehavior
}

export type {
  IFixedConfig
}
