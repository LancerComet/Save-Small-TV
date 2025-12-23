import { Weapon } from './base.weapon'
import { bitmapsToTextures } from '../../../core/utils'

const WIDTH = 8
const HEIGHT = 8
const SPEED = 3
const MAX_DISTANCE = 75  // 射程 (+50%)

const COLOR_MAP: TColorMap = {
  '0': 'transparent',
  '1': '#00ff00',
  '2': '#66ff66',
  '3': '#ccffcc'
}

const BITMAPS: TBitmaps = [
  // Left
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '3', '2', '1', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
  // Right
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '1', '2', '3', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
  // Top
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '3', '0', '0', '0', '0',
    '0', '0', '0', '2', '0', '0', '0', '0',
    '0', '0', '0', '1', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
  // Bottom
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '1', '0', '0', '0', '0',
    '0', '0', '0', '2', '0', '0', '0', '0',
    '0', '0', '0', '3', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
]

const DIRECTION_TEXTURE_MAPPING = {
  'L': 0,
  'R': 1,
  'T': 2,
  'B': 3
}

/**
 * 散弹的单个弹丸
 */
class ShotgunPellet extends Weapon {
  width = WIDTH
  height = HEIGHT
  attack = 5  // 单颗攻击力较低
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)
  maxDistance = MAX_DISTANCE
  startX = 0
  startY = 0

  // 散射偏移
  offsetX = 0
  offsetY = 0

  get direction (): TDirection {
    return this._direction
  }
  set direction (direction: TDirection) {
    this._direction = direction
    this.currentTexture = DIRECTION_TEXTURE_MAPPING[direction]
  }

  constructor (param: IWeapon & { offsetX?: number, offsetY?: number }) {
    super()

    this.x = param.x
    this.y = param.y
    this.startX = param.x
    this.startY = param.y
    this.speed = SPEED
    this.paddingX = 3
    this.paddingY = 3
    this.direction = param.direction
    this.offsetX = param.offsetX || 0
    this.offsetY = param.offsetY || 0

    this.TEXTURE_CHANGING_COUNTDOWN = false
  }

  isOutOfRange (): boolean {
    const dx = Math.abs(this.x - this.startX)
    const dy = Math.abs(this.y - this.startY)
    return Math.max(dx, dy) > this.maxDistance
  }
}

/**
 * Shotgun - 散弹枪
 * 一次发射多颗弹丸，范围广但射程最短
 */
class Shotgun {
  /**
   * 创建散弹（返回多个弹丸）
   */
  static createPellets (param: IWeapon): ShotgunPellet[] {
    const pellets: ShotgunPellet[] = []
    const spreadOffsets = [-4, 0, 4]  // 三颗弹丸的散射偏移

    for (const offset of spreadOffsets) {
      let offsetX = 0
      let offsetY = 0

      // 根据方向计算垂直于发射方向的偏移
      if (param.direction === 'L' || param.direction === 'R') {
        offsetY = offset
      } else {
        offsetX = offset
      }

      const pellet = new ShotgunPellet({
        x: param.x + offsetX,
        y: param.y + offsetY,
        direction: param.direction,
        offsetX,
        offsetY
      })

      pellets.push(pellet)
    }

    return pellets
  }
}

export {
  ShotgunPellet,
  Shotgun
}
