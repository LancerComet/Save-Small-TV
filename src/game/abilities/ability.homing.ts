/**
 * Homing Ability - 追踪弹能力
 * 发射会追踪目标的子弹
 */

import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from './base'
import { HomingBullet } from '../sprites/enemy/enemy-bullet'
import { getDistance, getDirection } from '../utils/collision'

interface IHomingConfig {
  /** 冷却时间（秒） */
  cooldown: number
  /** 子弹速度 */
  bulletSpeed: number
  /** 子弹伤害 */
  bulletDamage: number
  /** 转向速度 */
  turnSpeed: number
  /** 子弹存活时间（秒） */
  lifetime: number
}

const DEFAULT_CONFIG: IHomingConfig = {
  cooldown: 4,
  bulletSpeed: 1.5,
  bulletDamage: 15,
  turnSpeed: 0.03,
  lifetime: 6
}

class HomingAbility extends AbilityBase {
  name = 'homing'
  private config: IHomingConfig
  private timer: number = 0
  private activeBullets: HomingBullet[] = []
  private currentTarget: AbilityTarget = null

  constructor (config: Partial<IHomingConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.timer = Math.random() * this.config.cooldown + 2
  }

  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void {
    if (!this.enabled) return

    // 更新目标引用（实例级别，避免不同敌人互相污染）
    this.currentTarget = target

    this.timer -= deltaTime

    if (this.timer <= 0 && target) {
      const { bulletSpeed, bulletDamage, turnSpeed, lifetime } = this.config

      const bullet = new HomingBullet(
        owner.x,
        owner.y,
        bulletSpeed,
        bulletDamage,
        turnSpeed,
        lifetime
      )

      // 使用统一的距离和方向计算
      const dist = getDistance(owner, target)
      if (dist > 0) {
        const dir = getDirection(owner, target)
        bullet.vx = dir.x * bulletSpeed
        bullet.vy = dir.y * bulletSpeed
      }

      bullet.setTarget(target)
      this.activeBullets.push(bullet)
      this.pendingProjectiles.push(bullet)

      this.timer = this.config.cooldown
    }

    // 更新活动的追踪弹目标
    for (const bullet of this.activeBullets) {
      if (this.currentTarget) {
        bullet.setTarget(this.currentTarget)
      }
    }

    // 清理过期的追踪弹引用
    this.activeBullets = this.activeBullets.filter(b => b.lifetime > 0)
  }

  clone (): IAbility {
    return new HomingAbility({ ...this.config })
  }
}

export { HomingAbility }
export type { IHomingConfig }
