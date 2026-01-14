/**
 * Game logic.
 * This will be executed in every single frame.
 */

import { Stage } from '../../core/stage'
import { spaceBackground } from '../background'
import { GameState } from '../state'
import { menuManager } from '../menu'
// Import upgrade module to register upgrades
import '../upgrade'
// Import menu module to register menus
import '../menu'
import {
  initSystem,
  playerSystem,
  enemySystem,
  enemyProjectileSystem,
  waveSystem,
  weaponSystem,
  specialItemSystem,
  effectSystem,
  uiSystem,
  gameFlowSystem
} from '../systems'

/**
 * Game ticking function.
 * All logic will be executed in here.
 *
 * @param {Stage} stage
 * @param {number} deltaTime - Time elapsed since last frame in seconds
 */
function tick (stage: Stage, deltaTime: number) {
  // If game is over, delegate to game flow system to handle "Game Over" screen
  if (GameState.gameOver) {
    gameFlowSystem.update(stage, deltaTime)
    return
  }

  // Check for pending level-ups - show upgrade menu
  if (GameState.pendingLevelUps > 0 && !menuManager.isPaused) {
    menuManager.open('upgrade-menu')
  }

  // Check for pause input
  if (stage.input.esc && !menuManager.isPaused) {
    menuManager.open('pause-menu')
  }

  // If menu is open, only update menu (game is paused)
  if (menuManager.isPaused) {
    // Still draw the game in background
    initSystem.update(stage, deltaTime)
    spaceBackground.draw(stage.context, stage.camera.x, stage.camera.y)
    enemySystem.draw(stage) // Just draw, don't update
    playerSystem.draw(stage)
    uiSystem.update(stage, 0) // Draw UI but don't update time

    // Update and draw menu on top
    menuManager.update(stage, deltaTime)
    menuManager.draw(stage)
    return
  }

  // Initialize stage size and player if needed
  initSystem.update(stage, deltaTime)

  // Update game time
  GameState.gameTime += deltaTime

  // Draw space background first (with parallax)
  spaceBackground.update()
  spaceBackground.draw(stage.context, stage.camera.x, stage.camera.y)

  // Update all game systems
  // Order matters for rendering layering (painters algorithm)

  // 1. Enemies and Waves (Bottom layer)
  enemySystem.update(stage, deltaTime)
  waveSystem.update(stage, deltaTime)

  // 2. Projectiles and Effects
  enemyProjectileSystem.update(stage, deltaTime)
  effectSystem.update(stage, deltaTime)

  // 3. Items
  specialItemSystem.update(stage, deltaTime)

  // 4. Player
  playerSystem.update(stage, deltaTime)

  // 5. Player Weapons
  weaponSystem.update(stage, deltaTime)

  // 6. UI (Top layer)
  uiSystem.update(stage, deltaTime)

  // 7. Check Game Flow (Game Over detection)
  gameFlowSystem.update(stage, deltaTime)
}

export {
  tick
}
