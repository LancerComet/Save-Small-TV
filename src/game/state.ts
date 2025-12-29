import { DEFAULT_LEVEL, DEFAULT_SCORE } from './config'

/**
 * Global Game State Management.
 * Stores runtime data shared across different systems.
 */
class GameState {
  /**
   * Current game score.
   */
  static score: number = DEFAULT_SCORE

  /**
   * Current difficulty level.
   */
  static level: number = DEFAULT_LEVEL

  /**
   * Is game over?
   */
  static gameOver: boolean = false

  /**
   * Elapsed game time in seconds.
   */
  static gameTime: number = 0

  /**
   * Reset all states to default.
   * Call this when restarting the game.
   */
  static reset () {
    this.score = DEFAULT_SCORE
    this.level = DEFAULT_LEVEL
    this.gameOver = false
    this.gameTime = 0
  }
}

export {
  GameState
}
