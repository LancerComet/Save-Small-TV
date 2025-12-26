/**
 * Shoot Ability - 射击能力
 * 向目标发射普通子弹
 */

import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from './base'
import { EnemyBullet } from '../sprites/enemy/enemy-bullet'
import { getDistance, getDirection } from '../utils/collision'

interface IShootConfig {
  /** 冷却时间（秒） */
  cooldown: number
  /** 子弹速度 */
  bulletSpeed: number
  /** 子弹伤害 */
  bulletDamage: number
  /** 子弹大小 */
  bulletSize: number
  /** 子弹颜色 */
  bulletColor: string
}

const DEFAULT_CONFIG: IShootConfig = {
  cooldown: 2,
  bulletSpeed: 180, // pixels per second
  bulletDamage: 10,
  bulletSize: 4,
  bulletColor: '#ff0000'
}

class ShootAbility extends AbilityBase {
  name = 'shoot'
  private config: IShootConfig
  private timer: number = 0

  constructor (config: Partial<IShootConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
    // 随机初始冷却，避免所有敌人同时射击
    this.timer = Math.random() * this.config.cooldown
  }

  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void {
    if (!this.enabled || !target) return

    this.timer -= deltaTime

    if (this.timer <= 0) {
      // 使用统一的距离和方向计算
      const dist = getDistance(owner, target)

      if (dist > 0) {
        const dir = getDirection(owner, target)
        const vx = dir.x * this.config.bulletSpeed
        const vy = dir.y * this.config.bulletSpeed

        const bullet = new EnemyBullet(
          owner.x,
          owner.y,
          vx,
          vy,
          this.config.bulletDamage,
          this.config.bulletSize,
          this.config.bulletColor
        )

        this.pendingProjectiles.push(bullet)
      }

      this.timer = this.config.cooldown
    }
  }

  clone (): IAbility {
    return new ShootAbility({ ...this.config })
  }
}

export { ShootAbility }
export type { IShootConfig }
