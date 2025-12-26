/**
 * Leek Death Ability - 死亡生成葱能力
 * 初音未来死亡时生成一个乱飞的葱
 */

import { LeekBoomerang } from '../sprites/enemy/enemy-bullet'
import { AbilityBase, AbilityOwner, IAbility } from './base'

class LeekDeathAbility extends AbilityBase {
  name = 'leek-death'
  private hasSpawned: boolean = false

  update (): void {
    // 此能力不在 update 中执行，而是在 onDeath 中
  }

  onDeath (owner: AbilityOwner): void {
    if (!this.enabled || this.hasSpawned) return

    this.hasSpawned = true

    // 随机方向
    const angle = Math.random() * Math.PI * 2
    const speed = 100
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed

    // 生成一个乱飞的葱
    const leek = new LeekBoomerang(owner.x, owner.y, vx, vy, 12)
    // 设置为自由飞行状态
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(leek as any).ownerDied = true

    this.pendingProjectiles.push(leek)
  }

  clone (): IAbility {
    const cloned = new LeekDeathAbility()
    cloned.hasSpawned = false
    return cloned
  }
}

export { LeekDeathAbility }
