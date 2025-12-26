/**
 * Behavior System - 行为系统
 * 
 * 将移动逻辑从 Enemy 解耦，实现外观与行为的自由组合
 */

export { BaseBehavior } from './base'
export type { IBehavior, BehaviorTarget } from './base'

export { ChaseBehavior } from './behavior.chase'
export type { IChaseConfig } from './behavior.chase'

export { FixedBehavior } from './behavior.fixed'
export type { IFixedConfig } from './behavior.fixed'

export { IdleBehavior } from './behavior.idle'
