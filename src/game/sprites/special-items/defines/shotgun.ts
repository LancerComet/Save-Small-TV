import { Sprite } from '../../../../core/sprite'
import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { SpecialItemType } from '../types.ts'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#00ff00',
  2: '#66ff66',
  3: '#ccffcc',
  4: '#ffffff'
}

const BITMAPS: SpriteBitmaps = [
  [
    '0', '0', '0', '0', '0', '4', '1', '0',
    '0', '0', '0', '0', '4', '2', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '4', '1', '2', '1', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '4', '2', '0', '0',
    '0', '0', '0', '0', '0', '4', '1', '0',
    '0', '0', '0', '0', '0', '0', '0', '0'
  ],
  [
    '0', '0', '0', '0', '0', '0', '4', '1',
    '0', '0', '0', '0', '0', '4', '2', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '4', '1', '2', '1', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '4', '2', '0',
    '0', '0', '0', '0', '0', '0', '4', '1',
    '0', '0', '0', '0', '0', '0', '0', '0'
  ]
]

/**
 * 散弹枪道具
 * 拾取后获得散弹枪武器
 */
class ShotgunItem extends Sprite {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  itemType = SpecialItemType.SHOTGUN
  lifeCountdown: number = 10
  isPickedUp: boolean = false

  constructor () {
    super()
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 30 // 闪烁效果
  }
}

export {
  ShotgunItem
}
