import { Stage } from '../../core/stage'
import { spaceBackground } from '../background'
import { GameState } from '../state'
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
