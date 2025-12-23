/// <reference path="./index.d.ts" />

import { Offscreen } from './offscreen'

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
   * HP Value.
   *
   * @type {number}
   * @memberof Sprite
   */
  hp: number = 0

  /**
   * Speed of this sprite.
   *
   * @type {number}
   * @memberof Sprite
   */
  speed: number = 0

  /**
   * Moving direction x.
   *
   * @type {('L' | 'R')}
   * @memberof Sprite
   */
  dirX: 'L' | 'R' = 'L'

  /**
   * Moving direction y.
   *
   * @type {('T' | 'B')}
   * @memberof Sprite
   */
  dirY: 'T' | 'B' = 'T'

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

  /**
   * Visual padding distance.
   *
   * @type {number}
   * @memberof Sprite
   */
  paddingX: number = 0
  paddingY: number = 0

  /**
   * Define which texture is going to be shown.
   *
   * @protected
   * @type {number}
   * @memberof Sprite
   */
  protected currentTexture: number = 0

  /**
   * Track last rendered texture to avoid unnecessary putImageData.
   *
   * @private
   * @type {number}
   * @memberof Sprite
   */
  private lastRenderedTexture: number = -1

  /**
   * Offscreen canvas for this sprite.
   *
   * @type {Offscreen}
   * @memberof Sprite
   */
  offscreen: Offscreen = null

  /**
   * Texture changing count down.
   * Value: Total frames.
   *
   * @example
   * // I want change texture every 2 seconds.
   * textureChangingCountdown = 60 * 2  // 60 FPS * 2s
   *
   * @protected
   * @type {number}
   * @memberof Sprite
   */
  protected TEXTURE_CHANGING_COUNTDOWN: number | false = null
  private $textureChangingCountdown: number = 0

  /**
   * Update texture animation (call once per frame from game loop).
   * This replaces the old per-sprite rAF loop.
   *
   * @memberof Sprite
   */
  updateTexture () {
    // Lazy init offscreen with correct size (子类属性在父类构造函数中还未初始化)
    if (!this.offscreen || this.offscreen.canvasElement.width !== this.width) {
      this.offscreen = new Offscreen(this.width, this.height)
      this.lastRenderedTexture = -1  // Force re-render
    }

    // Handle texture animation countdown
    if (typeof this.TEXTURE_CHANGING_COUNTDOWN === 'number') {
      if (this.$textureChangingCountdown <= 0) {
        this.currentTexture = this.currentTexture >= this.textures.length - 1
          ? 0
          : this.currentTexture + 1
        this.$textureChangingCountdown = this.TEXTURE_CHANGING_COUNTDOWN
      } else {
        this.$textureChangingCountdown--
      }
    }

    // Only update offscreen if texture changed
    if (this.currentTexture !== this.lastRenderedTexture && this.textures[this.currentTexture]) {
      this.offscreen.context.putImageData(
        this.textures[this.currentTexture],
        0,
        0
      )
      this.lastRenderedTexture = this.currentTexture
    }
  }

  /**
   * Destroy this sprite.
   *
   * @memberof Sprite
   */
  $destroy () {
    // No more rAF to cancel - cleanup is simpler now
  }

  /**
   * Creates an instance of Sprite.
   *
   * @memberof Sprite
   */
  constructor () {
    // Offscreen will be lazy-initialized in updateTexture()
    // because subclass properties (width, height, textures) are not available yet

    // Initialize texture countdown
    if (typeof this.TEXTURE_CHANGING_COUNTDOWN === 'number') {
      this.$textureChangingCountdown = this.TEXTURE_CHANGING_COUNTDOWN
    }
  }
}

export {
  Sprite
}
