import { Stage } from '../../../core/stage'
import { FixedBehavior } from '../../behaviors/defines/fixed.ts'
import { EnemyBase, FireballEnemy } from '../../sprites/enemy'
import { SmallTV } from '../../sprites/player'
import { IEnemyGenConfig, IEnemyGenStrategy } from '../type.ts'

/**
 * 垂直冲锋策略.
 * 敌人从屏幕上方或下方冲向玩家 X 轴位置.
 */

class VerticalRushStrategy implements IEnemyGenStrategy {
  private fromTop: boolean = true

  readonly name = 'VerticalRush'
  readonly config: IEnemyGenConfig = {
    enemyCount: 5,
    spacing: 20,
    speed: 90,
    interval: 60,
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
    const startY = this.fromTop
      ? bounds.top - 50 // 屏幕上方外
      : bounds.bottom + 50 // 屏幕下方外

    // 敌人 X 轴居中对齐玩家
    const centerX = player.x + player.width / 2
    const totalWidth = (enemyCount - 1) * spacing
    const startX = centerX - totalWidth / 2

    // 生成敌人
    for (let i = 0; i < enemyCount; i++) {
      const enemy = new EnemyClass()
      enemy.x = startX + i * spacing
      enemy.y = startY

      // 波次敌人击杀分数更高
      enemy.scoreValue = 20

      // 设置垂直固定移动行为
      enemy.setBehavior(FixedBehavior.createVerticalBehavior(this.fromTop ? 1 : -1, speed))

      enemies.push(enemy)
    }

    // 下次从另一侧出现
    this.fromTop = !this.fromTop

    return enemies
  }

  constructor (config: Partial<{
    interval: number
    enemyCount: number
    spacing: number
    speed: number
  }>) {
    this.config.interval = config.interval
    this.config.enemyCount = config.enemyCount
    this.config.spacing = config.spacing
    this.config.speed = config.speed
  }
}

export {
  VerticalRushStrategy
}
