import { rand } from '../../utils'

// 血液颜色数组 - 直接使用颜色字符串
const BLOOD_COLORS = [
  '#8b0000',  // 深红
  '#cc0000',  // 亮红
  '#a00000',
  '#ff0000',
  '#660000',
  '#990000'
]

/**
 * 轻量级血液粒子 - 不继承 Sprite，直接绘制
 */
class BloodParticle {
  // 位置
  x: number
  y: number

  // 大小 (2-4像素的小方块)
  size: number

  // 颜色
  color: string

  // 速度向量 (pixels per second)
  velocityX: number
  velocityY: number

  // 重力 (pixels per second squared)
  gravity: number = 600

  // 生命周期 (秒)
  lifetime: number
  age: number = 0

  // 是否已消亡
  isDead: boolean = false

  // 摩擦力系数
  friction: number = 5

  constructor (x: number, y: number, velocityX: number, velocityY: number) {
    this.x = x
    this.y = y
    this.velocityX = velocityX * 60  // 转换为 pixels per second
    this.velocityY = velocityY * 60

    // 随机大小 2-4 像素
    this.size = 2 + Math.floor(rand() * 3)

    // 随机颜色
    this.color = BLOOD_COLORS[Math.floor(rand() * BLOOD_COLORS.length)]

    // 随机生命周期 0.5-1.5秒
    this.lifetime = 0.5 + rand() * 1.0
  }

  /**
   * 更新粒子状态
   */
  update (deltaTime: number) {
    if (this.isDead) return

    // 应用速度
    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime

    // 应用重力
    this.velocityY += this.gravity * deltaTime

    // 应用摩擦力
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

  /**
   * 直接绘制到 context
   */
  draw (ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    ctx.fillStyle = this.color
    ctx.fillRect(screenX, screenY, this.size, this.size)
  }
}

/**
 * 血液效果工厂类
 */
class BloodEffect {
  static create (x: number, y: number, count: number = 8, spread: number = 3): BloodParticle[] {
    const particles: BloodParticle[] = []

    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2
      const speed = rand() * spread + 1

      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed - 1

      const offsetX = (rand() - 0.5) * 8
      const offsetY = (rand() - 0.5) * 8

      particles.push(new BloodParticle(
        x + offsetX,
        y + offsetY,
        velocityX,
        velocityY
      ))
    }

    return particles
  }
}

export { BloodParticle, BloodEffect }
