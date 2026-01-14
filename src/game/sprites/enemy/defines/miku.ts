import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { AbilityBase, AbilityOwner, AbilityTarget, IAbility } from '../../../abilities/base.ts'
import { IProjectile } from '../../../projectile/types.ts'
import { getDirection, getDistance } from '../../../utils/collision.ts'
import { EnemyBase } from '../enemy-base.ts'

const WIDTH = 12
const HEIGHT = 12
const HP = 35

// 初音未来配色
const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#00b4b4', // 青绿色头发
  2: '#009999', // 深青绿头发阴影
  3: '#ffd4c4', // 肤色
  4: '#ff4488', // 粉色发饰
  5: '#0088ff', // 蓝色眼睛
  6: '#ffffff', // 白色高光
  7: '#666666', // 灰色衣服
  8: '#444444', // 深灰描边
  9: '#88ff88', // 浅绿葱
  a: '#44aa44' // 深绿葱
}

// 初音未来 12x12 紧凑版
const BITMAPS: SpriteBitmaps = [
  [
    // 第一帧 - 正常
    '0', '0', '1', '1', '4', '1', '4', '1', '1', '0', '0', '0',
    '0', '1', '1', '6', '2', '1', '2', '6', '1', '1', '0', '0',
    '0', '1', '3', '3', '3', '3', '3', '3', '3', '1', '0', '0',
    '0', '1', '3', '5', '6', '3', '5', '6', '3', '1', '0', '0',
    '0', '1', '3', '5', '5', '3', '5', '5', '3', '1', '0', '0',
    '0', '1', '3', '3', '3', '4', '3', '3', '3', '1', '0', '0',
    '0', '1', '8', '7', '7', '7', '7', '7', '8', '1', '0', '9',
    '1', '2', '8', '7', '7', '7', '7', '7', '8', '2', '1', 'a',
    '1', '2', '1', '8', '7', '7', '7', '8', '1', '2', '1', '9',
    '1', '2', '1', '0', '8', '0', '8', '0', '1', '2', '0', '0',
    '0', '1', '2', '0', '0', '0', '0', '0', '2', '1', '0', '0',
    '0', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '0'
  ],
  [
    // 第二帧 - 眨眼
    '0', '0', '1', '1', '4', '1', '4', '1', '1', '0', '0', '0',
    '0', '1', '1', '6', '2', '1', '2', '6', '1', '1', '0', '0',
    '0', '1', '3', '3', '3', '3', '3', '3', '3', '1', '0', '0',
    '0', '1', '3', '8', '8', '3', '8', '8', '3', '1', '0', '0',
    '0', '1', '3', '3', '3', '3', '3', '3', '3', '1', '0', '0',
    '0', '1', '3', '3', '3', '4', '3', '3', '3', '1', '0', '0',
    '0', '1', '8', '7', '7', '7', '7', '7', '8', '1', '0', '9',
    '1', '2', '8', '7', '7', '7', '7', '7', '8', '2', '1', 'a',
    '1', '2', '1', '8', '7', '7', '7', '8', '1', '2', '1', '9',
    '1', '2', '1', '0', '8', '0', '8', '0', '1', '2', '0', '0',
    '0', '1', '2', '0', '0', '0', '0', '0', '2', '1', '0', '0',
    '0', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '0'
  ]
]

// =========================
// 大葱回旋镖能力定义.
// =========================

interface IBoomerangConfig {
  cooldown: number
  speed: number
  damage: number
}

const DEFAULT_CONFIG: IBoomerangConfig = {
  cooldown: 3,
  speed: 150,
  damage: 12
}

class BoomerangAbility extends AbilityBase {
  private readonly config: IBoomerangConfig
  private timer: number = 0
  readonly name = 'boomerang'

  init () {
  }

  onDeath () {
    // ...
  }

  update (owner: AbilityOwner, target: AbilityTarget, deltaTime: number): void {
    if (!this.enabled || !target) {
      return
    }

    this.timer -= deltaTime

    if (this.timer <= 0) {
      const dist = getDistance(owner, target)

      if (dist > 0) {
        const dir = getDirection(owner, target)
        const vx = dir.x * this.config.speed
        const vy = dir.y * this.config.speed

        const boomerang = new LeekBoomerang(
          owner.x,
          owner.y,
          vx,
          vy,
          this.config.damage,
          owner
        )

        this.pendingProjectiles.push(boomerang)
      }

      this.timer = this.config.cooldown
    }
  }

  clone (): IAbility {
    return new BoomerangAbility({
      ...this.config
    })
  }

  constructor (config: Partial<IBoomerangConfig> = {}) {
    super()
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    }
    this.timer = Math.random() * this.config.cooldown * 0.5
  }
}

// =========================
// 死亡生成乱飞大葱能力定义.
// =========================

class LeekDeathAbility extends AbilityBase {
  readonly name = 'leek-death'

  private hasSpawned: boolean = false

  update () {
    // 此能力不在 update 中执行，而是在 onDeath 中
  }

  onDeath (owner: AbilityOwner) {
    if (!this.enabled || this.hasSpawned) {
      return
    }

    this.hasSpawned = true

    // 随机方向
    const angle = Math.random() * Math.PI * 2
    const speed = 100
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed

    // 生成一个乱飞的葱
    const leek = new LeekBoomerang(owner.x, owner.y, vx, vy, 12)
    leek.ownerDied = true // 设置为自由飞行状态

    this.pendingProjectiles.push(leek)
  }

  clone (): IAbility {
    const cloned = new LeekDeathAbility()
    cloned.hasSpawned = false
    return cloned
  }

  init () {
  }
}

// =========================
// 回旋镖武器定义.
// 飞出去后会返回，如果 owner 死亡则在太空乱跑.
// =========================

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
  private readonly startX: number
  private readonly startY: number
  private maxDistance: number = 150 // 增加最大距离
  private returning: boolean = false
  private readonly ownerRef: { x: number; y: number; hp?: number } | null = null

  ownerDied: boolean = false // owner 死亡后变成自由飞行

  private static readonly COLORS: Record<string, string> = {
    0: 'transparent',
    g: '#88ff88',
    G: '#44aa44',
    w: '#ffffff'
  }

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

  isOutOfBounds (): boolean {
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
}

// =========================
// 初音未来敌人定义.
// =========================

class MikuEnemy extends EnemyBase {
  readonly width = WIDTH
  readonly height = HEIGHT
  readonly textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  constructor () {
    super('miku')
    this.hp = HP
    this.speed = 40
    this.paddingX = 2
    this.paddingY = 2
    this.TEXTURE_CHANGING_COUNTDOWN = 30 // 眨眼频率
    this.attack = 15
    this.scoreValue = 30
    this.xpValue = 25  // 有回旋镖能力，较高经验

    // 添加葱回旋镖能力.
    this.addAbility(new BoomerangAbility({
      cooldown: 3.0,
      speed: 150,
      damage: 12
    }))

    // 死亡时生成一个乱飞的葱.
    this.addAbility(new LeekDeathAbility())
  }
}

export {
  MikuEnemy
}
