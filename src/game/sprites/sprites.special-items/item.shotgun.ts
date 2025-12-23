import { SpecialItem, ItemType } from './base'
import { bitmapsToTextures } from '../../../core/utils'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: TColorMap = {
  '0': 'transparent',
  '1': '#00ff00',  // 深绿
  '2': '#66ff66',  // 中绿
  '3': '#ccffcc',  // 浅绿
  '4': '#ffffff'   // 高光
}

// 三个散开的小弹丸（扇形分布）
const BITMAPS: TBitmaps = [
  [
    '0', '0', '0', '0', '0', '4', '1', '0',
    '0', '0', '0', '0', '4', '2', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '4', '1', '2', '1', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '4', '2', '0', '0',
    '0', '0', '0', '0', '0', '4', '1', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
  [
    '0', '0', '0', '0', '0', '0', '4', '1',
    '0', '0', '0', '0', '0', '4', '2', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '4', '1', '2', '1', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '4', '2', '0',
    '0', '0', '0', '0', '0', '0', '4', '1',
    '0', '0', '0', '0', '0', '0', '0', '0',
  ],
]

/**
 * 散弹枪道具
 * 拾取后获得散弹枪武器
 */
class ShotgunItem extends SpecialItem {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  constructor () {
    super()
    this.itemType = ItemType.SHOTGUN
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 30  // 闪烁效果
  }
}

export {
  ShotgunItem
}
