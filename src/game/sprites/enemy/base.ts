import { Sprite } from '../../../core/sprite'
import { IBehavior, ChaseBehavior } from '../../behaviors'
import { ENEMY_ATTACK } from '../../config'

class Enemy extends Sprite {
  /**
   * Wether this sprite is dead.
   *
   * @readonly
   * @type {boolean}
   * @memberof Sprite
   */
  get isDead (): boolean {
    return this.hp <= 0
  }

  /**
   * Countdown before remove this enemy.
   */
  destroyCountdown: number = 0

  /**
   * Whether this enemy has already dropped an item.
   */
  hasDroppedItem: boolean = false

  /**
   * Whether blood effect has been spawned for this enemy.
   */
  hasSpawnedBlood: boolean = false

  /**
   * 敌人的攻击力
   */
  attack: number = ENEMY_ATTACK.DEFAULT

  /**
   * 敌人的移动行为
   * 默认为追踪行为（追踪玩家）
   */
  behavior: IBehavior = new ChaseBehavior()

  constructor () {
    super()
  }

  /**
   * 设置行为
   * @param behavior 新的行为
   */
  setBehavior (behavior: IBehavior): this {
    this.behavior = behavior
    this.behavior.init?.(this)
    return this
  }

  /**
   * 根据行为移动
   * @param target 目标精灵（如玩家），可为 null
   * @param deltaTime 时间增量（秒）
   */
  move (target: Sprite | null, deltaTime: number): void {
    this.behavior.update(this, target, deltaTime)
  }
}

export {
  Enemy
}
