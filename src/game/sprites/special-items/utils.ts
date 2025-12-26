import { Sprite } from '../../../core/sprite'
import { rand } from '../../utils'
import { SpecialItemType } from './types.ts'
import { PowerBulletItem } from './defines/power-bullet'
import { ShotgunItem } from './defines/shotgun'
import { HealItem } from './defines/heal'
import { ShieldItem } from './defines/shield'
import { SpeedUpItem } from './defines/speed-up'
import { LaserItem } from './defines/laser'
import { SRAWItem } from './defines/sraw'

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
  { ItemClass: PowerBulletItem, weight: 20 }, // 20%
  { ItemClass: ShotgunItem, weight: 20 }, // 20%
  { ItemClass: LaserItem, weight: 15 }, // 15% - 激光
  { ItemClass: SRAWItem, weight: 10 }, // 10% - SRAW 追踪导弹（稀有）
  { ItemClass: HealItem, weight: 15 }, // 15% - 恢复
  { ItemClass: ShieldItem, weight: 10 }, // 10% - 护盾（稀有）
  { ItemClass: SpeedUpItem, weight: 10 } // 10% - 加速（稀有）
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
