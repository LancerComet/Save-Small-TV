import { IProjectile } from '../types.ts'

/**
 * 普通敌人子弹.
 */
class EnemyBullet implements IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  size: number
  color: string

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
}

export {
  EnemyBullet
}
