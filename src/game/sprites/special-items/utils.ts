import { Sprite } from '../../../core/sprite'
import { rand } from '../../utils'
import { SpecialItemType } from './types.ts'
import { PowerBulletItem } from './defines/power-bullet'
import { ShotgunItem } from './defines/shotgun'
import { HealItem } from './defines/heal'

/**
 * 道具接口
 */
interface ISpecialItem extends Sprite {
  itemType: SpecialItemType
  lifeCountdown: number
  isPickedUp: boolean
}

/**
 * 道具掉落权重配置
 * weight 越高，掉落概率越大
 */
interface ItemDropConfig {
  ItemClass: new () => ISpecialItem
  weight: number
}

const ITEM_DROP_TABLE: ItemDropConfig[] = [
  { ItemClass: PowerBulletItem, weight: 40 }, // 40%
  { ItemClass: ShotgunItem, weight: 40 }, // 40%
  { ItemClass: HealItem, weight: 20 } // 20% - 稀有
]

// 计算总权重
const TOTAL_WEIGHT = ITEM_DROP_TABLE.reduce((sum, item) => sum + item.weight, 0)

/**
 * 根据权重获取随机道具
 */
function getRandomItem (): ISpecialItem {
  const roll = rand() * TOTAL_WEIGHT
  let cumulative = 0

  for (const config of ITEM_DROP_TABLE) {
    cumulative += config.weight
    if (roll < cumulative) {
      return new config.ItemClass()
    }
  }

  // 兜底
  return new PowerBulletItem()
}

export {
  getRandomItem,
  ITEM_DROP_TABLE
}

export type {
  ISpecialItem
}
