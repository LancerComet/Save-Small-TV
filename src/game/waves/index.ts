/**
 * Wave Manager - 波次管理器
 * 管理所有敌人波次策略的触发和执行
 */

import { Stage } from '../../core/stage'
import { Enemy, Sprite22 } from '../sprites/enemy'
import { SmallTV } from '../sprites/player'
import { IWaveStrategy } from './base'
import { HorizontalRushStrategy } from './defines/horizontal-rush'
import { VerticalRushStrategy } from './defines/vertical-rush'

interface StrategyState {
  strategy: IWaveStrategy
  countdown: number
}

/**
 * 波次管理器
 */
class WaveManager {
  /** 所有策略及其状态 */
  private strategies: StrategyState[] = []

  /** 波次敌人列表 */
  waveEnemies: Enemy[] = []

  constructor () {
    this.initStrategies()
  }

  /**
   * 初始化默认策略
   */
  private initStrategies () {
    this.addStrategy(new HorizontalRushStrategy({
      interval: 15,
      enemyCount: 3,
      spacing: 15,
      speed: 1,
      fromLeft: true,
      EnemyType: Sprite22
    }))

    this.addStrategy(new HorizontalRushStrategy({
      interval: 30,
      enemyCount: 5,
      spacing: 25,
      speed: 1.5
    }))

    this.addStrategy(new VerticalRushStrategy({
      interval: 60,
      enemyCount: 3,
      spacing: 20,
      speed: 1.5
    }))
  }

  /**
   * 添加策略
   */
  addStrategy (strategy: IWaveStrategy) {
    this.strategies.push({
      strategy,
      countdown: strategy.interval
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
    if (!player || player.isDead) return

    for (const state of this.strategies) {
      if (!state.strategy.enabled) continue

      state.countdown -= deltaTime

      if (state.countdown <= 0) {
        // 触发策略
        const enemies = state.strategy.execute(stage, player)
        this.waveEnemies.push(...enemies)

        // 重置计时器
        state.countdown = state.strategy.interval
      }
    }
  }

  /**
   * 更新并绘制所有波次敌人
   */
  tickEnemies (stage: Stage, deltaTime: number) {
    const camera = stage.camera
    const bounds = camera.getWorldBounds()
    const buffer = 100 // 超出屏幕多远后删除

    for (let i = this.waveEnemies.length - 1; i >= 0; i--) {
      const enemy = this.waveEnemies[i]
      if (!enemy) continue

      // 通过行为系统移动（波次敌人不需要追踪目标）
      enemy.move(null, deltaTime)

      // 检查是否超出屏幕范围
      if (enemy.x < bounds.left - buffer ||
          enemy.x > bounds.right + buffer ||
          enemy.y < bounds.top - buffer ||
          enemy.y > bounds.bottom + buffer) {
        this.waveEnemies.splice(i, 1)
        continue
      }

      // 检查是否死亡
      if (enemy.isDead) {
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
    }
  }

  /**
   * 重置
   */
  reset () {
    this.waveEnemies = []
    for (const state of this.strategies) {
      state.countdown = state.strategy.interval
    }
  }
}

// 单例
const waveManager = new WaveManager()

export {
  WaveManager,
  waveManager,
  HorizontalRushStrategy,
  VerticalRushStrategy
}
