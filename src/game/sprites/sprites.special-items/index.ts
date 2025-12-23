import { SpecialItem, ItemType } from './base'
import { PowerBulletItem } from './item.power-bullet'
import { ShotgunItem } from './item.shotgun'
import { floor, rand } from '../../utils'

/**
 * 所有道具类型列表
 */
const ITEM_TYPES = [
  PowerBulletItem,
  ShotgunItem
]

/**
 * 获取随机道具
 */
function getRandomItem (): SpecialItem {
  const ItemClass = ITEM_TYPES[floor(rand() * ITEM_TYPES.length)]
  return new ItemClass()
}

export {
  SpecialItem,
  ItemType,
  PowerBulletItem,
  ShotgunItem,
  getRandomItem
}
