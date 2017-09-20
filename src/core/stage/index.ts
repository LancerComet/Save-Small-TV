import { Sprite } from '../../core/sprite'
import { Offscreen } from './offscreen'

/**
 * Stage class.
 * For controlling game play canvas.
 *
 * @class Stage
 */
class Stage {
  // Canvas Elements.
  // ==================================
  private $canvasElement: HTMLCanvasElement
  private $context: CanvasRenderingContext2D
  get canvasElement () { return this.$canvasElement }
  get context () { return this.$context }

  // Offscreens.
  // ==================================
  private offscreens: {[name: string]: Offscreen} = {
    sprites: null
  }

  /**
   * Initialize Offscreen canvas.
   *
   * @private
   * @memberof Stage
   */
  private initOffscreens () {
    const width = this.logicalSize[0]
    const height = this.logicalSize[1]
    this.offscreens.sprites = new Offscreen(width, height)
  }

  // Content drawing.
  // ==================================
  private _scale: number = 1
  private get scale () {
    return this._scale
  }
  private set scale (newValue) {
    this._scale = newValue
    this.$context.scale(newValue, newValue)
  }

  /**
   * Get logical size of the stage.
   * Logical size: Actual size / Scale rate.
   *
   * @readonly
   * @type {[number, number]}
   * @memberof Stage
   */
  get logicalSize (): [number, number] {
    const canvas = this.canvasElement
    const scale = this.scale
    return [
      canvas.width / scale,
      canvas.height / scale
    ]
  }

  /**
   * Disable image smoothing.
   *
   * @private
   * @memberof Stage
   */
  private disableSmoothing () {
    [
      'mozImageSmoothingEnabled',
      'webkitImageSmoothingEnabled',
      'msImageSmoothingEnabled',
      'imageSmoothingEnabled'
    ].forEach(item => {
      this.$context[item] = false
    })
  }

  /**
   * Draw all sprites into offscreen and then draw offscreen to main stage.
   *
   * @private
   * @memberof Stage
   */
  private drawSprites () {
    const offscreen = this.offscreens.sprites

    // Drawing all sprites into offscreen.
    for (let i = 0, length = this.sprites.length; i < length; i++) {
      const sprite = this.sprites[i]
      offscreen.context.putImageData(
        sprite.textures[sprite.currentTexture],
        sprite.x,
        sprite.y
      )
    }

    // Draw offscreen into stage.
    this.$context.drawImage(offscreen.canvasElement, 0, 0)
  }

  /**
   * Clear whole stage.
   *
   * @private
   * @memberof Stage
   */
  private clearStage () {
    this.$context.clearRect(
      0, 0, this.$canvasElement.width, this.$canvasElement.height
    )
  }

  // Sprites.
  // ==================================
  private sprites: Sprite[] = []

  /**
   * Append a new sprite to stage.
   *
   * @param {Sprite} sprite
   * @memberof Stage
   */
  addSprite (sprite: Sprite) {
    this.sprites.indexOf(sprite) < 0 && this.sprites.push(sprite)
  }

  /**
   * Remove target sprite.
   *
   * @param {Sprite} sprite
   * @memberof Stage
   */
  removeSprite (sprite: Sprite) {
    const index = this.sprites.indexOf(sprite)
    if (index > -1) {
      this.sprites.splice(index, 1)
    }
  }

  // Tick.
  // ==================================

  /**
   * Store all tick callbacks.
   *
   * @private
   * @memberof Stage
   */
  private tickCallbacks: Array<(stage: Stage) => void> = []

  /**
   * Execute ticking callbacks.
   *
   * @private
   * @memberof Stage
   */
  private execTickCallback () {
    for (let i = 0, length = this.tickCallbacks.length; i < length; i++) {
      this.tickCallbacks[i](this)
    }
  }

  /**
   * Register callback to every single ticking.
   *
   * @param {Function} callback
   * @memberof Stage
   */
  onTick (callback: (stage: Stage) => void) {
    if (this.tickCallbacks.indexOf(callback) < 0 && typeof callback === 'function') {
      this.tickCallbacks.push(callback)
    }
  }

  // Stage controlling.
  // ==================================
  private rafID: number = null

  /**
   * Start to render stage.
   *
   * @private
   * @memberof Stage
   */
  start () {
    this.clearStage()
    this.drawSprites()
    this.execTickCallback()
    this.rafID = requestAnimationFrame(this.start.bind(this))
  }

  /**
   * Freeze stage rendering.
   *
   * @memberof Stage
   */
  pause () {
    cancelAnimationFrame(this.rafID)
  }

  constructor (canvasElement: HTMLCanvasElement, option?: IStageOption) {
    // Canvas Element & Context.
    this.$canvasElement = canvasElement
    this.$context = canvasElement.getContext('2d')

    // Set options.
    if (typeof option === 'object') {
      // Set smoothing.
      !option.enableSmooth && this.disableSmoothing()

      // Set scale.
      if (typeof option.scale === 'number') {
        this.scale = option.scale
      }
    }

    // Initialize Offscreens.
    this.initOffscreens()
  }
}

export {
  Stage
}

/**
 * Interface for stage option.
 *
 * @interface IStageOption
 */
interface IStageOption {
  enableSmooth?: boolean
  scale?: number
}
