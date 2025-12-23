import { SpecialItem, ItemType } from './base'
import { bitmapsToTextures } from '../../../core/utils'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: TColorMap = {
  '0': 'transparent',
  '1': '#ff0000',  // 弹头红色
  '2': '#ff6600',  // 橙色
  '3': '#ffcc00',  // 金色壳体
  '4': '#cc9900',  // 暗金色
  '5': '#ffffff'   // 高光
}

// 大口径子弹形状（尖头朝右）
const BITMAPS: TBitmaps = [
  [
    '0', '0', '0', '1', '1', '0', '0', '0',
    '0', '0', '1', '2', '2', '1', '0', '0',
    '0', '3', '3', '3', '3', '2', '1', '0',
    '3', '5', '3', '3', '3', '3', '2', '1',
    '3', '5', '3', '3', '3', '3', '2', '1',
    '0', '3', '3', '3', '3', '2', '1', '0',
    '0', '0', '1', '2', '2', '1', '0', '0',
    '0', '0', '0', '1', '1', '0', '0', '0',
  ],
  [
    '0', '0', '0', '2', '2', '0', '0', '0',
    '0', '0', '2', '1', '1', '2', '0', '0',
    '0', '4', '4', '4', '4', '1', '2', '0',
    '4', '3', '4', '4', '4', '4', '1', '2',
    '4', '3', '4', '4', '4', '4', '1', '2',
    '0', '4', '4', '4', '4', '1', '2', '0',
    '0', '0', '2', '1', '1', '2', '0', '0',
    '0', '0', '0', '2', '2', '0', '0', '0',
  ],
]

/**
 * 强力子弹道具
 * 拾取后获得强力子弹武器
 */
class PowerBulletItem extends SpecialItem {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  constructor () {
    super()
    this.itemType = ItemType.POWER_BULLET
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 30  // 闪烁效果
  }
}

export {
  PowerBulletItem
}
