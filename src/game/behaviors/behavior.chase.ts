/**
 * Chase Behavior - 追踪行为
 * 精灵朝向目标移动
 */

import { Sprite } from '../../core/sprite'
import { BaseBehavior, IBehavior, BehaviorTarget, BASE_FPS } from './base'

interface IChaseConfig {
  /** 移动速度（默认使用精灵自身速度） */
  speed?: number
}

/**
 * 追踪行为 - 朝向目标移动
 */
class ChaseBehavior extends BaseBehavior {
  name = 'Chase'

  private config: IChaseConfig

  constructor (config?: IChaseConfig) {
    super()
    this.config = config || {}
  }

  update (sprite: Sprite, target: BehaviorTarget, deltaTime: number): void {
    if (!target) return

    // 计算朝向目标的方向
    const dx = target.x - sprite.x
    const dy = target.y - sprite.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 0) {
      // 使用配置速度或精灵自身速度
      const baseSpeed = this.config.speed ?? sprite.speed
      const speed = baseSpeed * BASE_FPS * deltaTime

      // 归一化方向并移动
      sprite.x += (dx / distance) * speed
      sprite.y += (dy / distance) * speed
    }
  }

  clone (): IBehavior {
    return new ChaseBehavior({ ...this.config })
  }
}

export {
  ChaseBehavior
}

export type {
  IChaseConfig
}
