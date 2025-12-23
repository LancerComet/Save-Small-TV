import { Sprite } from '../../../../core/sprite'
import { SpecialItemType } from '../types.ts'

class SpecialItemBase extends Sprite {
  /**
   * 道具类型
   */
  itemType: SpecialItemType = null

  /**
   * 道具存在时间倒计时（秒）
   * 超时后消失
   */
  lifeCountdown: number = 10 // 10秒后消失

  /**
   * 是否已被拾取
   */
  isPickedUp: boolean = false
}

export {
  SpecialItemBase
}
