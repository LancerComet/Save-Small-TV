/**
 * Behavior System - Base definitions
 * 行为系统基础定义
 * 
 * 行为系统将移动逻辑从 Enemy 类中解耦，
 * 使得任意敌人外观可以搭配任意移动行为
 */

import { Sprite } from '../../core/sprite'

// 前向声明，避免循环依赖
type BehaviorTarget = Sprite | null

/**
 * 行为接口
 */
interface IBehavior {
  /** 行为名称 */
  name: string

  /**
   * 每帧更新，修改 sprite 的位置
   * @param sprite 要控制的精灵
   * @param target 目标精灵（如玩家），可为 null
   * @param deltaTime 时间增量（秒）
   */
  update (sprite: Sprite, target: BehaviorTarget, deltaTime: number): void

  /**
   * 初始化行为（可选）
   * @param sprite 要控制的精灵
   */
  init? (sprite: Sprite): void

  /**
   * 克隆行为（用于为每个敌人创建独立实例）
   */
  clone (): IBehavior
}

/**
 * 行为基类
 */
abstract class BaseBehavior implements IBehavior {
  abstract name: string

  abstract update (sprite: Sprite, target: BehaviorTarget, deltaTime: number): void

  init (_sprite: Sprite): void {
    // 默认空实现
  }

  abstract clone (): IBehavior
}

// 60 FPS 基准
const BASE_FPS = 60

export {
  BaseBehavior,
  BASE_FPS
}

export type {
  IBehavior,
  BehaviorTarget
}
