import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { SpecialItemType } from '../types.ts'
import { SpecialItemBase } from './_base.ts'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#ff0000',
  2: '#ff6600',
  3: '#ffcc00',
  4: '#cc9900',
  5: '#ffffff'
}

const BITMAPS: SpriteBitmaps = [
  [
    '0', '0', '0', '1', '1', '0', '0', '0',
    '0', '0', '1', '2', '2', '1', '0', '0',
    '0', '3', '3', '3', '3', '2', '1', '0',
    '3', '5', '3', '3', '3', '3', '2', '1',
    '3', '5', '3', '3', '3', '3', '2', '1',
    '0', '3', '3', '3', '3', '2', '1', '0',
    '0', '0', '1', '2', '2', '1', '0', '0',
    '0', '0', '0', '1', '1', '0', '0', '0'
  ],
  [
    '0', '0', '0', '2', '2', '0', '0', '0',
    '0', '0', '2', '1', '1', '2', '0', '0',
    '0', '4', '4', '4', '4', '1', '2', '0',
    '4', '3', '4', '4', '4', '4', '1', '2',
    '4', '3', '4', '4', '4', '4', '1', '2',
    '0', '4', '4', '4', '4', '1', '2', '0',
    '0', '0', '2', '1', '1', '2', '0', '0',
    '0', '0', '0', '2', '2', '0', '0', '0'
  ]
]

class PowerBulletItem extends SpecialItemBase {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  constructor () {
    super()
    this.itemType = SpecialItemType.POWER_BULLET
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 30 // 闪烁效果
  }
}

export {
  PowerBulletItem
}
