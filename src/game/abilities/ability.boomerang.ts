/**
 * Boomerang Ability - 回旋镖能力
 * 初音未来扔葱的攻击方式
 */

import { LeekBoomerang } from '../sprites/enemy/enemy-bullet'
import { getDistance, getDirection } from '../utils/collision'
import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from './base'

interface IBoomerangConfig {
  /** 冷却时间（秒） */
  cooldown: number
  /** 回旋镖速度 */
  speed: number
  /** 回旋镖伤害 */
  damage: number
}

const DEFAULT_CONFIG: IBoomerangConfig = {
  cooldown: 3,
  speed: 150,
  damage: 12
}

class BoomerangAbility extends AbilityBase {
  name = 'boomerang'
  private config: IBoomerangConfig
  private timer: number = 0
  private ownerRef: AbilityOwner | null = null

  constructor (config: Partial<IBoomerangConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.timer = Math.random() * this.config.cooldown * 0.5
  }

  init (owner: AbilityOwner): void {
    this.ownerRef = owner
  }

  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void {
    if (!this.enabled || !target) return

    this.ownerRef = owner
    this.timer -= deltaTime

    if (this.timer <= 0) {
      const dist = getDistance(owner, target)

      if (dist > 0) {
        const dir = getDirection(owner, target)
        const vx = dir.x * this.config.speed
        const vy = dir.y * this.config.speed

        const boomerang = new LeekBoomerang(
          owner.x,
          owner.y,
          vx,
          vy,
          this.config.damage,
          owner
        )

        this.pendingProjectiles.push(boomerang)
      }

      this.timer = this.config.cooldown
    }
  }

  clone (): IAbility {
    return new BoomerangAbility({ ...this.config })
  }
}

export { BoomerangAbility }
export type { IBoomerangConfig }
