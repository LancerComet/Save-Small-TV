import { Sprite } from '../../core/sprite'

type BehaviorTarget = Sprite | null

interface IBehavior {
  /**
   * 行为名称.
   */
  name: string

  /**
   * 每帧更新，修改 sprite 的位置.
   *
   * @param sprite 要控制的精灵
   * @param target 目标精灵（如玩家），可为 null
   * @param deltaTime 时间增量（秒）
   */
  update (sprite: Sprite, target: BehaviorTarget, deltaTime: number): void

  /**
   * 初始化行为（可选）.
   *
   * @param sprite 要控制的精灵
   */
  init? (sprite: Sprite): void

  /**
   * 克隆行为（用于为每个敌人创建独立实例）.
   */
  clone (): IBehavior
}

abstract class BaseBehavior implements IBehavior {
  abstract name: string
  abstract update (sprite: Sprite, target: BehaviorTarget, deltaTime: number): void
  abstract init (): void
  abstract clone (): IBehavior
}

export {
  BaseBehavior
}

export type {
  IBehavior,
  BehaviorTarget
}
