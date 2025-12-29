import { Stage } from '../../core/stage'
import { EnemyBase, Sprite22 } from '../sprites/enemy'
import { SmallTV } from '../sprites/player'
import { HorizontalRushStrategy } from './defines/horizontal-rush'
import { MikuWaveStrategy } from './defines/miku-wave.ts'
import { UncleWaveStrategy } from './defines/uncle-wave.ts'
import { VerticalRushStrategy } from './defines/vertical-rush'
import { IEnemyGenStrategy } from './type.ts'

interface IStrategyState {
  strategy: IEnemyGenStrategy
  countdown: number
}

/**
 * 波次管理器.
 * 管理所有敌人波次策略的触发和执行.
 */
class EnemyGenerator {
  /**
   * 所有策略及其状态.
   */
  private strategies: IStrategyState[] = []

  /**
   * 波次敌人列表.
   */
  waveEnemies: EnemyBase[] = []

  /**
   * 添加策略
   */
  addStrategy (strategy: IEnemyGenStrategy) {
    this.strategies.push({
      strategy,
      countdown: strategy.config.interval
    })
  }

  /**
   * 移除策略
   */
  removeStrategy (name: string) {
    this.strategies = this.strategies.filter(s => s.strategy.name !== name)
  }

  /**
   * 启用/禁用策略
   */
  toggleStrategy (name: string, enabled: boolean) {
    const state = this.strategies.find(s => s.strategy.name === name)
    if (state) {
      state.strategy.enabled = enabled
    }
  }

  /**
   * 更新所有策略计时器
   */
  update (stage: Stage, player: SmallTV, deltaTime: number) {
    if (!player || player.isDead) {
      return
    }

    for (const state of this.strategies) {
      if (!state.strategy.enabled) continue

      state.countdown -= deltaTime

      if (state.countdown <= 0) {
        // 触发策略
        const enemies = state.strategy.execute(stage, player)
        this.waveEnemies.push(...enemies)

        // 重置计时器
        state.countdown = state.strategy.config.interval
      }
    }
  }

  /**
   * 更新并绘制所有波次敌人
   */
  tickEnemies (stage: Stage, player: SmallTV | null, deltaTime: number) {
    const camera = stage.camera
    const bounds = camera.getWorldBounds()
    const buffer = 100 // 超出屏幕多远后删除

    for (let i = this.waveEnemies.length - 1; i >= 0; i--) {
      const enemy = this.waveEnemies[i]
      if (!enemy) continue

      // 更新能力（如果有）
      if (enemy.abilities && enemy.abilities.length > 0) {
        enemy.updateAbilities(player, deltaTime)
      }

      // 通过行为系统移动（行为自己决定是否追踪）
      enemy.move(player, deltaTime)

      // 检查是否超出屏幕范围（精英敌人不会因出界被删除）
      if (!enemy.isElite && (
        enemy.x < bounds.left - buffer ||
          enemy.x > bounds.right + buffer ||
          enemy.y < bounds.top - buffer ||
          enemy.y > bounds.bottom + buffer)) {
        this.waveEnemies.splice(i, 1)
        continue
      }

      // 检查是否死亡
      if (enemy.isDead) {
        // 触发死亡能力 - 投射物会自动收集到 Enemy.deathProjectiles
        if (!enemy.hasTriggeredDeathAbilities) {
          enemy.triggerDeathAbilities(player)
        }
        this.waveEnemies.splice(i, 1)
        continue
      }

      // 绘制
      enemy.updateTexture()
      const [screenX, screenY] = camera.toScreen(enemy.x, enemy.y)
      stage.context.drawImage(
        enemy.offscreen.canvasElement,
        screenX,
        screenY
      )

      // 绘制血条（如果敌人有 maxHp）
      if (enemy.showHealthBar && !enemy.isDead) {
        const barWidth = enemy.width
        const barHeight = 3
        const barX = screenX
        const barY = screenY - 6

        // 背景
        stage.context.fillStyle = '#333'
        stage.context.fillRect(barX, barY, barWidth, barHeight)

        // 血量
        const hpRatio = Math.max(0, enemy.hp / enemy.maxHp)
        stage.context.fillStyle = '#ff00ff'
        stage.context.fillRect(barX, barY, barWidth * hpRatio, barHeight)
      }
    }
  }

  reset () {
    this.waveEnemies = []
    for (const state of this.strategies) {
      state.countdown = state.strategy.config.interval
    }
  }

  constructor () {
    this.addStrategy(new HorizontalRushStrategy({
      interval: 15,
      enemyCount: 3,
      spacing: 15,
      speed: 60,
      fromLeft: true,
      enemyType: Sprite22
    }))

    this.addStrategy(new HorizontalRushStrategy({
      interval: 30,
      enemyCount: 5,
      spacing: 25,
      speed: 90
    }))

    this.addStrategy(new VerticalRushStrategy({
      interval: 60,
      enemyCount: 3,
      spacing: 20,
      speed: 90
    }))

    this.addStrategy(new UncleWaveStrategy({
      interval: 60,
      speed: 30
    }))

    // 初音未来 - 每10秒出现一个
    this.addStrategy(new MikuWaveStrategy({
      interval: 10,
      speed: 40
    }))
  }
}

const enemyGenerator = new EnemyGenerator()

export {
  EnemyGenerator,
  enemyGenerator,
  HorizontalRushStrategy,
  VerticalRushStrategy,
  UncleWaveStrategy,
  MikuWaveStrategy
}
