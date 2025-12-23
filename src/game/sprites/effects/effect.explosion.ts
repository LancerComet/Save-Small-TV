import { rand } from '../../utils'

// 爆炸颜色数组 - 火焰色调
const EXPLOSION_COLORS = [
  '#ff6600',  // 橙色
  '#ffcc00',  // 黄色
  '#ff0000',  // 红色
  '#ff9900',
  '#ffff00',
  '#ff3300',
  '#ff4400',
  '#ffaa00'
]

/**
 * 轻量级爆炸粒子 - 不继承 Sprite，直接绘制
 */
class ExplosionParticle {
  // 位置
  x: number
  y: number

  // 大小 (3-6像素)
  size: number

  // 颜色
  color: string

  // 速度向量 (pixels per second)
  velocityX: number
  velocityY: number

  // 重力
  gravity: number = 200

  // 生命周期 (秒)
  lifetime: number
  age: number = 0

  // 是否已消亡
  isDead: boolean = false

  // 摩擦力系数
  friction: number = 3

  constructor (x: number, y: number, velocityX: number, velocityY: number) {
    this.x = x
    this.y = y
    this.velocityX = velocityX
    this.velocityY = velocityY

    // 随机大小 3-6 像素
    this.size = 3 + Math.floor(rand() * 4)

    // 随机颜色
    this.color = EXPLOSION_COLORS[Math.floor(rand() * EXPLOSION_COLORS.length)]

    // 随机生命周期 0.5-1秒
    this.lifetime = 0.5 + rand() * 0.5
  }

  /**
   * 更新粒子状态
   */
  update (deltaTime: number) {
    if (this.isDead) return

    // 更新年龄
    this.age += deltaTime

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

  /**
   * 直接绘制到 context
   */
  draw (ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    // 根据年龄计算透明度（渐隐效果）
    const alpha = 1 - (this.age / this.lifetime)
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.fillRect(screenX, screenY, this.size, this.size)
    ctx.globalAlpha = 1  // 恢复
  }
}

/**
 * 爆炸效果工厂类
 */
class ExplosionEffect {
  static create (x: number, y: number, count: number = 16, intensity: number = 5): ExplosionParticle[] {
    const particles: ExplosionParticle[] = []

    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2
      const speed = (50 + rand() * 150) * intensity

      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed

      particles.push(new ExplosionParticle(x, y, velocityX, velocityY))
    }

    return particles
  }
}

export { ExplosionParticle, ExplosionEffect }
