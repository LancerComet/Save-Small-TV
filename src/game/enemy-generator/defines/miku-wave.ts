import { Stage } from '../../../core/stage'
import { ChaseBehavior } from '../../behaviors/defines/chase.ts'
import { EnemyBase, MikuEnemy } from '../../sprites/enemy'
import { IEnemyGenConfig, IEnemyGenStrategy } from '../type.ts'

/**
 * 初音未来波次策略
 * 每隔一段时间生成一个初音未来
 */
class MikuWaveStrategy implements IEnemyGenStrategy {
  readonly name = 'MikuWave'

  enabled: boolean = true

  readonly config: IEnemyGenConfig = {
    enemyCount: 1,
    spacing: 0,
    speed: 40,
    interval: 10,
    enemyType: MikuEnemy
  }

  execute (stage: Stage): EnemyBase[] {
    const enemies: EnemyBase[] = []
    const camera = stage.camera
    const bounds = camera.getWorldBounds()

    const { speed } = this.config

    const miku = new MikuEnemy()

    // 随机从四个方向之一出现
    const side = Math.floor(Math.random() * 4)
    const stageWidth = bounds.right - bounds.left
    const stageHeight = bounds.bottom - bounds.top

    switch (side) {
      case 0: // 上
        miku.x = bounds.left + Math.random() * stageWidth
        miku.y = bounds.top - miku.height - 10
        break
      case 1: // 下
        miku.x = bounds.left + Math.random() * stageWidth
        miku.y = bounds.bottom + 10
        break
      case 2: // 左
        miku.x = bounds.left - miku.width - 10
        miku.y = bounds.top + Math.random() * stageHeight
        break
      case 3: // 右
        miku.x = bounds.right + 10
        miku.y = bounds.top + Math.random() * stageHeight
        break
    }

    miku.setBehavior(new ChaseBehavior({ speed }))
    enemies.push(miku)

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
  MikuWaveStrategy
}
