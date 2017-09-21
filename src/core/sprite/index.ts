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
   * Wether this sprite is dead.
   *
   * @readonly
   * @type {boolean}
   * @memberof Sprite
   */
  get isDead (): boolean {
    return this.hp <= 0
  }

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
   * Define which texture is going to be shown.
   *
   * @private
   * @type {number}
   * @memberof Sprite
   */
  private currentTexture: number = 0

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
  protected TEXTURE_CHANGING_COUNTDOWN: number = 60 * 1
  private $textureChangingCountdown: number = 0
  private textChangingCountdownRafID: number = 0

  /**
   * Start a countdown to calculate texture changing time.
   *
   * @private
   * @memberof Sprite
   */
  private textChangingCountdownExec () {
    if (this.$textureChangingCountdown <= 0) {
      this.currentTexture = this.currentTexture >= this.textures.length - 1
        ? 0
        : this.currentTexture + 1
      this.$textureChangingCountdown = this.TEXTURE_CHANGING_COUNTDOWN
    } else {
      this.$textureChangingCountdown--
    }
    this.textChangingCountdownRafID = requestAnimationFrame(this.textChangingCountdownExec.bind(this))
  }

  /**
   * Raf ID for offscreen drawing.
   *
   * @private
   * @memberof Sprite
   */
  private offscreenDrawingRafID = null

  /**
   * Draw texture into offscreen.
   *
   * @protected
   * @memberof Sprite
   */
  protected offscreenDrawingExec () {
    const context = this.offscreen.context
    context.putImageData(
      this.textures[this.currentTexture],
      0,
      0
    )
    this.offscreenDrawingRafID = requestAnimationFrame(
      this.offscreenDrawingExec.bind(this)
    )
  }

  /**
   * Destroy this sprite.
   *
   * @memberof Sprite
   */
  $destroy () {
    cancelAnimationFrame(this.textChangingCountdownRafID)
    cancelAnimationFrame(this.offscreenDrawingRafID)
  }

  /**
   * Creates an instance of Sprite.
   *
   * @memberof Sprite
   */
  constructor () {
    // Init offscreen.
    this.offscreen = new Offscreen(this.width, this.height)

    // Start texture changing.
    this.$textureChangingCountdown = this.TEXTURE_CHANGING_COUNTDOWN
    this.textChangingCountdownExec()
  }
}

export {
  Sprite
}
