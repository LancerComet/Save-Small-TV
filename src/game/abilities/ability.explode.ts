/**
 * Explode Ability - 死亡爆炸能力
 * 死亡时向四周发射碎片
 */

import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from './base'
import { ExplosionFragment } from '../sprites/enemy/enemy-bullet'

interface IExplodeConfig {
  /** 碎片数量 */
  fragmentCount: number
  /** 碎片速度 */
  fragmentSpeed: number
  /** 碎片伤害 */
  fragmentDamage: number
}

const DEFAULT_CONFIG: IExplodeConfig = {
  fragmentCount: 12,
  fragmentSpeed: 180, // pixels per second
  fragmentDamage: 20
}

class ExplodeAbility extends AbilityBase {
  name = 'explode'
  private config: IExplodeConfig
  private hasExploded: boolean = false

  constructor (config: Partial<IExplodeConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  update (_owner: AbilityOwner, _target: AbilityTarget, _deltaTime: number): void {
    // 此能力不在 update 中执行，而是在 onDeath 中
  }

  onDeath (owner: AbilityOwner, _target: AbilityTarget): void {
    if (!this.enabled || this.hasExploded) return

    this.hasExploded = true

    const { fragmentCount, fragmentSpeed, fragmentDamage } = this.config
    const angleStep = (Math.PI * 2) / fragmentCount

    for (let i = 0; i < fragmentCount; i++) {
      const angle = angleStep * i
      const fragment = new ExplosionFragment(
        owner.x,
        owner.y,
        angle,
        fragmentSpeed,
        fragmentDamage
      )

      this.pendingProjectiles.push(fragment)
    }
  }

  clone (): IAbility {
    const cloned = new ExplodeAbility({ ...this.config })
    cloned.hasExploded = false
    return cloned
  }
}

export { ExplodeAbility }
export type { IExplodeConfig }
