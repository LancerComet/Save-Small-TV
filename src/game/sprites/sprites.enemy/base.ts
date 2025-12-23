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

  constructor () {
    super()
  }
}

export {
  Enemy
}
