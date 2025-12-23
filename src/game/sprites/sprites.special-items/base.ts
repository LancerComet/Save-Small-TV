import { Sprite } from '../../../core/sprite'

/**
 * 道具类型枚举
 */
enum ItemType {
  POWER_BULLET = 'POWER_BULLET',    // 强力子弹
  SHOTGUN = 'SHOTGUN',              // 散弹枪
  HEAL = 'HEAL',                    // 恢复HP（预留）
  SPEED_UP = 'SPEED_UP'             // 加速（预留）
}

/**
 * 特殊道具基类
 */
class SpecialItem extends Sprite {
  /**
   * 道具类型
   */
  itemType: ItemType = null

  /**
   * 道具存在时间倒计时（秒）
   * 超时后消失
   */
  lifeCountdown: number = 10  // 10秒后消失

  /**
   * 是否已被拾取
   */
  isPickedUp: boolean = false

  constructor () {
    super()
  }
}

export {
  SpecialItem,
  ItemType
}
