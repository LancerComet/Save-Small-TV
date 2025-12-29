import { Sprite } from '../../../../core/sprite'
import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { ISpecialItem, SpecialItemType } from '../types.ts'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#00ffff', // 青色
  2: '#00cccc', // 深青
  3: '#ffffff', // 高光
  4: '#006666' // 暗青边
}

// 激光图案
const BITMAPS: SpriteBitmaps = [
  [
    '0', '0', '0', '3', '3', '0', '0', '0',
    '0', '0', '3', '1', '1', '3', '0', '0',
    '0', '0', '2', '1', '1', '2', '0', '0',
    '0', '0', '2', '1', '1', '2', '0', '0',
    '0', '0', '2', '1', '1', '2', '0', '0',
    '0', '0', '2', '1', '1', '2', '0', '0',
    '0', '4', '4', '2', '2', '4', '4', '0',
    '0', '0', '4', '4', '4', '4', '0', '0'
  ],
  [
    '0', '0', '0', '1', '1', '0', '0', '0',
    '0', '0', '1', '3', '3', '1', '0', '0',
    '0', '0', '1', '3', '3', '1', '0', '0',
    '0', '0', '1', '3', '3', '1', '0', '0',
    '0', '0', '1', '3', '3', '1', '0', '0',
    '0', '0', '1', '3', '3', '1', '0', '0',
    '0', '4', '4', '1', '1', '4', '4', '0',
    '0', '0', '4', '4', '4', '4', '0', '0'
  ]
]

/**
 * Laser Item - 激光道具
 * 拾取后获得激光武器
 */
class LaserItem extends Sprite implements ISpecialItem {
  readonly width = WIDTH
  readonly height = HEIGHT
  readonly textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)
  readonly lifeCountdown: number = 60

  constructor () {
    super(SpecialItemType.LASER)
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 8 // 快速闪烁
  }
}

export {
  LaserItem
}
