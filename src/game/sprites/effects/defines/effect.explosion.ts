import { rand } from '../../../utils/math.ts'
import { ParticleBase, IParticleConfig } from '../base.ts'

// 爆炸颜色数组 - 火焰色调
const EXPLOSION_COLORS = [
  '#ff6600', // 橙色
  '#ffcc00', // 黄色
  '#ff0000', // 红色
  '#ff9900',
  '#ffff00',
  '#ff3300',
  '#ff4400',
  '#ffaa00'
]

// 爆炸粒子配置
const EXPLOSION_CONFIG: IParticleConfig = {
  colors: EXPLOSION_COLORS,
  minSize: 3,
  maxSize: 6,
  minLifetime: 0.5,
  maxLifetime: 1.0,
  gravity: 200,
  friction: 3
}

/**
 * 爆炸粒子 - 继承自粒子基类
 */
class ExplosionParticle extends ParticleBase {
  constructor (x: number, y: number, velocityX: number, velocityY: number) {
    // 爆炸粒子速度不需要 *60，传入的已经是 pixels/s
    super(x, y, 0, 0, EXPLOSION_CONFIG)
    // 直接设置速度，不经过基类的 *60 转换
    this.velocityX = velocityX
    this.velocityY = velocityY
  }

  /**
   * 爆炸粒子有透明度渐变
   */
  draw (ctx: CanvasRenderingContext2D, screenX: number, screenY: number): void {
    const alpha = Math.max(0, 1 - this.age / this.lifetime)
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.fillRect(screenX, screenY, this.size, this.size)
    ctx.globalAlpha = 1
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
