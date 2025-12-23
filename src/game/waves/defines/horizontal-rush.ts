/**
 * Horizontal Rush Strategy - 水平横冲策略
 * 敌人从屏幕一侧横冲到另一侧，Y轴对准玩家位置
 */

import { Stage } from '../../../core/stage'
import { SmallTV } from '../../sprites/sprites.player'
import { Enemy, FireballEnemy } from '../../sprites/sprites.enemy'
import { FixedBehavior } from '../../behaviors'
import { WaveStrategy, IWaveConfig, EnemyConstructor } from '../base'

interface IHorizontalRushConfig extends IWaveConfig {
  /** 从左侧还是右侧出现 */
  fromLeft: boolean
  /** 敌人类型 */
  EnemyType?: EnemyConstructor
}

/**
 * 水平横冲策略
 */
class HorizontalRushStrategy extends WaveStrategy {
  name = 'HorizontalRush'

  protected config: IHorizontalRushConfig = {
    enemyCount: 3,
    spacing: 25,
    speed: 1.5,
    interval: 30,
    fromLeft: true,
    EnemyType: FireballEnemy
  }

  constructor (config?: Partial<IHorizontalRushConfig>) {
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

    const { enemyCount, spacing, speed, fromLeft, EnemyType } = this.config
    const EnemyClass = EnemyType || FireballEnemy

    // 计算起始位置
    const startX = fromLeft
      ? bounds.left - 50    // 屏幕左侧外
      : bounds.right + 50   // 屏幕右侧外

    // 敌人Y轴居中对齐玩家
    const centerY = player.y + player.height / 2
    const totalHeight = (enemyCount - 1) * spacing
    const startY = centerY - totalHeight / 2

    // 生成敌人
    for (let i = 0; i < enemyCount; i++) {
      const enemy = new EnemyClass()
      enemy.x = startX
      enemy.y = startY + i * spacing

      // 设置水平固定移动行为
      enemy.setBehavior(FixedBehavior.horizontal(fromLeft ? 1 : -1, speed))

      enemies.push(enemy)
    }

    // 下次从另一侧出现
    this.config.fromLeft = !this.config.fromLeft

    return enemies
  }
}

export {
  HorizontalRushStrategy
}

export type {
  IHorizontalRushConfig
}
