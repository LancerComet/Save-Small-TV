import { Stage } from '../../core/stage'
import { spaceBackground } from '../background'
import { playerSystem } from './player'
import { ISystem } from './types'

class InitSystem implements ISystem {
  /**
   * Initialize stage size.
   */
  size (stage: Stage) {
    const [stageWidth, stageHeight] = stage.logicalSize
    // 初始化摄像机视口
    stage.camera.setViewport(stageWidth, stageHeight)
    // 初始化太空背景
    spaceBackground.init(stageWidth, stageHeight)
  }

  /**
   * Initialize player.
   */
  initPlayer (stage: Stage) {
    playerSystem.reset(stage)
  }

  update (stage: Stage, deltaTime: number) {
    // Always update size (for window resize support).
    this.size(stage)

    // Init player.
    !playerSystem.instance && this.initPlayer(stage)
  }
}

const initSystem = new InitSystem()

export {
  initSystem
}
