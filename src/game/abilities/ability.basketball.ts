/**
 * Basketball Ability - 投掷篮球能力
 * 小黑子的标志性攻击方式
 */

import { BasketballBullet } from '../sprites/enemy/enemy-bullet'
import { getDistance, getDirection } from '../utils/collision'
import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from './base'

interface IBasketballConfig {
  /** 冷却时间（秒） */
  cooldown: number
  /** 篮球速度 */
  ballSpeed: number
  /** 篮球伤害 */
  ballDamage: number
  /** 篮球大小 */
  ballSize: number
}

const DEFAULT_CONFIG: IBasketballConfig = {
  cooldown: 2.5,
  ballSpeed: 150, // pixels per second
  ballDamage: 15,
  ballSize: 6
}

class BasketballAbility extends AbilityBase {
  name = 'basketball'
  private config: IBasketballConfig
  private timer: number = 0

  constructor (config: Partial<IBasketballConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
    // 随机初始冷却
    this.timer = Math.random() * this.config.cooldown * 0.5
  }

  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void {
    if (!this.enabled || !target) return

    this.timer -= deltaTime

    if (this.timer <= 0) {
      const dist = getDistance(owner, target)

      if (dist > 0) {
        const dir = getDirection(owner, target)
        const vx = dir.x * this.config.ballSpeed
        const vy = dir.y * this.config.ballSpeed

        const ball = new BasketballBullet(
          owner.x,
          owner.y,
          vx,
          vy,
          this.config.ballDamage,
          this.config.ballSize
        )

        this.pendingProjectiles.push(ball)
      }

      this.timer = this.config.cooldown
    }
  }

  clone (): IAbility {
    return new BasketballAbility({ ...this.config })
  }
}

export { BasketballAbility }
export type { IBasketballConfig }
