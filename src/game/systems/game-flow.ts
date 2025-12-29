import { Stage } from '../../core/stage'
import { spaceBackground } from '../background'
import { DEFAULT_LEVEL, DEFAULT_SCORE } from '../config'
import { GameState } from '../state'
import { effectSystem } from './effect'
import { enemySystem } from './enemy'
import { enemyProjectileSystem } from './enemy-projectile'
import { initSystem } from './init'
import { playerSystem } from './player'
import { specialItemSystem } from './special-item'
import { ISystem } from './types'
import { uiSystem } from './ui'
import { waveSystem } from './wave'
import { weaponSystem } from './weapon'

class GameFlowSystem implements ISystem {
  detectGameOver () {
    const allPlayers = playerSystem.allPlayers
    const deadPlayer = allPlayers.filter(item => item && item.isDead)
    if (deadPlayer.length === allPlayers.length && allPlayers.length > 0) {
      GameState.gameOver = true
    }
  }

  waitRestart (stage: Stage) {
    if (stage.input.start) {
      this.restartGame(stage)
    }
  }

  restartGame (stage: Stage) {
    GameState.reset()
    enemySystem.reset()
    waveSystem.reset()
    weaponSystem.reset()
    specialItemSystem.reset()
    effectSystem.reset()
    playerSystem.reset(stage)
  }

  gameInWaiting (stage: Stage) {
    initSystem.update(stage, 0) // Ensure size is updated
    spaceBackground.draw(stage.context, stage.camera.x, stage.camera.y)
    uiSystem.printGameOver(stage)
    this.waitRestart(stage)
  }

  update (stage: Stage, deltaTime: number) {
    if (GameState.gameOver) {
      this.gameInWaiting(stage)
      return
    }

    this.detectGameOver()
  }
}

const gameFlowSystem = new GameFlowSystem()

export {
  gameFlowSystem
}
