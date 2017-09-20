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
   * HP Value.
   *
   * @type {number}
   * @memberof Sprite
   */
  hp: number = 0

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
   * @type {number}
   * @memberof Sprite
   */
  currentTexture: number = 0

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
  protected textureChangingCountdown: number = 60 * 2
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
      this.$textureChangingCountdown = this.textureChangingCountdown
    } else {
      this.$textureChangingCountdown--
    }
    this.textChangingCountdownRafID = requestAnimationFrame(this.textChangingCountdownExec.bind(this))
  }

  /**
   * Destroy this sprite.
   *
   * @memberof Sprite
   */
  destroy () {
    cancelAnimationFrame(this.textChangingCountdownRafID)
  }

  constructor () {
    this.$textureChangingCountdown = this.textureChangingCountdown
    this.textChangingCountdownExec()
  }
}

export {
  Sprite
}
