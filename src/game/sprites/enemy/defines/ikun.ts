/**
 * iKun Enemy - 小黑子/坤坤
 * 完全按照图片：灰色刘海、黄鸡脸、红腮红、黑衣服、左手抱篮球
 * 会向玩家扔篮球！
 */

import { Sprite } from '../../../../core/sprite'
import { SpriteColorMap, SpriteBitmaps } from '../../../../core/sprite/types.ts'
import { bitmapsToTextures } from '../../../../core/utils'
import { BasketballAbility } from '../../../abilities'
import { Enemy } from '../base.ts'

const WIDTH = 16
const HEIGHT = 14
const HP = 18

// 小黑子配色
const COLOR_MAP: SpriteColorMap = {
  0: 'transparent',
  1: '#aaaaaa', // 浅灰刘海
  2: '#777777', // 深灰刘海
  3: '#ffcc66', // 黄色鸡脸
  4: '#ff4444', // 红腮红
  5: '#000000', // 黑色眼睛
  6: '#ffffff', // 白色眼睛/高光
  7: '#ff8833', // 橙色嘴
  8: '#333333', // 黑色衣服
  9: '#cc6633', // 篮球橙
  a: '#994422' // 篮球纹路
}

// 完全按图片：左边篮球、灰刘海、鸡头、黑衣服
const BITMAPS: SpriteBitmaps = [
  [
    // 第一帧
    '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '0', '0', '0', '0',
    '0', '0', '0', '0', '1', '2', '1', '1', '1', '1', '1', '2', '1', '0', '0', '0',
    '0', '0', '0', '0', '1', '1', '2', '1', '1', '1', '2', '1', '1', '0', '0', '0',
    '0', '0', '0', '0', '1', '1', '1', '2', '2', '2', '1', '1', '1', '0', '0', '0',
    '0', '0', '0', '8', '3', '3', '5', '6', '3', '5', '6', '3', '3', '8', '0', '0',
    '0', '0', '0', '8', '4', '3', '5', '5', '3', '5', '5', '3', '4', '8', '0', '0',
    '0', '0', '0', '8', '3', '3', '3', '3', '3', '3', '3', '3', '3', '8', '0', '0',
    '0', '0', '0', '0', '8', '3', '3', '7', '7', '3', '3', '3', '8', '0', '0', '0',
    '0', '0', '0', '0', '0', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0', '0',
    '0', '9', 'a', '9', '0', '8', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0',
    '9', '9', 'a', '9', '9', '8', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0',
    'a', 'a', '9', 'a', 'a', '8', '8', '0', '0', '0', '0', '8', '8', '0', '0', '0',
    '9', '9', 'a', '9', '9', '8', '0', '0', '0', '0', '0', '0', '8', '0', '0', '0',
    '0', '9', 'a', '9', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
  ],
  [
    // 第二帧 - 愤怒表情
    '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '0', '0', '0', '0',
    '0', '0', '0', '0', '1', '2', '1', '1', '1', '1', '1', '2', '1', '0', '0', '0',
    '0', '0', '0', '0', '1', '1', '2', '1', '1', '1', '2', '1', '1', '0', '0', '0',
    '0', '0', '0', '0', '1', '8', '8', '2', '2', '8', '8', '1', '1', '0', '0', '0',
    '0', '0', '0', '8', '3', '3', '5', '6', '3', '5', '6', '3', '3', '8', '0', '0',
    '0', '0', '0', '8', '4', '3', '5', '5', '3', '5', '5', '3', '4', '8', '0', '0',
    '0', '0', '0', '8', '3', '3', '3', '3', '3', '3', '3', '3', '3', '8', '0', '0',
    '0', '0', '0', '0', '8', '3', '7', '7', '7', '7', '3', '3', '8', '0', '0', '0',
    '0', '0', '0', '0', '0', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0', '0',
    '0', '9', 'a', '9', '0', '8', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0',
    '9', '9', 'a', '9', '9', '8', '8', '8', '8', '8', '8', '8', '8', '0', '0', '0',
    'a', 'a', '9', 'a', 'a', '8', '8', '0', '0', '0', '0', '8', '8', '0', '0', '0',
    '9', '9', 'a', '9', '9', '8', '0', '0', '0', '0', '0', '0', '8', '0', '0', '0',
    '0', '9', 'a', '9', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
  ]
]

/**
 * 小黑子.
 */
class IkunEnemy extends Enemy {
  width = WIDTH
  height = HEIGHT
  textures = bitmapsToTextures(WIDTH, HEIGHT, BITMAPS, COLOR_MAP)

  // 用于抖动效果
  private shakeTime: number = 0
  private shakeIntensity: number = 2

  constructor () {
    super()
    this.hp = HP
    this.speed = 45
    this.paddingX = 3
    this.paddingY = 2
    this.TEXTURE_CHANGING_COUNTDOWN = 15
    this.attack = 18
    this.scoreValue = 25

    this.shakeTime = Math.random() * Math.PI * 2

    // 添加投掷篮球能力！
    this.addAbility(new BasketballAbility({
      cooldown: 2.0,
      ballSpeed: 90,
      ballDamage: 12,
      ballSize: 3
    }))
  }

  /**
   * 愤怒抖动效果
   */
  move (target: Sprite | null, deltaTime: number): void {
    super.move(target, deltaTime)

    this.shakeTime += deltaTime * 20
    const shakeX = Math.sin(this.shakeTime) * this.shakeIntensity * deltaTime
    const shakeY = Math.cos(this.shakeTime * 1.3) * this.shakeIntensity * deltaTime
    this.x += shakeX
    this.y += shakeY
  }
}

// 兼容导出
const GhostEnemy = IkunEnemy
const DanmakuEnemy = IkunEnemy
const HaterEnemy = IkunEnemy

export {
  GhostEnemy,
  DanmakuEnemy,
  HaterEnemy,
  IkunEnemy
}
