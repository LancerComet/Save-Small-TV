/// <reference path="./index.d.ts" />

import { Sprite } from '../../../core/sprite'

class Weapon extends Sprite {
  protected _direction: TDirection = null
  get direction (): TDirection {
    return this._direction
  }
  set direction (value: TDirection) {
    this._direction = value
  }

  attack: number = 0

  constructor () {
    super()
  }
}

export {
  Weapon
}
