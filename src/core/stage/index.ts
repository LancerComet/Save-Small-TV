import { Sprite } from '../../core/sprite'

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

  // UI.
  // ==================================
  printText (text: string, x: number, y: number) {
    this.$context.fillStyle = '#fff'
    this.$context.fillText(text, x, y)
  }

  // Key.
  // ==================================
  keyPressed = {
    T: false, B: false, L: false, R: false, X: false, Y: false, START: false, ESC: false
  }

  /**
   * Register keyboard events.
   *
   * @private
   * @memberof Stage
   */
  private registerKeyboardEvents () {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case 27:
          this.keyPressed.ESC = true
          break

        case 37:
          this.keyPressed.L = true
          break

        case 38:
          this.keyPressed.T = true
          break

        case 39:
          this.keyPressed.R = true
          break

        case 40:
          this.keyPressed.B = true
          break

        case 90:
          this.keyPressed.X = true
          break

        case 88:
          this.keyPressed.Y = true
          break

        default:
          break
      }
    })

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case 27:
          this.keyPressed.ESC = false
          break

        case 37:
          this.keyPressed.L = false
          break

        case 38:
          this.keyPressed.T = false
          break

        case 39:
          this.keyPressed.R = false
          break

        case 40:
          this.keyPressed.B = false
          break

        case 90:
          this.keyPressed.X = false
          break

        case 88:
          this.keyPressed.Y = false
          break

        default:
          break
      }
    })
  }

  // Tick.
  // ==================================
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

  // Tick controlling.
  // ==================================
  private rafID: number = null

  /**
   * Start to render stage.
   *
   * @private
   * @memberof Stage
   */
  start () {
    this.tick()
  }

  /**
   * Freeze stage rendering.
   *
   * @memberof Stage
   */
  pause () {
    cancelAnimationFrame(this.rafID)
  }

  /**
   * Stage ticking function.
   *
   * @private
   * @memberof Stage
   */
  private tick () {
    this.clearStage()
    this.execTickCallback()
    this.rafID = requestAnimationFrame(this.tick.bind(this))
  }

  constructor (canvasElement: HTMLCanvasElement, option?: IStageOption) {
    // Canvas Element & Context.
    this.$canvasElement = canvasElement
    this.$context = canvasElement.getContext('2d')

    // Set font style.
    this.$context.font = '8px Fiexdsys'

    // Set options.
    if (typeof option === 'object') {
      // Set smoothing.
      !option.enableSmooth && this.disableSmoothing()

      // Set scale.
      if (typeof option.scale === 'number') {
        this.scale = option.scale
      }
    }

    // Register Key Events.
    this.registerKeyboardEvents()
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

/**
 * Define type for Stage text.
 */
type TStageText = [string, number, number]
