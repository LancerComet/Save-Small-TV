import { Sprite } from '../../core/sprite'

class Sprite22 extends Sprite {
  /**
   * HP setup.
   *
   * @type {number}
   * @memberof Sprite22
   */
  hp: number = 50

  /**
   * Color mapping.
   *
   * @memberof Sprite22
   */
  colorMaps = {
    '0': '#0af',
    '1': '#f50'
  }

  /**
   * Bitmaps in keyframes.
   *
   * @memberof Sprite22
   */
  bitmaps = [
    [
      '0', '0', '0', '0'
    ],
    [
      '1', '1', '1', '1'
    ],
  ]
}
