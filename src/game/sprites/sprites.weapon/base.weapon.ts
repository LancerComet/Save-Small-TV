/// <reference path="./index.d.ts" />

import { Sprite } from '../../../core/sprite'

class Weapon extends Sprite {
  direction: TDirection
  attack: number = 0

  constructor () {
    super()
  }
}

export {
  Weapon
}
