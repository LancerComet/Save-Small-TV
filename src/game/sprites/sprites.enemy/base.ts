import { Sprite } from '../../../core/sprite'

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

  constructor () {
    super()
  }
}

export {
  Enemy
}
