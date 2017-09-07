class SpriteBase {
  /**
   * Width.
   *
   * @type {number}
   * @memberof SpriteBase
   */
  width: number = 0

  /**
   * Height.
   *
   * @type {number}
   * @memberof SpriteBase
   */
  height: number = 0

  /**
   * Axis x in Stage.
   *
   * @type {number}
   * @memberof SpriteBase
   */
  x: number = 0

  /**
   * Axis y in Stage.
   *
   * @type {number}
   * @memberof SpriteBase
   */
  y: number = 0

  /**
   * Color mapping,
   *
   * @type {{[bitmap: string]: string}}
   * @memberof Sprite
   *
   * @example
   * {
   *   '0': '#000',
   *   '1': '#fff',
   *   ...
   * }
   */
  colorMaps: {[bitmap: string]: string} = null

  /**
   * Texutre bitmaps.
   *
   * @type {string[]}
   * @memberof Sprite
   *
   * @example
   * [
   *   [
   *     '0', '1', 'A', 'C',
   *     '1', '1', 'B', 'D',
   *     ...
   *   ], [
   *     '0', '1', 'A', 'C',
   *     '1', '1', 'B', 'D',
   *     ...
   *   ], ...
   * ]
   */
  bitmaps: Array<string[]> = null
}

export {
  SpriteBase
}
