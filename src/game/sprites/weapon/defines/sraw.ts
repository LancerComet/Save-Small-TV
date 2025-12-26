import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { IWeapon } from '../types.ts'
import { WeaponBase } from './_base.ts'

const WIDTH = 6
const HEIGHT = 6
const SPEED = 200
const TURN_SPEED = 8 // 转向速度（弧度/秒）
const ATTACK = 25

// SRAW 发射配置
const SRAW_FIRE_INTERVAL = 1 // 每1秒发射一次
const SRAW_MISSILE_COUNT = 5 // 每次发射5枚导弹

// 导弹配色 - 军绿色
const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#445522', // 深军绿
  2: '#667744', // 军绿
  3: '#ff4444', // 红色弹头
  4: '#ffaa00', // 橙色火焰
  5: '#ffffff' // 白色高光
}

// 导弹 6x6 - 向右飞行状态
const BITMAPS: SpriteBitmaps = [
  [
    '0', '0', '3', '3', '0', '0',
    '0', '3', '5', '2', '1', '0',
    '4', '1', '2', '2', '1', '3',
    '4', '1', '2', '2', '1', '3',
    '0', '3', '5', '2', '1', '0',
    '0', '0', '3', '3', '0', '0'
  ]
]

/**
 * SRAW 导弹 - 自动追踪最近的敌人
 */
class SRAWMissile extends WeaponBase {
  width = WIDTH
  height = HEIGHT
  attack = ATTACK
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  // 追踪目标
  private target: { x: number; y: number; isDead?: boolean } | null = null
  private lifetime: number = 5 // 5秒后自毁

  // 当前飞行角度
  private currentAngle: number = 0

  constructor (param: IWeapon, target?: { x: number; y: number; isDead?: boolean }) {
    super()

    this.x = param.x
    this.y = param.y
    this.speed = SPEED
    this.paddingX = 0
    this.paddingY = 0
    this.target = target || null

    // 初始角度朝向目标
    if (this.target) {
      const dx = this.target.x - this.x
      const dy = this.target.y - this.y
      this.currentAngle = Math.atan2(dy, dx)
    } else {
      // 没有目标就随机方向
      this.currentAngle = Math.random() * Math.PI * 2
    }

    this.velocityX = Math.cos(this.currentAngle)
    this.velocityY = Math.sin(this.currentAngle)
    this.useAngleMovement = true

    this.TEXTURE_CHANGING_COUNTDOWN = false
  }

  /**
   * 更新导弹追踪
   */
  updateTracking (deltaTime: number) {
    this.lifetime -= deltaTime

    // 如果目标死了或没有目标，尝试找新目标
    if (!this.target || this.target.isDead) {
      this.target = null
      return
    }

    // 计算目标方向
    const dx = this.target.x - this.x
    const dy = this.target.y - this.y
    const targetAngle = Math.atan2(dy, dx)

    // 平滑转向
    let angleDiff = targetAngle - this.currentAngle

    // 规范化角度差到 [-PI, PI]
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2

    // 限制转向速度
    const maxTurn = TURN_SPEED * deltaTime
    if (angleDiff > maxTurn) {
      this.currentAngle += maxTurn
    } else if (angleDiff < -maxTurn) {
      this.currentAngle -= maxTurn
    } else {
      this.currentAngle = targetAngle
    }

    // 更新速度分量
    this.velocityX = Math.cos(this.currentAngle)
    this.velocityY = Math.sin(this.currentAngle)
  }

  /**
   * 设置新目标
   */
  setTarget (target: { x: number; y: number; isDead?: boolean } | null) {
    this.target = target
  }

  /**
   * 覆盖父类的 setAngle，同时更新 currentAngle
   */
  setAngle (angle: number) {
    super.setAngle(angle)
    this.currentAngle = angle
  }

  /**
   * 检查是否应该消失
   */
  isOutOfRange (): boolean {
    return this.lifetime <= 0
  }

  /**
   * 获取当前目标
   */
  getTarget () {
    return this.target
  }
}

export {
  SRAWMissile,
  SRAW_FIRE_INTERVAL,
  SRAW_MISSILE_COUNT
}
