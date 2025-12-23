import { Sprite } from '../../../core/sprite'
import { bitmapsToTextures } from '../../../core/utils'
import { rand, floor } from '../../utils'

const WIDTH = 6
const HEIGHT = 6

// 爆炸颜色 - 火焰色调
const EXPLOSION_COLORS: TColorMap[] = [
  {
    '0': 'transparent',
    '1': '#ff6600',  // 橙色
    '2': '#ffcc00',  // 黄色
    '3': '#ff0000'   // 红色
  },
  {
    '0': 'transparent',
    '1': '#ff9900',
    '2': '#ffff00',
    '3': '#ff3300'
  },
  {
    '0': 'transparent',
    '1': '#ff4400',
    '2': '#ffaa00',
    '3': '#cc0000'
  }
]

// 不同形状的爆炸粒子
const EXPLOSION_BITMAPS: TBitmaps = [
  // 火花
  [
    '0', '0', '2', '0', '0', '0',
    '0', '1', '2', '1', '0', '0',
    '2', '2', '3', '2', '2', '0',
    '0', '1', '2', '1', '0', '0',
    '0', '0', '2', '0', '0', '0',
    '0', '0', '0', '0', '0', '0',
  ],
  // 小方块
  [
    '0', '0', '0', '0', '0', '0',
    '0', '1', '2', '0', '0', '0',
    '0', '2', '3', '0', '0', '0',
    '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0',
  ],
  // 星形
  [
    '0', '0', '1', '0', '0', '0',
    '0', '0', '2', '0', '0', '0',
    '1', '2', '3', '2', '1', '0',
    '0', '0', '2', '0', '0', '0',
    '0', '0', '1', '0', '0', '0',
    '0', '0', '0', '0', '0', '0',
  ],
  // 碎片
  [
    '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '1', '0', '0',
    '0', '2', '3', '0', '0', '0',
    '0', '0', '1', '0', '0', '0',
    '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0',
  ]
]

/**
 * 单个爆炸粒子
 */
class ExplosionParticle extends Sprite {
  width = WIDTH
  height = HEIGHT

  // 速度向量 (pixels per second)
  velocityX: number = 0
  velocityY: number = 0

  // 重力（爆炸粒子重力较小，主要向外扩散）
  gravity: number = 200

  // 生命周期 (秒)
  lifetime: number = 0.8
  age: number = 0

  // 是否已消亡
  isDead: boolean = false

  // 摩擦力系数
  friction: number = 3

  constructor (x: number, y: number, velocityX: number, velocityY: number) {
    super()

    // 随机选择颜色和形状
    const colorIndex = floor(rand() * EXPLOSION_COLORS.length)
    const bitmapIndex = floor(rand() * EXPLOSION_BITMAPS.length)

    this.textures = bitmapsToTextures(
      WIDTH,
      HEIGHT,
      [EXPLOSION_BITMAPS[bitmapIndex]],
      EXPLOSION_COLORS[colorIndex]
    )

    this.x = x
    this.y = y
    this.velocityX = velocityX
    this.velocityY = velocityY

    // 随机生命周期 0.5-1秒
    this.lifetime = 0.5 + rand() * 0.5
  }

  /**
   * 更新粒子物理状态
   * @param deltaTime 帧间隔时间（秒）
   */
  update (deltaTime: number) {
    if (this.isDead) { return }

    // 更新年龄
    this.age += deltaTime

    // 检查生命周期
    if (this.age >= this.lifetime) {
      this.isDead = true
      return
    }

    // 应用重力
    this.velocityY += this.gravity * deltaTime

    // 应用摩擦力
    const frictionFactor = 1 - this.friction * deltaTime
    this.velocityX *= Math.max(0, frictionFactor)
    this.velocityY *= Math.max(0, frictionFactor)

    // 更新位置
    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime
  }
}

/**
 * 爆炸效果工厂类
 */
class ExplosionEffect {
  /**
   * 创建爆炸粒子组
   *
   * @param x 爆炸中心X坐标
   * @param y 爆炸中心Y坐标
   * @param count 粒子数量
   * @param intensity 强度（速度倍数）
   */
  static create (x: number, y: number, count: number = 16, intensity: number = 5): ExplosionParticle[] {
    const particles: ExplosionParticle[] = []

    for (let i = 0; i < count; i++) {
      // 360度随机方向爆炸
      const angle = rand() * Math.PI * 2
      const speed = (50 + rand() * 150) * intensity  // 随机速度

      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed

      particles.push(new ExplosionParticle(x, y, velocityX, velocityY))
    }

    return particles
  }
}

export { ExplosionParticle, ExplosionEffect }
