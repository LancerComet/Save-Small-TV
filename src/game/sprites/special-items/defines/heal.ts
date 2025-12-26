import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { SpecialItemType } from '../types.ts'
import { SpecialItemBase } from './_base.ts'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#ff0000', // 红色
  2: '#ff6666', // 浅红
  3: '#cc0000', // 深红
  4: '#ffffff' // 高光
}

// 心形图案
const BITMAPS: SpriteBitmaps = [
  [
    '0', '1', '1', '0', '0', '1', '1', '0',
    '1', '4', '2', '1', '1', '2', '2', '1',
    '1', '2', '2', '2', '2', '2', '2', '1',
    '1', '2', '2', '2', '2', '2', '2', '1',
    '0', '1', '2', '2', '2', '2', '1', '0',
    '0', '0', '1', '2', '2', '1', '0', '0',
    '0', '0', '0', '1', '1', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0'
  ],
  [
    '0', '3', '3', '0', '0', '3', '3', '0',
    '3', '4', '1', '3', '3', '1', '1', '3',
    '3', '1', '1', '1', '1', '1', '1', '3',
    '3', '1', '1', '1', '1', '1', '1', '3',
    '0', '3', '1', '1', '1', '1', '3', '0',
    '0', '0', '3', '1', '1', '3', '0', '0',
    '0', '0', '0', '3', '3', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0'
  ]
]

class HealItem extends SpecialItemBase {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  constructor () {
    super()
    this.itemType = SpecialItemType.HEAL
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 20 // 心跳闪烁效果
  }
}

export {
  HealItem
}
