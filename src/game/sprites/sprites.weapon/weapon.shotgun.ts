import { Weapon } from './base.weapon'
import { bitmapsToTextures } from '../../../core/utils'

const WIDTH = 8
const HEIGHT = 8
const SPEED = 3
const MAX_DISTANCE = 75  // 射程 (+50%)
const SPREAD_ANGLE = 22.5  // 散射角度（度）

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

// 方向对应的基础角度（弧度）
const DIRECTION_BASE_ANGLE: Record<TDirection, number> = {
  'R': 0,                    // 0°
  'B': Math.PI / 2,          // 90°
  'L': Math.PI,              // 180°
  'T': -Math.PI / 2          // -90° (270°)
}

/**
 * 散弹的单个弹丸 - 支持角度散射
 */
class ShotgunPellet extends Weapon {
  width = WIDTH
  height = HEIGHT
  attack = 5  // 单颗攻击力较低
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)
  maxDistance = MAX_DISTANCE
  startX = 0
  startY = 0

  // 散射角度（弧度）
  angle = 0
  // 速度分量
  velocityX = 0
  velocityY = 0

  get direction (): TDirection {
    return this._direction
  }
  set direction (direction: TDirection) {
    this._direction = direction
    this.currentTexture = DIRECTION_TEXTURE_MAPPING[direction]
  }

  constructor (param: IWeapon & { angle?: number }) {
    super()

    this.x = param.x
    this.y = param.y
    this.startX = param.x
    this.startY = param.y
    this.speed = SPEED
    this.paddingX = 3
    this.paddingY = 3
    this.direction = param.direction

    // 计算飞行角度
    const baseAngle = DIRECTION_BASE_ANGLE[param.direction]
    this.angle = baseAngle + (param.angle || 0)

    // 预计算速度分量
    this.velocityX = Math.cos(this.angle)
    this.velocityY = Math.sin(this.angle)

    this.TEXTURE_CHANGING_COUNTDOWN = false
  }

  /**
   * 按角度移动弹丸
   */
  move (deltaSpeed: number) {
    this.x += this.velocityX * deltaSpeed
    this.y += this.velocityY * deltaSpeed
  }

  isOutOfRange (): boolean {
    const dx = this.x - this.startX
    const dy = this.y - this.startY
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance > this.maxDistance
  }
}

/**
 * Shotgun - 散弹枪
 * 一次发射多颗弹丸，扇形散射
 */
class Shotgun {
  /**
   * 创建散弹（返回多个弹丸，扇形散射）
   */
  static createPellets (param: IWeapon): ShotgunPellet[] {
    const pellets: ShotgunPellet[] = []
    // 散射角度：-22.5°, 0°, +22.5° (转换为弧度)
    const spreadAngles = [
      -SPREAD_ANGLE * Math.PI / 180,
      0,
      SPREAD_ANGLE * Math.PI / 180
    ]

    for (const angleOffset of spreadAngles) {
      const pellet = new ShotgunPellet({
        x: param.x,
        y: param.y,
        direction: param.direction,
        angle: angleOffset
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
