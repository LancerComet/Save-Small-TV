/**
 * Shield Item - 护盾道具
 * 拾取后获得临时无敌护盾
 */

import { Sprite } from '../../../../core/sprite'
import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { SpecialItemType } from '../types.ts'

const WIDTH = 8
const HEIGHT = 8

const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#00aaff', // 蓝色
  2: '#66ccff', // 浅蓝
  3: '#ffffff', // 高光
  4: '#0066cc' // 深蓝边框
}

// 盾牌图案
const BITMAPS: SpriteBitmaps = [
  [
    '0', '4', '4', '4', '4', '4', '4', '0',
    '4', '1', '1', '3', '3', '1', '1', '4',
    '4', '1', '2', '2', '2', '2', '1', '4',
    '4', '1', '2', '3', '3', '2', '1', '4',
    '4', '1', '2', '2', '2', '2', '1', '4',
    '0', '4', '1', '2', '2', '1', '4', '0',
    '0', '0', '4', '1', '1', '4', '0', '0',
    '0', '0', '0', '4', '4', '0', '0', '0'
  ],
  [
    '0', '4', '4', '4', '4', '4', '4', '0',
    '4', '2', '2', '3', '3', '2', '2', '4',
    '4', '2', '1', '1', '1', '1', '2', '4',
    '4', '2', '1', '3', '3', '1', '2', '4',
    '4', '2', '1', '1', '1', '1', '2', '4',
    '0', '4', '2', '1', '1', '2', '4', '0',
    '0', '0', '4', '2', '2', '4', '0', '0',
    '0', '0', '0', '4', '4', '0', '0', '0'
  ]
]

class ShieldItem extends Sprite {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  itemType = SpecialItemType.SHIELD
  lifeCountdown: number = 10
  isPickedUp: boolean = false

  constructor () {
    super()
    this.paddingX = 0
    this.paddingY = 0
    this.TEXTURE_CHANGING_COUNTDOWN = 15 // 闪烁效果
  }
}

export {
  ShieldItem
}
