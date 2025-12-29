import { Sprite } from '../../../core/sprite'

enum SpecialItemType {
  POWER_BULLET = 'POWER_BULLET', // 强力子弹
  SHOTGUN = 'SHOTGUN', // 散弹枪
  LASER = 'LASER', // 激光武器
  SRAW = 'SRAW', // 自动追踪导弹
  HEAL = 'HEAL', // 恢复HP
  SHIELD = 'SHIELD', // 护盾（临时无敌）
  SPEED_UP = 'SPEED_UP' // 加速
}

interface ISpecialItem extends Sprite {
  /**
   * 道具未拾取时的存活时间, 秒.
   */
  lifeCountdown: number
}

export {
  SpecialItemType
}

export type {
  ISpecialItem
}
