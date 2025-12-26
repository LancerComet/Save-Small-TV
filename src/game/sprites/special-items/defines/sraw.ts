import { Sprite } from '../../../../core/sprite'
import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { SpecialItemType } from '../types.ts'

const WIDTH = 8
const HEIGHT = 8

// SRAW 道具配色 - 军绿色导弹
const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#445522', // 深军绿
  2: '#667744', // 军绿
  3: '#889966', // 浅军绿
  4: '#ff4444', // 红色弹头
  5: '#ffaa00', // 橙色火焰
  6: '#ffffff' // 白色高光
}

// SRAW 道具 8x8 - 导弹形状
const BITMAPS: SpriteBitmaps = [
  [
    '0', '0', '0', '4', '4', '0', '0', '0',
    '0', '0', '4', '6', '4', '0', '0', '0',
    '0', '0', '1', '2', '1', '0', '0', '0',
    '0', '0', '1', '3', '1', '0', '0', '0',
    '0', '1', '2', '3', '2', '1', '0', '0',
    '0', '0', '1', '2', '1', '0', '0', '0',
    '0', '0', '0', '5', '0', '0', '0', '0',
    '0', '0', '5', '0', '5', '0', '0', '0'
  ],
  [
    '0', '0', '0', '4', '4', '0', '0', '0',
    '0', '0', '4', '6', '4', '0', '0', '0',
    '0', '0', '1', '2', '1', '0', '0', '0',
    '0', '0', '1', '3', '1', '0', '0', '0',
    '0', '1', '2', '3', '2', '1', '0', '0',
    '0', '0', '1', '2', '1', '0', '0', '0',
    '0', '0', '5', '0', '5', '0', '0', '0',
    '0', '0', '0', '5', '0', '0', '0', '0'
  ]
]

/**
 * SRAW 道具
 * 拾取后获得自动追踪导弹武器
 */
class SRAWItem extends Sprite {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  itemType = SpecialItemType.SRAW
  lifeCountdown: number = 10
  isPickedUp: boolean = false

  constructor () {
    super()
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 20 // 闪烁效果
  }
}

export {
  SRAWItem
}
