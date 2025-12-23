/**
 * Wave Strategy System - Base definitions
 * 敌人波次策略系统基础定义
 */

import { Stage } from '../../core/stage'
import { SmallTV } from '../sprites/sprites.player'
import { Enemy } from '../sprites/sprites.enemy'

/**
 * 敌人类型构造函数
 */
type EnemyConstructor = new () => Enemy

/**
 * 波次策略接口
 */
interface IWaveStrategy {
  /** 策略名称 */
  name: string
  /** 触发间隔（秒） */
  interval: number
  /** 是否启用 */
  enabled: boolean

  /**
   * 执行策略，生成特殊敌人
   * @param stage 舞台
   * @param player 玩家
   * @returns 生成的敌人数组
   */
  execute (stage: Stage, player: SmallTV): Enemy[]
}

/**
 * 波次策略配置
 */
interface IWaveConfig {
  /** 敌人数量 */
  enemyCount: number
  /** 敌人间距 */
  spacing: number
  /** 移动速度 */
  speed: number
  /** 触发间隔（秒） */
  interval: number
  /** 敌人类型（可选，默认使用 FireballEnemy） */
  EnemyType?: EnemyConstructor
}

/**
 * 波次策略基类
 */
abstract class WaveStrategy implements IWaveStrategy {
  name: string = 'BaseStrategy'
  interval: number = 30
  enabled: boolean = true

  protected config: IWaveConfig = {
    enemyCount: 3,
    spacing: 20,
    speed: 4,
    interval: 30
  }

  constructor (config?: Partial<IWaveConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
      this.interval = this.config.interval
    }
  }

  abstract execute (stage: Stage, player: SmallTV): Enemy[]
}

export {
  WaveStrategy
}

export type {
  IWaveStrategy,
  IWaveConfig,
  EnemyConstructor
}
