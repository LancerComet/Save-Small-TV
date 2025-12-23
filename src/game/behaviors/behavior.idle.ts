/**
 * Idle Behavior - 静止行为
 * 精灵保持不动
 */

import { Sprite } from '../../core/sprite'
import { BaseBehavior, IBehavior, BehaviorTarget } from './base'

/**
 * 静止行为 - 不做任何移动
 */
class IdleBehavior extends BaseBehavior {
  name = 'Idle'

  update (_sprite: Sprite, _target: BehaviorTarget, _deltaTime: number): void {
    // 什么都不做
  }

  clone (): IBehavior {
    return new IdleBehavior()
  }
}

export {
  IdleBehavior
}
