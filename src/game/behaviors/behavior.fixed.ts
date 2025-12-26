/**
 * Fixed Behavior - 固定方向移动行为
 * 精灵按固定速度向量移动，忽略目标
 */

import { Sprite } from '../../core/sprite'
import { BaseBehavior, IBehavior, BehaviorTarget } from './base'

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
  name = 'Fixed'

  private velocityX: number
  private velocityY: number

  constructor (config: IFixedConfig) {
    super()
    this.velocityX = config.velocityX
    this.velocityY = config.velocityY
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

  /**
   * 静态工厂方法：创建水平移动行为
   * @param direction 1 = 向右, -1 = 向左
   * @param speed 速度
   */
  static horizontal (direction: 1 | -1, speed: number): FixedBehavior {
    return new FixedBehavior({
      velocityX: direction * speed,
      velocityY: 0
    })
  }

  /**
   * 静态工厂方法：创建垂直移动行为
   * @param direction 1 = 向下, -1 = 向上
   * @param speed 速度
   */
  static vertical (direction: 1 | -1, speed: number): FixedBehavior {
    return new FixedBehavior({
      velocityX: 0,
      velocityY: direction * speed
    })
  }
}

export {
  FixedBehavior
}

export type {
  IFixedConfig
}
