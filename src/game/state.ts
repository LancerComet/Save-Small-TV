import { DEFAULT_LEVEL, DEFAULT_SCORE } from './config'

/**
 * Experience required for each player level.
 * Uses a simple formula: baseXP * level^exponent
 */
const BASE_XP = 100
const XP_EXPONENT = 1.5

function getXPForLevel (level: number): number {
  return Math.floor(BASE_XP * Math.pow(level, XP_EXPONENT))
}

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
   * Current difficulty level (enemy scaling).
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

  // ==========================================
  // Player Progression System (Roguelike)
  // ==========================================

  /**
   * Player's current level.
   */
  static playerLevel: number = 1

  /**
   * Player's current experience points.
   */
  static playerXP: number = 0

  /**
   * Experience needed to reach next level.
   */
  static get xpToNextLevel (): number {
    return getXPForLevel(this.playerLevel)
  }

  /**
   * Progress towards next level (0-1).
   */
  static get levelProgress (): number {
    return this.playerXP / this.xpToNextLevel
  }

  /**
   * Number of pending level-ups (upgrades to choose).
   */
  static pendingLevelUps: number = 0

  /**
   * Add experience points and check for level up.
   * Returns true if leveled up.
   */
  static addXP (amount: number): boolean {
    this.playerXP += amount

    let leveledUp = false
    while (this.playerXP >= this.xpToNextLevel) {
      this.playerXP -= this.xpToNextLevel
      this.playerLevel++
      this.pendingLevelUps++
      leveledUp = true

      // 触发升级时护盾效果 - 记录次数，由 player system 处理
      this.pendingLevelUpShields++
    }

    return leveledUp
  }

  /**
   * Pending shields to grant on level up (consumed by player system)
   */
  static pendingLevelUpShields: number = 0

  /**
   * Consume one pending level-up (after player chooses upgrade).
   */
  static consumeLevelUp (): void {
    if (this.pendingLevelUps > 0) {
      this.pendingLevelUps--
    }
  }

  /**
   * Reset all states to default.
   * Call this when restarting the game.
   */
  static reset () {
    this.score = DEFAULT_SCORE
    this.level = DEFAULT_LEVEL
    this.gameOver = false
    this.gameTime = 0

    // Reset progression
    this.playerLevel = 1
    this.playerXP = 0
    this.pendingLevelUps = 0
    this.pendingLevelUpShields = 0
  }
}

export {
  GameState,
  getXPForLevel
}
