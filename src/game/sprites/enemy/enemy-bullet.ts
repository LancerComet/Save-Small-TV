/**
 * Enemy Bullet - 敌人子弹
 */

import { IProjectile } from '../../abilities/base'

/**
 * 普通敌人子弹
 */
class EnemyBullet implements IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  size: number
  color: string

  constructor (
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number = 10,
    size: number = 4,
    color: string = '#ff0000'
  ) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.damage = damage
    this.size = size
    this.color = color
  }

  update (deltaTime: number): void {
    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
  }

  draw (ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }

  isOutOfBounds (width: number, height: number): boolean {
    return (
      this.x < -this.size ||
      this.x > width + this.size ||
      this.y < -this.size ||
      this.y > height + this.size
    )
  }
}

/**
 * 追踪子弹
 */
class HomingBullet implements IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  speed: number
  turnSpeed: number
  size: number
  color: string
  lifetime: number
  private target: { x: number; y: number } | null = null

  constructor (
    x: number,
    y: number,
    speed: number = 2,
    damage: number = 15,
    turnSpeed: number = 0.05,
    lifetime: number = 5
  ) {
    this.x = x
    this.y = y
    this.speed = speed
    this.damage = damage
    this.turnSpeed = turnSpeed
    this.size = 5
    this.color = '#ff00ff'
    this.lifetime = lifetime
    this.vx = 0
    this.vy = 0
  }

  setTarget (target: { x: number; y: number } | null): void {
    this.target = target
  }

  update (deltaTime: number): void {
    this.lifetime -= deltaTime

    if (this.target) {
      // 计算朝向目标的方向
      const dx = this.target.x - this.x
      const dy = this.target.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 0) {
        const targetVx = (dx / dist) * this.speed
        const targetVy = (dy / dist) * this.speed

        // 平滑转向
        this.vx += (targetVx - this.vx) * this.turnSpeed
        this.vy += (targetVy - this.vy) * this.turnSpeed
      }
    }

    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
  }

  draw (ctx: CanvasRenderingContext2D): void {
    // 绘制追踪弹（菱形）
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.moveTo(this.x, this.y - this.size)
    ctx.lineTo(this.x + this.size, this.y)
    ctx.lineTo(this.x, this.y + this.size)
    ctx.lineTo(this.x - this.size, this.y)
    ctx.closePath()
    ctx.fill()

    // 尾焰
    ctx.fillStyle = '#ff66ff'
    const tailX = this.x - this.vx * 3
    const tailY = this.y - this.vy * 3
    ctx.beginPath()
    ctx.arc(tailX, tailY, this.size * 0.5, 0, Math.PI * 2)
    ctx.fill()
  }

  isOutOfBounds (width: number, height: number): boolean {
    return (
      this.lifetime <= 0 ||
      this.x < -this.size * 2 ||
      this.x > width + this.size * 2 ||
      this.y < -this.size * 2 ||
      this.y > height + this.size * 2
    )
  }
}

/**
 * 爆炸碎片
 */
class ExplosionFragment implements IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  size: number
  color: string
  lifetime: number

  constructor (
    x: number,
    y: number,
    angle: number,
    speed: number,
    damage: number = 20
  ) {
    this.x = x
    this.y = y
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.damage = damage
    this.size = 3
    this.color = '#ffaa00'
    this.lifetime = 1.5
  }

  update (deltaTime: number): void {
    this.lifetime -= deltaTime
    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
    // 减速
    this.vx *= 0.98
    this.vy *= 0.98
  }

  draw (ctx: CanvasRenderingContext2D): void {
    const alpha = Math.min(1, this.lifetime)
    ctx.fillStyle = this.color
    ctx.globalAlpha = alpha
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    )
    ctx.globalAlpha = 1
  }

  isOutOfBounds (width: number, height: number): boolean {
    return (
      this.lifetime <= 0 ||
      this.x < -10 ||
      this.x > width + 10 ||
      this.y < -10 ||
      this.y > height + 10
    )
  }
}

export { EnemyBullet, HomingBullet, ExplosionFragment }
