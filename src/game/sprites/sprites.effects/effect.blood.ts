import { Sprite } from '../../../core/sprite'
import { bitmapsToTextures } from '../../../core/utils'
import { rand, floor } from '../../utils'

const WIDTH = 4
const HEIGHT = 4

// 血液颜色 - 多种红色调
const BLOOD_COLORS: TColorMap[] = [
  {
    '0': 'transparent',
    '1': '#8b0000',  // 深红
    '2': '#cc0000'   // 亮红
  },
  {
    '0': 'transparent',
    '1': '#a00000',
    '2': '#ff0000'
  },
  {
    '0': 'transparent',
    '1': '#660000',
    '2': '#990000'
  }
]

// 不同形状的血液粒子
const BLOOD_BITMAPS: TBitmaps = [
  // 小点
  [
    '0', '0', '0', '0',
    '0', '1', '2', '0',
    '0', '2', '1', '0',
    '0', '0', '0', '0',
  ],
  // 斜向
  [
    '0', '0', '0', '1',
    '0', '0', '2', '0',
    '0', '1', '0', '0',
    '2', '0', '0', '0',
  ],
  // 十字
  [
    '0', '1', '0', '0',
    '1', '2', '1', '0',
    '0', '1', '0', '0',
    '0', '0', '0', '0',
  ],
  // 单点
  [
    '0', '0', '0', '0',
    '0', '0', '0', '0',
    '0', '0', '2', '0',
    '0', '0', '0', '0',
  ],
  // 双点
  [
    '0', '0', '0', '0',
    '0', '1', '0', '2',
    '0', '0', '0', '0',
    '0', '0', '0', '0',
  ]
]

/**
 * 单个血液粒子
 */
class BloodParticle extends Sprite {
  width = WIDTH
  height = HEIGHT

  // 速度向量 (pixels per second at 60fps baseline)
  velocityX: number = 0
  velocityY: number = 0

  // 重力 (pixels per second squared)
  gravity: number = 600

  // 生命周期 (秒)
  lifetime: number = 1  // 约1秒
  age: number = 0

  // 是否已消亡
  isDead: boolean = false

  // 摩擦力系数 (per second)
  friction: number = 5

  constructor (x: number, y: number, velocityX: number, velocityY: number) {
    super()

    // 随机选择颜色和形状
    const colorIndex = floor(rand() * BLOOD_COLORS.length)
    const bitmapIndex = floor(rand() * BLOOD_BITMAPS.length)

    this.textures = bitmapsToTextures(
      WIDTH,
      HEIGHT,
      [BLOOD_BITMAPS[bitmapIndex]],
      BLOOD_COLORS[colorIndex]
    )

    this.x = x
    this.y = y
    // 将速度转换为 pixels per second
    this.velocityX = velocityX * 60
    this.velocityY = velocityY * 60

    // 随机生命周期 (0.5-1.5秒)
    this.lifetime = 0.5 + rand() * 1.0

    this.TEXTURE_CHANGING_COUNTDOWN = false
  }

  /**
   * 更新粒子状态
   * @param deltaTime - 帧间隔时间（秒）
   */
  update (deltaTime: number) {
    if (this.isDead) return

    // 应用速度 (乘以 deltaTime)
    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime

    // 应用重力
    this.velocityY += this.gravity * deltaTime

    // 应用摩擦力 (指数衰减)
    const frictionFactor = Math.exp(-this.friction * deltaTime)
    this.velocityX *= frictionFactor
    this.velocityY *= frictionFactor

    // 增加年龄
    this.age += deltaTime

    // 检查是否死亡
    if (this.age >= this.lifetime) {
      this.isDead = true
    }
  }
}

/**
 * 血液效果管理器
 * 用于在指定位置生成一组血液粒子
 */
class BloodEffect {
  /**
   * 在指定位置生成血液粒子
   *
   * @param x - 中心X坐标
   * @param y - 中心Y坐标
   * @param count - 粒子数量
   * @param spread - 扩散强度
   * @returns 生成的粒子数组
   */
  static create (x: number, y: number, count: number = 8, spread: number = 3): BloodParticle[] {
    const particles: BloodParticle[] = []

    for (let i = 0; i < count; i++) {
      // 随机速度向量（向四周扩散）
      const angle = rand() * Math.PI * 2
      const speed = rand() * spread + 1

      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed - 1  // 稍微向上偏移

      // 随机起始位置偏移
      const offsetX = (rand() - 0.5) * 8
      const offsetY = (rand() - 0.5) * 8

      const particle = new BloodParticle(
        x + offsetX,
        y + offsetY,
        velocityX,
        velocityY
      )

      particles.push(particle)
    }

    return particles
  }
}

export {
  BloodParticle,
  BloodEffect
}
