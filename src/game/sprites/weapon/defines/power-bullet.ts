import { SpriteColorMap, SpriteBitmaps, SpriteDirection } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { IWeapon } from '../types.ts'
import { WeaponBase } from './_base.ts'

const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#ff0000',
  2: '#ff6600',
  3: '#ffcc00'
}

const BITMAPS: SpriteBitmaps = [
  // Left
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '3', '2', '1', '1', '0', '0',
    '0', '0', '3', '2', '1', '1', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0'
  ],
  // Right
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '1', '1', '2', '3', '0', '0',
    '0', '0', '1', '1', '2', '3', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0'
  ],
  // Top
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '3', '3', '0', '0', '0',
    '0', '0', '0', '2', '2', '0', '0', '0',
    '0', '0', '0', '1', '1', '0', '0', '0',
    '0', '0', '0', '1', '1', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0'
  ],
  // Bottom
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '1', '1', '0', '0', '0',
    '0', '0', '0', '1', '1', '0', '0', '0',
    '0', '0', '0', '2', '2', '0', '0', '0',
    '0', '0', '0', '3', '3', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0'
  ]
]

/**
 * Relationship between texture and direction.
 */
const DIRECTION_TEXTURE_MAPPING = {
  L: 0,
  R: 1,
  T: 2,
  B: 3
}

const WIDTH = 8
const HEIGHT = 8
const SPEED = 120
const MAX_DISTANCE = 200

/**
 * PowerBullet - 强力子弹
 * 攻击力更高，但射程较短
 */
class PowerBullet extends WeaponBase {
  width = WIDTH
  height = HEIGHT
  attack = 30
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)
  maxDistance = MAX_DISTANCE
  startX = 0
  startY = 0

  get direction (): SpriteDirection {
    return this._direction
  }

  set direction (direction: SpriteDirection) {
    this._direction = direction
    this.currentTexture = DIRECTION_TEXTURE_MAPPING[direction]
  }

  constructor (param: IWeapon) {
    super()

    this.x = param.x
    this.y = param.y
    this.startX = param.x
    this.startY = param.y
    this.speed = SPEED
    this.paddingX = 2
    this.paddingY = 2
    this.direction = param.direction

    this.TEXTURE_CHANGING_COUNTDOWN = false
  }

  /**
   * 检查是否超出射程
   */
  isOutOfRange (): boolean {
    const dx = Math.abs(this.x - this.startX)
    const dy = Math.abs(this.y - this.startY)
    return Math.max(dx, dy) > this.maxDistance
  }
}

export {
  PowerBullet
}
