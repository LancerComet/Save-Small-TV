import { EnemyBullet } from '../sprites/enemy/enemy-bullet'
import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from './base'

interface IBurstConfig {
  /** 冷却时间（秒） */
  cooldown: number
  /** 子弹数量 */
  bulletCount: number
  /** 子弹速度 */
  bulletSpeed: number
  /** 子弹伤害 */
  bulletDamage: number
  /** 扩散角度（弧度），0 表示圆形发射 */
  spreadAngle: number
  /** 是否瞄准目标 */
  aimAtTarget: boolean
  /** 子弹颜色 */
  bulletColor: string
}

const DEFAULT_CONFIG: IBurstConfig = {
  cooldown: 3,
  bulletCount: 8,
  bulletSpeed: 150, // pixels per second
  bulletDamage: 8,
  spreadAngle: 0, // 0 = 360度圆形
  aimAtTarget: false,
  bulletColor: '#ff6600'
}

/**
 * Burst Ability - 爆发射击能力
 * 一次发射多发子弹（扇形或圆形）
 */
class BurstAbility extends AbilityBase {
  name = 'burst'
  private config: IBurstConfig
  private timer: number = 0

  constructor (config: Partial<IBurstConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.timer = Math.random() * this.config.cooldown + 1
  }

  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void {
    if (!this.enabled) return

    this.timer -= deltaTime

    if (this.timer <= 0) {
      const { bulletCount, bulletSpeed, bulletDamage, spreadAngle, aimAtTarget, bulletColor } = this.config

      // 计算基础角度
      let baseAngle = 0
      if (aimAtTarget && target) {
        baseAngle = Math.atan2(target.y - owner.y, target.x - owner.x)
      }

      // 计算每个子弹的角度
      const totalSpread = spreadAngle === 0 ? Math.PI * 2 : spreadAngle
      const angleStep = totalSpread / bulletCount
      const startAngle = baseAngle - totalSpread / 2 + angleStep / 2

      for (let i = 0; i < bulletCount; i++) {
        const angle = startAngle + angleStep * i
        const vx = Math.cos(angle) * bulletSpeed
        const vy = Math.sin(angle) * bulletSpeed

        const bullet = new EnemyBullet(
          owner.x,
          owner.y,
          vx,
          vy,
          bulletDamage,
          3,
          bulletColor
        )

        this.pendingProjectiles.push(bullet)
      }

      this.timer = this.config.cooldown
    }
  }

  clone (): IAbility {
    return new BurstAbility({ ...this.config })
  }
}

export { BurstAbility }
export type { IBurstConfig }
