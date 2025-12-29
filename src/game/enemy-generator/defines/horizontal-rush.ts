/**
 * Horizontal Rush Strategy - 水平横冲策略
 * 敌人从屏幕一侧横冲到另一侧，Y轴对准玩家位置
 */

import { Stage } from '../../../core/stage'
import { FixedBehavior } from '../../behaviors/defines/fixed.ts'
import { EnemyBase, FireballEnemy } from '../../sprites/enemy'
import { SmallTV } from '../../sprites/player'
import { IEnemyGenConfig, IEnemyGenStrategy } from '../type.ts'

interface IHorizontalRushConfig extends IEnemyGenConfig {
}

/**
 * 水平横冲策略
 */
class HorizontalRushStrategy implements IEnemyGenStrategy {
  private fromLeft: boolean = true

  readonly name = 'HorizontalRush'
  readonly config: IHorizontalRushConfig = {
    enemyCount: 3,
    spacing: 25,
    speed: 90,
    interval: 30,
    enemyType: FireballEnemy
  }

  enabled: boolean = true

  execute (stage: Stage, player: SmallTV): EnemyBase[] {
    const enemies: EnemyBase[] = []
    const camera = stage.camera
    const bounds = camera.getWorldBounds()

    const { enemyCount, spacing, speed, enemyType } = this.config
    const EnemyClass = enemyType || FireballEnemy

    // 计算起始位置
    const startX = this.fromLeft
      ? bounds.left - 50 // 屏幕左侧外
      : bounds.right + 50 // 屏幕右侧外

    // 敌人 Y 轴居中对齐玩家
    const centerY = player.y + player.height / 2
    const totalHeight = (enemyCount - 1) * spacing
    const startY = centerY - totalHeight / 2

    // 生成敌人
    for (let i = 0; i < enemyCount; i++) {
      const enemy = new EnemyClass()
      enemy.x = startX
      enemy.y = startY + i * spacing

      // 波次敌人击杀分数更高
      enemy.scoreValue = 20

      // 设置水平固定移动行为
      enemy.setBehavior(FixedBehavior.createHorizontalBehavior(this.fromLeft ? 1 : -1, speed))

      enemies.push(enemy)
    }

    // 下次从另一侧出现
    this.fromLeft = !this.fromLeft

    return enemies
  }

  constructor (config: Partial<{
    interval: number
    enemyCount: number
    spacing: number
    speed: number
    fromLeft: boolean
    enemyType: new () => EnemyBase
  }>) {
    this.config.interval = config.interval
    this.config.enemyCount = config.enemyCount
    this.config.spacing = config.spacing
    this.config.speed = config.speed

    if (config.enemyType) {
      this.config.enemyType = config.enemyType
    }

    if (typeof config.fromLeft === 'boolean') {
      this.fromLeft = config.fromLeft
    }
  }
}

export {
  HorizontalRushStrategy
}

export type {
  IHorizontalRushConfig
}
