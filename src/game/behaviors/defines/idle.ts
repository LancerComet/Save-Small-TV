import { BaseBehavior, IBehavior } from '../base.ts'

/**
 * Idle Behavior.
 * Just does nothing.
 */
class IdleBehavior extends BaseBehavior {
  readonly name = 'Idle'

  update () {
    // ...
  }

  clone (): IBehavior {
    return new IdleBehavior()
  }

  init () {
    // ...
  }
}

export {
  IdleBehavior
}
