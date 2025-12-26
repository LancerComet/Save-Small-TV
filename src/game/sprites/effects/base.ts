/**
 * Particle Base - 粒子基类
 * 
 * 所有粒子效果的基类，统一粒子的基本逻辑
 */

import { rand } from '../../utils'

/**
 * 粒子配置接口
 */
interface IParticleConfig {
  /** 颜色数组 */
  colors: string[]
  /** 最小尺寸 */
  minSize: number
  /** 最大尺寸 */
  maxSize: number
  /** 最小生命周期（秒） */
  minLifetime: number
  /** 最大生命周期（秒） */
  maxLifetime: number
  /** 重力加速度 */
  gravity: number
  /** 摩擦力系数 */
  friction: number
}

/**
 * 粒子基类
 */
abstract class ParticleBase {
  // 位置
  x: number
  y: number

  // 速度（像素/秒）
  velocityX: number
  velocityY: number

  // 大小
  size: number

  // 颜色
  color: string

  // 重力
  gravity: number

  // 摩擦力
  friction: number

  // 生命周期
  lifetime: number
  age: number = 0

  // 是否已消亡
  isDead: boolean = false

  constructor (
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    config: IParticleConfig
  ) {
    this.x = x
    this.y = y
    this.velocityX = velocityX * 60 // 转换为 pixels per second
    this.velocityY = velocityY * 60
    this.gravity = config.gravity
    this.friction = config.friction

    // 随机大小
    this.size = config.minSize + Math.floor(rand() * (config.maxSize - config.minSize + 1))

    // 随机颜色
    this.color = config.colors[Math.floor(rand() * config.colors.length)]

    // 随机生命周期
    this.lifetime = config.minLifetime + rand() * (config.maxLifetime - config.minLifetime)
  }

  /**
   * 更新粒子状态
   */
  update (deltaTime: number): void {
    if (this.isDead) return

    // 更新年龄
    this.age += deltaTime

    if (this.age >= this.lifetime) {
      this.isDead = true
      return
    }

    // 应用速度
    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime

    // 应用重力
    this.velocityY += this.gravity * deltaTime

    // 应用摩擦力
    const frictionFactor = Math.exp(-this.friction * deltaTime)
    this.velocityX *= frictionFactor
    this.velocityY *= frictionFactor
  }

  /**
   * 绘制粒子（可重写）
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
 * 粒子生成器工厂
 */
abstract class ParticleFactory {
  protected abstract config: IParticleConfig
  protected abstract createParticle (
    x: number,
    y: number,
    vx: number,
    vy: number
  ): ParticleBase

  /**
   * 生成粒子组
   */
  create (x: number, y: number, count: number, spread: number): ParticleBase[] {
    const particles: ParticleBase[] = []

    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2
      const speed = rand() * spread
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      particles.push(this.createParticle(x, y, vx, vy))
    }

    return particles
  }
}

export type { IParticleConfig }
export { ParticleBase, ParticleFactory }
