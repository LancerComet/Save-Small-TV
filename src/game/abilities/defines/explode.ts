import { ConstructorOf } from '../../../types'
import { IProjectile } from '../../projectile/types.ts'
import { AbilityBase, AbilityOwner, IAbility } from '../base.ts'

interface IExplodeConfig {
  /**
   * 碎片数量/
   */
  fragmentCount: number

  /**
   * 碎片速度, pixels per second.
   */
  fragmentSpeed: number

  /**
   * 碎片伤害.
   */
  fragmentDamage: number

  /**
   * 碎片类型.
   */
  FragmentType: ConstructorOf<IProjectile>
}

/**
 * 死亡爆炸能力, 死亡时向四周发射碎片.
 */
class ExplodeAbility extends AbilityBase {
  private readonly config: IExplodeConfig
  private hasExploded: boolean = false

  readonly name = 'explode'

  onDeath (owner: AbilityOwner): void {
    if (!this.enabled || this.hasExploded) {
      return
    }

    this.hasExploded = true

    const { fragmentCount, fragmentSpeed, fragmentDamage } = this.config
    const angleStep = (Math.PI * 2) / fragmentCount

    for (let i = 0; i < fragmentCount; i++) {
      const angle = angleStep * i
      const fragment = new this.config.FragmentType(
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

  update () {
    // ...
  }

  init () {
    // ...
  }

  constructor (config: IExplodeConfig) {
    super()
    this.config = config
  }
}

export {
  ExplodeAbility
}
