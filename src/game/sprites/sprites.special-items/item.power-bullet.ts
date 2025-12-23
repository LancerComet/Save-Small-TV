import { SpecialItem, ItemType } from './base'
import { bitmapsToTextures } from '../../../core/utils'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: TColorMap = {
  '0': 'transparent',
  '1': '#ff0000',
  '2': '#ff6600',
  '3': '#ffcc00',
  '4': '#ffffff'
}

const BITMAPS: TBitmaps = [
  [
    '0', '0', '0', '4', '4', '0', '0', '0',
    '0', '0', '4', '3', '3', '4', '0', '0',
    '0', '4', '3', '2', '2', '3', '4', '0',
    '4', '3', '2', '1', '1', '2', '3', '4',
    '4', '3', '2', '1', '1', '2', '3', '4',
    '0', '4', '3', '2', '2', '3', '4', '0',
    '0', '0', '4', '3', '3', '4', '0', '0',
    '0', '0', '0', '4', '4', '0', '0', '0',
  ],
  [
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '4', '3', '3', '4', '0', '0',
    '0', '4', '3', '2', '2', '3', '4', '0',
    '0', '3', '2', '1', '1', '2', '3', '0',
    '0', '3', '2', '1', '1', '2', '3', '0',
    '0', '4', '3', '2', '2', '3', '4', '0',
    '0', '0', '4', '3', '3', '4', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
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
