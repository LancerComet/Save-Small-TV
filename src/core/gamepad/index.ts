/**
 * Gamepad Controller Module.
 * Handles gamepad input using the Web Gamepad API.
 *
 * Standard Gamepad Layout:
 * - Left Stick: axes[0] (X), axes[1] (Y) - Movement
 * - Right Stick: axes[2] (X), axes[3] (Y) - Shooting direction
 * - Buttons: A(0), B(1), X(2), Y(3), Start(9), etc.
 */

// Deadzone threshold for analog sticks
const STICK_DEADZONE = 0.3

/**
 * Gamepad input state interface.
 */
interface IGamepadState {
  // Left stick (movement)
  leftStickX: number
  leftStickY: number
  // Right stick (shooting)
  rightStickX: number
  rightStickY: number
  // Buttons
  buttonA: boolean      // Button 0
  buttonB: boolean      // Button 1
  buttonX: boolean      // Button 2
  buttonY: boolean      // Button 3
  buttonStart: boolean  // Button 9
  buttonSelect: boolean // Button 8
  // D-Pad (as alternative movement)
  dpadUp: boolean       // Button 12
  dpadDown: boolean     // Button 13
  dpadLeft: boolean     // Button 14
  dpadRight: boolean    // Button 15
}

/**
 * GamepadController class.
 * Manages gamepad connections and input polling.
 */
class GamepadController {
  private connected: boolean = false
  private gamepadIndex: number = -1

  /**
   * Current gamepad state.
   */
  state: IGamepadState = {
    leftStickX: 0,
    leftStickY: 0,
    rightStickX: 0,
    rightStickY: 0,
    buttonA: false,
    buttonB: false,
    buttonX: false,
    buttonY: false,
    buttonStart: false,
    buttonSelect: false,
    dpadUp: false,
    dpadDown: false,
    dpadLeft: false,
    dpadRight: false
  }

  constructor () {
    this.registerEvents()
  }

  /**
   * Register gamepad connection events.
   */
  private registerEvents () {
    window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
      console.log(`🎮 Gamepad connected: ${e.gamepad.id}`)
      this.connected = true
      this.gamepadIndex = e.gamepad.index
    })

    window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => {
      console.log(`🎮 Gamepad disconnected: ${e.gamepad.id}`)
      if (e.gamepad.index === this.gamepadIndex) {
        this.connected = false
        this.gamepadIndex = -1
        this.resetState()
      }
    })
  }

  /**
   * Reset all gamepad state to default.
   */
  private resetState () {
    this.state.leftStickX = 0
    this.state.leftStickY = 0
    this.state.rightStickX = 0
    this.state.rightStickY = 0
    this.state.buttonA = false
    this.state.buttonB = false
    this.state.buttonX = false
    this.state.buttonY = false
    this.state.buttonStart = false
    this.state.buttonSelect = false
    this.state.dpadUp = false
    this.state.dpadDown = false
    this.state.dpadLeft = false
    this.state.dpadRight = false
  }

  /**
   * Apply deadzone to stick value.
   */
  private applyDeadzone (value: number): number {
    if (Math.abs(value) < STICK_DEADZONE) {
      return 0
    }
    // Normalize the value outside deadzone
    const sign = value > 0 ? 1 : -1
    return sign * (Math.abs(value) - STICK_DEADZONE) / (1 - STICK_DEADZONE)
  }

  /**
   * Poll gamepad state.
   * Must be called every frame to get fresh input.
   */
  poll () {
    if (!this.connected) {
      // Try to find any connected gamepad
      const gamepads = navigator.getGamepads()
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          this.connected = true
          this.gamepadIndex = i
          console.log(`🎮 Gamepad found: ${gamepads[i].id}`)
          break
        }
      }
      if (!this.connected) return
    }

    const gamepad = navigator.getGamepads()[this.gamepadIndex]
    if (!gamepad) {
      this.connected = false
      this.gamepadIndex = -1
      this.resetState()
      return
    }

    // Read analog sticks with deadzone
    // Left stick: axes 0, 1
    this.state.leftStickX = this.applyDeadzone(gamepad.axes[0] || 0)
    this.state.leftStickY = this.applyDeadzone(gamepad.axes[1] || 0)

    // Right stick: axes 2, 3 (or axes 3, 4 on some controllers)
    // Standard mapping uses axes 2, 3
    this.state.rightStickX = this.applyDeadzone(gamepad.axes[2] || 0)
    this.state.rightStickY = this.applyDeadzone(gamepad.axes[3] || 0)

    // Read buttons
    this.state.buttonA = gamepad.buttons[0]?.pressed || false
    this.state.buttonB = gamepad.buttons[1]?.pressed || false
    this.state.buttonX = gamepad.buttons[2]?.pressed || false
    this.state.buttonY = gamepad.buttons[3]?.pressed || false
    this.state.buttonStart = gamepad.buttons[9]?.pressed || false
    this.state.buttonSelect = gamepad.buttons[8]?.pressed || false

    // D-Pad
    this.state.dpadUp = gamepad.buttons[12]?.pressed || false
    this.state.dpadDown = gamepad.buttons[13]?.pressed || false
    this.state.dpadLeft = gamepad.buttons[14]?.pressed || false
    this.state.dpadRight = gamepad.buttons[15]?.pressed || false
  }

  /**
   * Check if gamepad is connected.
   */
  isConnected (): boolean {
    return this.connected
  }

  /**
   * Get movement direction from left stick (or D-Pad).
   * Returns normalized direction for WASD-style movement.
   */
  getMovement (): { x: number, y: number } {
    let x = this.state.leftStickX
    let y = this.state.leftStickY

    // D-Pad as fallback/alternative
    if (this.state.dpadLeft) x = -1
    if (this.state.dpadRight) x = 1
    if (this.state.dpadUp) y = -1
    if (this.state.dpadDown) y = 1

    return { x, y }
  }

  /**
   * Get shooting direction from right stick.
   * Returns the direction if stick is pushed past threshold.
   */
  getShootDirection (): { up: boolean, down: boolean, left: boolean, right: boolean } {
    const threshold = 0.5
    return {
      up: this.state.rightStickY < -threshold,
      down: this.state.rightStickY > threshold,
      left: this.state.rightStickX < -threshold,
      right: this.state.rightStickX > threshold
    }
  }
}

export {
  GamepadController
}

export type {
  IGamepadState
}
