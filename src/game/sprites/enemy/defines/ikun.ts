import { Sprite } from '../../../../core/sprite'
import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from '../../../abilities/base.ts'
import { IProjectile } from '../../../projectile/types.ts'
import { getDirection, getDistance } from '../../../utils/collision.ts'
import { Enemy } from '../base.ts'

const WIDTH = 16
const HEIGHT = 14
const HP = 18

// 小黑子配色
const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#aaaaaa', // 浅灰刘海
  2: '#777777', // 深灰刘海
  3: '#ffcc66', // 黄色鸡脸
  4: '#ff4444', // 红腮红
  5: '#000000', // 黑色眼睛
  6: '#ffffff', // 白色眼睛/高光
  7: '#ff8833', // 橙色嘴
  8: '#333333', // 黑色衣服
  9: '#cc6633', // 篮球橙
  a: '#994422' // 篮球纹路
}

// 完全按图片：左边篮球、灰刘海、鸡头、黑衣服
const BITMAPS: SpriteBitmaps = [
  [
    // 第一帧
    '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '0', '0', '0', '0',
    '0', '0', '0', '0', '1', '2', '1', '1', '1', '1', '1', '2', '1', '0', '0', '0',
    '0', '0', '0', '0', '1', '1', '2', '1', '1', '1', '2', '1', '1', '0', '0', '0',
    '0', '0', '0', '0', '1', '1', '1', '2', '2', '2', '1', '1', '1', '0', '0', '0',
    '0', '0', '0', '8', '3', '3', '5', '6', '3', '5', '6', '3', '3', '8', '0', '0',
    '0', '0', '0', '8', '4', '3', '5', '5', '3', '5', '5', '3', '4', '8', '0', '0',
    '0', '0', '0', '8', '3', '3', '3', '3', '3', '3', '3', '3', '3', '8', '0', '0',
    '0', '0', '0', '0', '8', '3', '3', '7', '7', '3', '3', '3', '8', '0', '0', '0',
    '0', '0', '0', '0', '0', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0', '0',
    '0', '9', 'a', '9', '0', '8', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0',
    '9', '9', 'a', '9', '9', '8', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0',
    'a', 'a', '9', 'a', 'a', '8', '8', '0', '0', '0', '0', '8', '8', '0', '0', '0',
    '9', '9', 'a', '9', '9', '8', '0', '0', '0', '0', '0', '0', '8', '0', '0', '0',
    '0', '9', 'a', '9', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
  ],
  [
    // 第二帧 - 愤怒表情
    '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '0', '0', '0', '0',
    '0', '0', '0', '0', '1', '2', '1', '1', '1', '1', '1', '2', '1', '0', '0', '0',
    '0', '0', '0', '0', '1', '1', '2', '1', '1', '1', '2', '1', '1', '0', '0', '0',
    '0', '0', '0', '0', '1', '8', '8', '2', '2', '8', '8', '1', '1', '0', '0', '0',
    '0', '0', '0', '8', '3', '3', '5', '6', '3', '5', '6', '3', '3', '8', '0', '0',
    '0', '0', '0', '8', '4', '3', '5', '5', '3', '5', '5', '3', '4', '8', '0', '0',
    '0', '0', '0', '8', '3', '3', '3', '3', '3', '3', '3', '3', '3', '8', '0', '0',
    '0', '0', '0', '0', '8', '3', '7', '7', '7', '7', '3', '3', '8', '0', '0', '0',
    '0', '0', '0', '0', '0', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0', '0',
    '0', '9', 'a', '9', '0', '8', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0',
    '9', '9', 'a', '9', '9', '8', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0',
    'a', 'a', '9', 'a', 'a', '8', '8', '0', '0', '0', '0', '8', '8', '0', '0', '0',
    '9', '9', 'a', '9', '9', '8', '0', '0', '0', '0', '0', '0', '8', '0', '0', '0',
    '0', '9', 'a', '9', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
  ]
]

// =========================
// 小黑子篮球能力定义.
// =========================

interface IBasketballConfig {
  cooldown: number
  ballSpeed: number // pixels per second
  ballDamage: number
  ballSize: number
}

const DEFAULT_CONFIG: IBasketballConfig = {
  cooldown: 2.5,
  ballSpeed: 150,
  ballDamage: 15,
  ballSize: 6
}

class BasketballAbility extends AbilityBase {
  private readonly config: IBasketballConfig
  private timer: number = 0

  readonly name = 'basketball'

  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void {
    if (!this.enabled || !target) return

    this.timer -= deltaTime

    if (this.timer <= 0) {
      const dist = getDistance(owner, target)

      if (dist > 0) {
        const dir = getDirection(owner, target)
        const vx = dir.x * this.config.ballSpeed
        const vy = dir.y * this.config.ballSpeed

        const ball = new BasketballBullet(
          owner.x,
          owner.y,
          vx,
          vy,
          this.config.ballDamage,
          this.config.ballSize
        )

        this.pendingProjectiles.push(ball)
      }

      this.timer = this.config.cooldown
    }
  }

  clone (): IAbility {
    return new BasketballAbility({ ...this.config })
  }

  init () {
    // ...
  }

  onDeath () {
    // ...
  }

  constructor (config: Partial<IBasketballConfig> = {}) {
    super()
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    }
    this.timer = Math.random() * this.config.cooldown * 0.5 // 随机初始冷却
  }
}

// ========================
// 小黑子武器定义.
// ========================

class BasketballBullet implements IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  size: number
  rotationSpeed: number

  // 篮球像素图案 (5x5) - 更圆的形状
  // 9 = 橙色 #cc6633, a = 深色纹路 #994422
  private static readonly PATTERN = [
    ['0', '9', 'a', '9', '0'],
    ['9', '9', 'a', '9', '9'],
    ['a', 'a', '9', 'a', 'a'],
    ['9', '9', 'a', '9', '9'],
    ['0', '9', 'a', '9', '0']
  ]

  private static readonly COLORS: Record<string, string> = {
    0: 'transparent',
    9: '#cc6633',
    a: '#994422'
  }

  update (deltaTime: number): void {
    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
  }

  draw (ctx: CanvasRenderingContext2D): void {
    const pattern = BasketballBullet.PATTERN
    const colors = BasketballBullet.COLORS
    const pixelSize = 1

    // 从中心点偏移绘制 (5x5 所以偏移2.5)
    const offsetX = this.x - 2.5
    const offsetY = this.y - 2.5

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const colorKey = pattern[row][col]
        if (colorKey === '0') continue

        ctx.fillStyle = colors[colorKey]
        ctx.fillRect(
          Math.floor(offsetX + col * pixelSize),
          Math.floor(offsetY + row * pixelSize),
          pixelSize,
          pixelSize
        )
      }
    }
  }

  isOutOfBounds (width: number, height: number): boolean {
    return (
      this.x < -this.size ||
      this.x > width + this.size ||
      this.y < -this.size ||
      this.y > height + this.size
    )
  }

  constructor (
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number = 15,
    size: number = 5
  ) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.damage = damage
    this.size = size
    this.rotationSpeed = 0
  }
}

// =========================
// 小黑子敌人定义.
// =========================

class IkunEnemy extends Enemy {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  // 用于抖动效果
  private shakeTime: number = 0
  private shakeIntensity: number = 2

  constructor () {
    super()
    this.hp = HP
    this.speed = 45
    this.paddingX = 3
    this.paddingY = 2
    this.TEXTURE_CHANGING_COUNTDOWN = 15
    this.attack = 18
    this.scoreValue = 25

    this.shakeTime = Math.random() * Math.PI * 2

    // 添加投掷篮球能力！
    this.addAbility(new BasketballAbility({
      cooldown: 2.0,
      ballSpeed: 90,
      ballDamage: 12,
      ballSize: 3
    }))
  }

  /**
   * 愤怒抖动效果
   */
  move (target: Sprite | null, deltaTime: number): void {
    super.move(target, deltaTime)

    this.shakeTime += deltaTime * 20
    const shakeX = Math.sin(this.shakeTime) * this.shakeIntensity * deltaTime
    const shakeY = Math.cos(this.shakeTime * 1.3) * this.shakeIntensity * deltaTime
    this.x += shakeX
    this.y += shakeY
  }
}

export {
  IkunEnemy
}
