/**
 * Ability System - 能力系统
 *
 * 将攻击和特殊效果逻辑从 Enemy 解耦，实现能力的自由组合
 */

export { AbilityBase } from './base'
export type { IAbility, IProjectile, AbilityOwner, AbilityTarget } from './base'

export { ShootAbility } from './ability.shoot'
export type { IShootConfig } from './ability.shoot'

export { BurstAbility } from './ability.burst'
export type { IBurstConfig } from './ability.burst'

export { HomingAbility } from './ability.homing'
export type { IHomingConfig } from './ability.homing'

export { ExplodeAbility } from './ability.explode'
export type { IExplodeConfig } from './ability.explode'

export { BasketballAbility } from './ability.basketball'
export type { IBasketballConfig } from './ability.basketball'

export { BoomerangAbility } from './ability.boomerang'
export type { IBoomerangConfig } from './ability.boomerang'
