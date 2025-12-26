/**
 * Ability System - Base definitions
 * 能力系统基础定义
 *
 * 能力系统将攻击、特殊效果等逻辑从 Enemy 类中解耦，
 * 使得任意敌人可以自由组合多种能力
 */

import { Sprite } from '../../core/sprite'

// 前向声明
type AbilityOwner = Sprite
type AbilityTarget = Sprite | null

/**
 * 投射物接口（子弹、火球等）
 */
interface IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  update (deltaTime: number): void
  draw (ctx: CanvasRenderingContext2D): void
  isOutOfBounds (width: number, height: number): boolean
}

/**
 * 能力接口
 */
interface IAbility {
  /** 能力名称 */
  name: string

  /** 能力是否启用 */
  enabled: boolean

  /**
   * 每帧更新
   * @param owner 能力拥有者
   * @param target 目标（如玩家）
   * @param deltaTime 时间增量（秒）
   */
  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void

  /**
   * 初始化能力（可选）
   * @param owner 能力拥有者
   */
  init? (owner: AbilityOwner): void

  /**
   * 当拥有者死亡时触发（可选）
   * @param owner 能力拥有者
   * @param target 目标
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
  abstract name: string
  enabled: boolean = true
  protected pendingProjectiles: IProjectile[] = []

  abstract update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void

  init (_owner: AbilityOwner): void {
    // 默认空实现
  }

  onDeath (_owner: AbilityOwner, _target: AbilityTarget): void {
    // 默认空实现
  }

  getProjectiles (): IProjectile[] {
    const projectiles = [...this.pendingProjectiles]
    this.pendingProjectiles = []
    return projectiles
  }

  abstract clone (): IAbility
}

export {
  AbilityBase
}

export type {
  IAbility,
  IProjectile,
  AbilityOwner,
  AbilityTarget
}
