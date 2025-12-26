import { rand } from '../../utils'
import { ParticleBase, IParticleConfig } from './base'

// 血液颜色数组
const BLOOD_COLORS = [
  '#8b0000',  // 深红
  '#cc0000',  // 亮红
  '#a00000',
  '#ff0000',
  '#660000',
  '#990000'
]

// 血液粒子配置
const BLOOD_CONFIG: IParticleConfig = {
  colors: BLOOD_COLORS,
  minSize: 2,
  maxSize: 4,
  minLifetime: 0.5,
  maxLifetime: 1.5,
  gravity: 600,
  friction: 5
}

/**
 * 血液粒子 - 继承自粒子基类
 */
class BloodParticle extends ParticleBase {
  constructor (x: number, y: number, velocityX: number, velocityY: number) {
    super(x, y, velocityX, velocityY, BLOOD_CONFIG)
  }

  /**
   * 血液粒子不需要透明度渐变
   */
  draw (ctx: CanvasRenderingContext2D, screenX: number, screenY: number): void {
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
