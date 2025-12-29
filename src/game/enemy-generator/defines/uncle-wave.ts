import { Stage } from '../../../core/stage'
import { ChaseBehavior } from '../../behaviors/defines/chase.ts'
import { EnemyBase, TheUncle } from '../../sprites/enemy'
import { IEnemyGenConfig, IEnemyGenStrategy } from '../type.ts'

/**
 * Boss 波次策略
 */
class UncleWaveStrategy implements IEnemyGenStrategy {
  readonly name = 'UncleWave'

  enabled: boolean = true

  readonly config: IEnemyGenConfig = {
    enemyCount: 1,
    spacing: 0,
    speed: 30,
    interval: 60,
    enemyType: TheUncle
  }

  execute (stage: Stage): EnemyBase[] {
    const enemies: EnemyBase[] = []
    const camera = stage.camera
    const bounds = camera.getWorldBounds()
    const stageSize = stage.logicalSize

    const { speed } = this.config

    const uncle = new TheUncle()
    uncle.x = bounds.left + stageSize[0] / 2 - uncle.width / 2
    uncle.y = bounds.top - uncle.height - 20
    uncle.setBehavior(new ChaseBehavior({ speed }))
    enemies.push(uncle)

    return enemies
  }

  constructor (config: {
    interval: number
    speed: number
  }) {
    this.config.interval = config.interval
    this.config.speed = config.speed
  }
}

export {
  UncleWaveStrategy
}
