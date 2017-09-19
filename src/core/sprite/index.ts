/// <reference path="./index.d.ts" />

/**
 * Sprite Class Definition.
 * Stands for a single sprite.
 *
 * @class Sprite
 */
class Sprite {
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
   * Textures of this sprite.
   *
   * @type {TTextures}
   * @memberof SpriteBase
   */
  textures: TTextures = []

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
}

export {
  Sprite
}
