/**
 * Boss Wave Strategy - Boss 波次策略
 * 每60秒生成一个 Boss
 */

import { Stage } from '../../../core/stage'
import { ChaseBehavior } from '../../behaviors'
import { Enemy, UncleEnemy } from '../../sprites/enemy'
import { SmallTV } from '../../sprites/player'
import { WaveStrategy, IWaveConfig } from '../base'

interface IBossWaveConfig extends IWaveConfig {
  /** Boss 类型 */
  BossType?: new () => Enemy
}

/**
 * Boss 波次策略
 */
class BossWaveStrategy extends WaveStrategy {
  name = 'BossWave'

  protected config: IBossWaveConfig = {
    enemyCount: 1,
    spacing: 0,
    speed: 30,
    interval: 60, // 60 秒
    BossType: UncleEnemy
  }

  constructor (config?: Partial<IBossWaveConfig>) {
    super()
    if (config) {
      this.config = { ...this.config, ...config }
      this.interval = this.config.interval
    }
  }

  execute (stage: Stage, player: SmallTV): Enemy[] {
    const enemies: Enemy[] = []
    const camera = stage.camera
    const bounds = camera.getWorldBounds()
    const stageSize = stage.logicalSize

    const { BossType, speed } = this.config
    const BossClass = BossType || UncleEnemy

    // 从屏幕上方中间生成
    const boss = new BossClass()
    boss.x = bounds.left + stageSize[0] / 2 - boss.width / 2
    boss.y = bounds.top - boss.height - 20

    // 设置追踪行为
    boss.setBehavior(new ChaseBehavior({ speed }))

    enemies.push(boss)

    return enemies
  }
}

export {
  BossWaveStrategy
}

export type {
  IBossWaveConfig
}
