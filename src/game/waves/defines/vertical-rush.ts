/**
 * Vertical Rush Strategy - 垂直冲锋策略
 * 敌人从屏幕上方或下方冲向玩家X轴位置
 */

import { Stage } from '../../../core/stage'
import { FixedBehavior } from '../../behaviors'
import { Enemy, FireballEnemy } from '../../sprites/enemy'
import { SmallTV } from '../../sprites/player'
import { WaveStrategy, IWaveConfig, EnemyConstructor } from '../base'

interface IVerticalRushConfig extends IWaveConfig {
  fromTop: boolean
  EnemyType?: EnemyConstructor
}

/**
 * 垂直冲锋策略
 */
class VerticalRushStrategy extends WaveStrategy {
  name = 'VerticalRush'

  protected config: IVerticalRushConfig = {
    enemyCount: 5,
    spacing: 20,
    speed: 1.5,
    interval: 60,
    fromTop: true,
    EnemyType: FireballEnemy
  }

  constructor (config?: Partial<IVerticalRushConfig>) {
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

    const { enemyCount, spacing, speed, fromTop, EnemyType } = this.config
    const EnemyClass = EnemyType || FireballEnemy

    // 计算起始位置
    const startY = fromTop
      ? bounds.top - 50 // 屏幕上方外
      : bounds.bottom + 50 // 屏幕下方外

    // 敌人X轴居中对齐玩家
    const centerX = player.x + player.width / 2
    const totalWidth = (enemyCount - 1) * spacing
    const startX = centerX - totalWidth / 2

    // 生成敌人
    for (let i = 0; i < enemyCount; i++) {
      const enemy = new EnemyClass()
      enemy.x = startX + i * spacing
      enemy.y = startY

      // 设置垂直固定移动行为
      enemy.setBehavior(FixedBehavior.vertical(fromTop ? 1 : -1, speed))

      enemies.push(enemy)
    }

    // 下次从另一侧出现
    this.config.fromTop = !this.config.fromTop

    return enemies
  }
}

export {
  VerticalRushStrategy
}

export type {
  IVerticalRushConfig
}
