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

        // 平滑转向（考虑 deltaTime）
        const lerpFactor = 1 - Math.exp(-this.turnSpeed * deltaTime)
        this.vx += (targetVx - this.vx) * lerpFactor
        this.vy += (targetVy - this.vy) * lerpFactor
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

    // 尾焰（使用速度的单位向量）
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    if (speed > 0) {
      const dirX = this.vx / speed
      const dirY = this.vy / speed
      ctx.fillStyle = '#ff66ff'
      const tailX = this.x - dirX * this.size * 2
      const tailY = this.y - dirY * this.size * 2
      ctx.beginPath()
      ctx.arc(tailX, tailY, this.size * 0.5, 0, Math.PI * 2)
      ctx.fill()
    }
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

/**
 * 篮球子弹 - 小黑子的攻击方式
 * 像素风格，圆形篮球
 */
class BasketballBullet implements IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  size: number
  rotation: number = 0
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
    '0': 'transparent',
    '9': '#cc6633',
    'a': '#994422'
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
}

export { EnemyBullet, HomingBullet, ExplosionFragment, BasketballBullet, LeekBoomerang }

/**
 * 葱回旋镖 - 初音未来的攻击方式
 * 飞出去后会返回，如果owner死亡则在太空乱跑
 */
class LeekBoomerang implements IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  size: number
  rotation: number = 0
  rotationSpeed: number = 15

  // 回旋镖状态
  private startX: number
  private startY: number
  private maxDistance: number = 150 // 增加最大距离
  private returning: boolean = false
  private ownerRef: { x: number; y: number; hp?: number } | null = null
  private ownerDied: boolean = false // owner死亡后变成自由飞行

  // 葱的像素图案 (3x7) - 绿色葱
  // g = 浅绿 #88ff88, G = 深绿 #44aa44, w = 白色 #ffffff
  private static readonly PATTERN = [
    ['g', 'G', 'g'],
    ['g', 'G', 'g'],
    ['g', 'G', 'g'],
    ['w', 'w', 'w'],
    ['w', 'w', 'w'],
    ['w', 'w', 'w'],
    ['0', 'w', '0']
  ]

  private static readonly COLORS: Record<string, string> = {
    '0': 'transparent',
    'g': '#88ff88',
    'G': '#44aa44',
    'w': '#ffffff'
  }

  constructor (
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number = 12,
    owner?: { x: number; y: number; hp?: number }
  ) {
    this.x = x
    this.y = y
    this.startX = x
    this.startY = y
    this.vx = vx
    this.vy = vy
    this.damage = damage
    this.size = 4
    this.ownerRef = owner || null
  }

  /**
   * 检查owner是否死亡（通过hp判断）
   */
  private isOwnerDead (): boolean {
    if (!this.ownerRef) return false
    if (typeof this.ownerRef.hp === 'number') {
      return this.ownerRef.hp <= 0
    }
    return false
  }

  update (deltaTime: number): void {
    this.rotation += this.rotationSpeed * deltaTime

    // 检查owner是否死亡
    if (!this.ownerDied && this.isOwnerDead()) {
      this.ownerDied = true
      // 随机一个新方向继续飞
      const angle = Math.random() * Math.PI * 2
      const speed = 100
      this.vx = Math.cos(angle) * speed
      this.vy = Math.sin(angle) * speed
    }

    // 如果owner死了，自由飞行
    if (this.ownerDied) {
      this.x += this.vx * deltaTime
      this.y += this.vy * deltaTime
      return
    }

    if (!this.returning) {
      // 飞出去
      this.x += this.vx * deltaTime
      this.y += this.vy * deltaTime

      // 检查是否达到最大距离
      const dx = this.x - this.startX
      const dy = this.y - this.startY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist >= this.maxDistance) {
        this.returning = true
      }
    } else {
      // 返回发射者
      if (this.ownerRef) {
        const dx = this.ownerRef.x - this.x
        const dy = this.ownerRef.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 5) {
          const speed = 200
          this.vx = (dx / dist) * speed
          this.vy = (dy / dist) * speed
          this.x += this.vx * deltaTime
          this.y += this.vy * deltaTime
        }
      } else {
        // 没有owner引用，反向飞
        this.vx = -this.vx
        this.vy = -this.vy
        this.x += this.vx * deltaTime
        this.y += this.vy * deltaTime
      }
    }
  }

  draw (ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)

    const pattern = LeekBoomerang.PATTERN
    const colors = LeekBoomerang.COLORS

    // 从中心点偏移绘制
    const offsetX = -1.5
    const offsetY = -3.5

    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 3; col++) {
        const colorKey = pattern[row][col]
        if (colorKey === '0') continue

        ctx.fillStyle = colors[colorKey]
        ctx.fillRect(
          Math.floor(offsetX + col),
          Math.floor(offsetY + row),
          1,
          1
        )
      }
    }

    ctx.restore()
  }

  isOutOfBounds (width: number, height: number): boolean {
    // 注意：传入的 width/height 是世界边界的相对尺寸，不是绝对坐标
    // 但这里我们不用它们，因为出界检测在 EnemyProjectiles.update 中已经做了
    // 这里只检测回旋镖特有的逻辑

    // 如果owner死了，让外部的边界检测来处理删除
    if (this.ownerDied) {
      return false // 不在这里删除，让外部边界检测处理
    }

    // 如果正在返回且接近owner且owner还活着，删除
    if (this.returning && this.ownerRef && !this.isOwnerDead()) {
      const dx = this.ownerRef.x - this.x
      const dy = this.ownerRef.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 8) return true
    }

    return false // 让外部边界检测处理出界情况
  }
}
