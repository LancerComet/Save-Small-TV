import { floor, rand } from '../../utils'
import { SpecialItemBase } from './defines/_base.ts'
import { PowerBulletItem } from './defines/power-bullet'
import { ShotgunItem } from './defines/shotgun'

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
function getRandomItem (): SpecialItemBase {
  const ItemClass = ITEM_TYPES[floor(rand() * ITEM_TYPES.length)]
  return new ItemClass()
}

export {
  getRandomItem
}
