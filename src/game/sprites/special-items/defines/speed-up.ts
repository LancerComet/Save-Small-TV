import { Sprite } from '../../../../core/sprite'
import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { ISpecialItem, SpecialItemType } from '../types.ts'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#ffff00', // 黄色
  2: '#ffcc00', // 深黄
  3: '#ffffff', // 高光
  4: '#ff9900' // 橙色边
}

// 闪电/箭头图案
const BITMAPS: SpriteBitmaps = [
  [
    '0', '0', '0', '0', '1', '1', '0', '0',
    '0', '0', '0', '1', '3', '1', '0', '0',
    '0', '0', '1', '3', '1', '0', '0', '0',
    '0', '1', '1', '1', '1', '1', '1', '0',
    '0', '0', '0', '0', '1', '3', '1', '0',
    '0', '0', '0', '1', '3', '1', '0', '0',
    '0', '0', '1', '3', '1', '0', '0', '0',
    '0', '0', '1', '1', '0', '0', '0', '0'
  ],
  [
    '0', '0', '0', '0', '2', '2', '0', '0',
    '0', '0', '0', '2', '1', '2', '0', '0',
    '0', '0', '2', '1', '2', '0', '0', '0',
    '0', '2', '2', '2', '2', '2', '2', '0',
    '0', '0', '0', '0', '2', '1', '2', '0',
    '0', '0', '0', '2', '1', '2', '0', '0',
    '0', '0', '2', '1', '2', '0', '0', '0',
    '0', '0', '2', '2', '0', '0', '0', '0'
  ]
]

/**
 * Speed Up Item - 加速道具
 * 拾取后临时提升移动速度
 */
class SpeedUpItem extends Sprite implements ISpecialItem {
  readonly width = WIDTH
  readonly height = HEIGHT
  readonly textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)
  readonly lifeCountdown: number = 60

  constructor () {
    super(SpecialItemType.SPEED_UP)
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 10 // 快速闪烁
  }
}

export {
  SpeedUpItem
}
