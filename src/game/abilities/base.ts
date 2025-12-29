/**
 * Ability System is a modular framework for defining and managing abilities
 * for game entities such as players and enemies.
 */

import { Sprite } from '../../core/sprite'
import type { IProjectile } from '../projectile/types.ts'

type AbilityOwner = Sprite
type AbilityTarget = Sprite | null

/**
 * 能力接口
 */
interface IAbility {
  name: string
  enabled: boolean

  /**
   * 每帧更新能力逻辑.
   *
   * @param owner
   * @param target
   * @param deltaTime
   */
  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void

  /**
   * 初始化能力时调用, 可选.
   * @param owner
   */
  init? (owner: AbilityOwner): void

  /**
   * 能力持有者死亡时调用.
   *
   * @param owner
   * @param target
   */
  onDeath? (owner: AbilityOwner, target: AbilityTarget): void

  /**
   * 获取产生的投射物
   */
  getProjectiles (): IProjectile[]

  /**
   * 克隆能力
   */
  clone (): IAbility
}

/**
 * 能力基类
 */
abstract class AbilityBase implements IAbility {
  protected pendingProjectiles: IProjectile[] = []
  enabled: boolean = true

  abstract name: string
  abstract update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void
  abstract init (owner: AbilityOwner): void
  abstract onDeath (owner: AbilityOwner, target: AbilityTarget): void
  abstract clone (): IAbility

  getProjectiles (): IProjectile[] {
    const projectiles = [...this.pendingProjectiles]
    this.pendingProjectiles = []
    return projectiles
  }
}

export {
  AbilityBase
}

export type {
  IAbility,
  AbilityOwner,
  AbilityTarget
}
