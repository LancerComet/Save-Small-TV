import { Weapon } from './base.weapon'
import { bitmapsToTextures } from '../../../core/utils'

const WIDTH = 8
const HEIGHT = 8
const SPEED = 2

const COLOR_MAP: TColorMap = {
  '0': 'transparent',
  '1': '#F24C14',
  '2': '#FFCE34'
}

const BITMAPS: TBitmaps = [
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '2', '1', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '1', '2', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '2', '0', '0', '0',
    '0', '0', '0', '0', '1', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '1', '0', '0', '0',
    '0', '0', '0', '0', '2', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
]

/**
 * Relationship between texture and direction.
 */
const DIRECTION_TEXTURE_MAPPING = {
  'L': 0,
  'R': 1,
  'T': 2,
  'B': 3
}

class Bullet extends Weapon {
  width = WIDTH
  height = HEIGHT
  attack = 10
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  /**
   * Direction of this bullet.
   *
   * @private
   * @type {TDirection}
   * @memberof Bullet
   */
  private _direction: TDirection = null
  get direction () {
    return this._direction
  }
  set direction (direction: TDirection) {
    this._direction = direction
    this.currentTexture = DIRECTION_TEXTURE_MAPPING[direction]
  }

  constructor (param: IWeapon) {
    super()

    this.x = param.x
    this.y = param.y
    this.speed = SPEED
    this.paddingX = 3
    this.paddingY = 3
    this.direction = param.direction

    this.TEXTURE_CHANGING_COUNTDOWN = false
  }
}

export {
  Bullet
}
