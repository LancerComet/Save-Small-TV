import { Offscreen } from '../../../../core/sprite/offscreen'
import { SpriteDirection } from '../../../../core/sprite/types.ts'
import { EnemyBase } from '../../enemy/enemy-base.ts'
import { IWeapon, WeaponType } from '../types.ts'
import { WeaponBase } from '../weapon-base.ts'

const SPEED = 200 // 激光速度更快
const DAMAGE = 8 // 单发伤害较低，但可穿透
const LASER_LENGTH = 16 // 激光长度
const LASER_WIDTH = 4 // 激光宽度

/**
 * 激光武器 - 可穿透多个敌人，支持任意角度
 */
class Laser extends WeaponBase {
  attack = DAMAGE
  pierceCount: number = 5 // 最多穿透5个敌人
  hitEnemies: Set<EnemyBase> = new Set() // 已击中的敌人

  // 起始位置，用于计算射程
  startX: number = 0
  startY: number = 0
  maxRange: number = 400

  // 激光颜色
  private coreColor: string = '#00ffff'
  private glowColor: string = '#00cccc'

  // 闪烁计数器
  private blinkCounter: number = 0

  /**
   * 根据四方向设置角度
   */
  private setDirectionAngle (direction: SpriteDirection) {
    switch (direction) {
      case 'R':
        this.angle = 0
        break
      case 'L':
        this.angle = Math.PI
        break
      case 'B':
        this.angle = Math.PI / 2
        break
      case 'T':
        this.angle = -Math.PI / 2
        break
    }
    this.velocityX = Math.cos(this.angle)
    this.velocityY = Math.sin(this.angle)
    this.useAngleMovement = true
  }

  /**
   * 重写 setAngle 以支持无极方向
   */
  setAngle (angle: number) {
    super.setAngle(angle)
  }

  /**
   * 重写 updateTexture - 激光使用程序化绘制
   */
  updateTexture () {
    this.blinkCounter++

    // 初始化 offscreen canvas
    if (!this.offscreen) {
      this.offscreen = new Offscreen(LASER_LENGTH, LASER_LENGTH)
    }

    const ctx = this.offscreen.context
    const canvas = this.offscreen.canvasElement

    // 清空
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 保存状态
    ctx.save()

    // 移动到中心并旋转
    const centerX = LASER_LENGTH / 2
    const centerY = LASER_LENGTH / 2
    ctx.translate(centerX, centerY)
    ctx.rotate(this.angle)

    // 闪烁效果
    const blink = this.blinkCounter % 6 < 3
    const coreColor = blink ? '#ffffff' : this.coreColor
    const glowColor = blink ? this.coreColor : this.glowColor

    // 绘制外发光
    ctx.fillStyle = glowColor
    ctx.fillRect(-LASER_LENGTH / 2, -LASER_WIDTH / 2 - 1, LASER_LENGTH, LASER_WIDTH + 2)

    // 绘制核心
    ctx.fillStyle = coreColor
    ctx.fillRect(-LASER_LENGTH / 2, -LASER_WIDTH / 2 + 1, LASER_LENGTH, LASER_WIDTH - 2)

    // 恢复状态
    ctx.restore()
  }

  /**
   * 检查是否可以击中敌人（穿透判定）
   */
  canHitEnemy (enemy: EnemyBase): boolean {
    if (this.hitEnemies.has(enemy)) {
      return false // 已经击中过
    }
    if (this.hitEnemies.size >= this.pierceCount) {
      return false // 达到穿透上限
    }
    return true
  }

  /**
   * 记录击中敌人
   */
  recordHit (enemy: EnemyBase): void {
    this.hitEnemies.add(enemy)
  }

  /**
   * 检查是否超出射程
   */
  isOutOfRange (): boolean {
    const dx = this.x - this.startX
    const dy = this.y - this.startY
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist > this.maxRange || this.hitEnemies.size >= this.pierceCount
  }

  constructor (param: IWeapon) {
    super(WeaponType.LASER)
    this.x = param.x
    this.y = param.y
    this.startX = param.x
    this.startY = param.y
    this.speed = SPEED
    this.direction = param.direction

    // 设置碰撞盒尺寸
    this.width = LASER_LENGTH
    this.height = LASER_WIDTH
    this.paddingX = 0
    this.paddingY = 0

    // 根据四方向设置默认角度
    this.setDirectionAngle(param.direction)
  }
}

export {
  Laser
}
