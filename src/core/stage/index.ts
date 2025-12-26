import { Camera } from '../../core/camera'
import { GamepadController } from '../../core/gamepad'
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
    this.$context.setTransform(newValue, 0, 0, newValue, 0, 0)
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

  // Resize handling.
  // ==================================
  /**
   * Resize canvas to fill entire window.
   *
   * @private
   * @memberof Stage
   */
  private resize () {
    // Set canvas to fill window
    this.$canvasElement.width = window.innerWidth
    this.$canvasElement.height = window.innerHeight

    // Re-apply transform with current scale
    this.$context.setTransform(this._scale, 0, 0, this._scale, 0, 0)

    // Re-apply settings after resize
    this.disableSmoothing()
    this.$context.font = '8px kenpixel'
  }

  /**
   * Register window resize event.
   *
   * @private
   * @memberof Stage
   */
  private registerResizeEvent () {
    window.addEventListener('resize', () => {
      this.resize()
    })
  }

  // Camera.
  // ==================================
  /**
   * Camera for world-to-screen coordinate transformation.
   *
   * @type {Camera}
   * @memberof Stage
   */
  camera: Camera = new Camera()

  // UI.
  // ==================================
  measureText (text: string, fontSize: number = 8): number {
    this.$context.font = `${fontSize}px kenpixel`
    const width = this.$context.measureText(text).width
    this.$context.font = '8px kenpixel'
    return width
  }

  printText (text: string, x: number, y: number, fontSize: number = 8) {
    this.$context.font = `${fontSize}px kenpixel`
    this.$context.fillStyle = '#fff'
    this.$context.fillText(text, x, y)
    this.$context.font = '8px kenpixel' // 恢复默认
  }

  // Key.
  // ==================================
  keyPressed = {
    // 移动键 (WASD)
    W: false,
    A: false,
    S: false,
    D: false,
    // 发射键 (箭头)
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    // 功能键
    X: false,
    Y: false,
    START: false,
    ESC: false
  }

  // Gamepad.
  // ==================================
  /**
   * Gamepad controller for handling gamepad input.
   *
   * @type {GamepadController}
   * @memberof Stage
   */
  gamepad: GamepadController = new GamepadController()

  /**
   * Combined input state (keyboard + gamepad).
   * Use this for game logic instead of keyPressed directly.
   */
  get input () {
    const gp = this.gamepad
    const movement = gp.getMovement()
    const shoot = gp.getShootDirection()

    return {
      // Movement (WASD or Left Stick)
      moveUp: this.keyPressed.W || movement.y < -0.3,
      moveDown: this.keyPressed.S || movement.y > 0.3,
      moveLeft: this.keyPressed.A || movement.x < -0.3,
      moveRight: this.keyPressed.D || movement.x > 0.3,

      // Shooting (Arrow keys or Right Stick)
      shootUp: this.keyPressed.UP || shoot.up,
      shootDown: this.keyPressed.DOWN || shoot.down,
      shootLeft: this.keyPressed.LEFT || shoot.left,
      shootRight: this.keyPressed.RIGHT || shoot.right,

      // Analog movement values (for smooth gamepad control)
      analogMoveX: movement.x,
      analogMoveY: movement.y,
      analogShootX: gp.state.rightStickX,
      analogShootY: gp.state.rightStickY,

      // Action buttons
      start: this.keyPressed.START || gp.state.buttonStart,
      actionX: this.keyPressed.X || gp.state.buttonA,
      actionY: this.keyPressed.Y || gp.state.buttonB,
      esc: this.keyPressed.ESC || gp.state.buttonSelect
    }
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
        case 13:
          this.keyPressed.START = true
          break

        case 27:
          this.keyPressed.ESC = true
          break

        // 箭头键 - 发射方向
        case 37:
          this.keyPressed.LEFT = true
          break

        case 38:
          this.keyPressed.UP = true
          break

        case 39:
          this.keyPressed.RIGHT = true
          break

        case 40:
          this.keyPressed.DOWN = true
          break

        // WASD - 移动
        case 87: // W
          this.keyPressed.W = true
          break

        case 65: // A
          this.keyPressed.A = true
          break

        case 83: // S
          this.keyPressed.S = true
          break

        case 68: // D
          this.keyPressed.D = true
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
        case 13:
          this.keyPressed.START = false
          break

        case 27:
          this.keyPressed.ESC = false
          break

        // 箭头键 - 发射方向
        case 37:
          this.keyPressed.LEFT = false
          break

        case 38:
          this.keyPressed.UP = false
          break

        case 39:
          this.keyPressed.RIGHT = false
          break

        case 40:
          this.keyPressed.DOWN = false
          break

        // WASD - 移动
        case 87: // W
          this.keyPressed.W = false
          break

        case 65: // A
          this.keyPressed.A = false
          break

        case 83: // S
          this.keyPressed.S = false
          break

        case 68: // D
          this.keyPressed.D = false
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
    // 使用逻辑尺寸清除，因为 context 已被 scale
    const [logicalWidth, logicalHeight] = this.logicalSize
    this.$context.clearRect(0, 0, logicalWidth, logicalHeight)
  }

  /**
   * Store all tick callbacks.
   *
   * @private
   * @memberof Stage
   */
  private tickCallbacks: Array<(stage: Stage, deltaTime: number) => void> = []

  /**
   * Execute ticking callbacks.
   *
   * @private
   * @memberof Stage
   */
  private execTickCallback () {
    for (let i = 0, length = this.tickCallbacks.length; i < length; i++) {
      this.tickCallbacks[i](this, this.deltaTime)
    }
  }

  /**
   * Register callback to every single ticking.
   *
   * @param {Function} callback
   * @memberof Stage
   */
  onTick (callback: (stage: Stage, deltaTime: number) => void) {
    if (this.tickCallbacks.indexOf(callback) < 0 && typeof callback === 'function') {
      this.tickCallbacks.push(callback)
    }
  }

  // Tick controlling.
  // ==================================
  private rafID: number = null
  private lastTime: number = 0

  /**
   * Delta time in seconds since last frame.
   * Use this to make game speed independent of frame rate.
   */
  deltaTime: number = 0

  /**
   * Target frame rate (used for calculating time scale).
   * 60 FPS is the baseline.
   */
  private readonly TARGET_FPS = 60

  /**
   * Start to render stage.
   *
   * @private
   * @memberof Stage
   */
  start () {
    this.lastTime = performance.now()
    this.tick(this.lastTime)
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
  private tick (currentTime: number) {
    // Calculate delta time in seconds
    const deltaMs = currentTime - this.lastTime
    this.deltaTime = deltaMs / 1000
    this.lastTime = currentTime

    // Clamp deltaTime to prevent huge jumps (e.g., when tab is inactive)
    if (this.deltaTime > 0.1) {
      this.deltaTime = 0.1
    }

    // Poll gamepad state every frame
    this.gamepad.poll()

    this.clearStage()
    this.execTickCallback()
    this.rafID = requestAnimationFrame(this.tick.bind(this))
  }

  constructor (canvasElement: HTMLCanvasElement, option?: IStageOption) {
    // Canvas Element & Context.
    this.$canvasElement = canvasElement
    this.$context = canvasElement.getContext('2d')

    // Set scale if provided.
    if (typeof option === 'object' && typeof option.scale === 'number') {
      this._scale = option.scale
    }

    // Initial resize to fit window.
    this.resize()

    // Set font style.
    this.$context.font = '8px kenpixel'

    // Set options.
    if (typeof option === 'object') {
      !option.enableSmooth && this.disableSmoothing()
    }

    // Register Key Events.
    this.registerKeyboardEvents()

    // Register Resize Events.
    this.registerResizeEvent()
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
