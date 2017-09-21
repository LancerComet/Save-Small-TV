import * as weapon from '../sprites.weapon'
import { Sprite } from '../../../core/sprite'
import { bitmapsToTextures } from '../../../core/utils'

const WIDTH = 8
const HEIGHT = 8
const HP = 1

const COLOR_MAP: TColorMap = {
  '0': '#000',
  '1': '#6dc2ca',
  '2': '#deeed6'
}

const BITMAPS: TBitmaps = [
  [
    '0', '0', '1', '0', '0', '1', '0', '0',
    '0', '0', '0', '1', '1', '0', '0', '0',
    '1', '1', '1', '1', '1', '1', '1', '1',
    '1', '2', '2', '2', '2', '2', '2', '1',
    '1', '2', '1', '2', '2', '1', '2', '1',
    '1', '2', '1', '2', '2', '1', '2', '1',
    '1', '2', '2', '2', '2', '2', '2', '1',
    '1', '1', '1', '1', '1', '1', '1', '1',
  ]
]

class SmallTV extends Sprite {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  /**
   * Current count of weapons.
   *
   * @type {number}
   * @memberof SmallTV
   */
  weaponCount: number = 0

  /**
   * Weapon direction.
   *
   * @type {TDirection}
   * @memberof SmallTV
   */
  weaponDirection: TDirection = null

  /**
   * Current weapon availablity countdown.
   *
   * @type {number}
   * @memberof SmallTV
   */
  weaponCountdown: number = 0

  /**
   * Current weapon class.
   *
   * @type {Sprite}
   * @memberof SmallTV
   */
  currentWeaponClass = null

  constructor () {
    super()
    this.x = 0
    this.y = 0
    this.hp = HP
    this.speed = 1
    this.padding = 0

    this.weaponCount = 1
    this.weaponDirection = 'L'
    this.weaponCountdown = 0
    this.currentWeaponClass = weapon.Bullet

    this.TEXTURE_CHANGING_COUNTDOWN = false

    this.offscreenDrawingExec()
  }
}

export {
  SmallTV
}
