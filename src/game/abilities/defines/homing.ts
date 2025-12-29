import { ConstructorOf } from '../../../types'
import { IHomingProjectile } from '../../projectile/types.ts'
import { getDistance, getDirection } from '../../utils/collision.ts'
import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from '../base.ts'

interface IHomingConfig {
  /**
   * 冷却时间 (秒).
   */
  cooldown: number

  /**
   * 子弹速度, pixels per second.
   */
  bulletSpeed: number

  /**
   * 子弹伤害.
   */
  bulletDamage: number

  /**
   * 转向速度.
   */
  turnSpeed: number

  /**
   * 子弹存活时间（秒）.
   */
  lifetime: number

  /**
   * 子弹构造类.
   * @constructor
   */
  BulletType: ConstructorOf<IHomingProjectile>
}

/**
 * 追踪弹能力, 发射会追踪目标的子弹.
 */
class HomingAbility extends AbilityBase {
  readonly name = 'homing'

  private readonly config: IHomingConfig
  private timer: number = 0
  private activeBullets: IHomingProjectile[] = []
  private currentTarget: AbilityTarget = null

  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number) {
    if (!this.enabled) return

    // 更新目标引用（实例级别，避免不同敌人互相污染）
    this.currentTarget = target

    this.timer -= deltaTime

    if (this.timer <= 0 && target) {
      const { bulletSpeed, bulletDamage, turnSpeed, lifetime } = this.config

      const bullet = new this.config.BulletType(
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

  init () {
  }

  onDeath () {
  }

  constructor (config: IHomingConfig) {
    super()
    this.config = config
    this.timer = Math.random() * this.config.cooldown + 2
  }
}

export {
  HomingAbility
}
