/**
 * Chase Behavior - 追踪行为
 * 精灵朝向目标移动
 */

import { Sprite } from '../../../core/sprite'
import { getDistance, getDirection } from '../../utils/collision.ts'
import { BaseBehavior, IBehavior, BehaviorTarget } from '../base.ts'

interface IChaseConfig {
  /** 移动速度（默认使用精灵自身速度） */
  speed?: number
}

/**
 * 追踪行为 - 朝向目标移动
 */
class ChaseBehavior extends BaseBehavior {
  private readonly config: IChaseConfig

  readonly name = 'Chase'

  update (sprite: Sprite, target: BehaviorTarget, deltaTime: number): void {
    if (!target) return

    // 使用统一的距离和方向计算
    const distance = getDistance(sprite, target)

    if (distance > 0) {
      const dir = getDirection(sprite, target)
      // 使用配置速度或精灵自身速度
      const baseSpeed = this.config.speed ?? sprite.speed
      const speed = baseSpeed * deltaTime

      // 按方向移动
      sprite.x += dir.x * speed
      sprite.y += dir.y * speed
    }
  }

  clone (): IBehavior {
    return new ChaseBehavior({
      ...this.config
    })
  }

  init () {
    // ...
  }

  constructor (config?: IChaseConfig) {
    super()
    this.config = config || {}
  }
}

export {
  ChaseBehavior
}

export type {
  IChaseConfig
}
