import { Stage } from '../../core/stage'
import { EnemyBase } from '../sprites/enemy'
import { SmallTV } from '../sprites/player'

/**
 * 波次策略配置
 */
interface IEnemyGenConfig {
  /** 敌人数量 */
  enemyCount: number

  /** 触发间隔（秒） */
  interval: number

  /** 敌人间距 */
  spacing: number

  /** 移动速度 */
  speed: number

  /** 敌人类型 */
  enemyType: new () => EnemyBase
}

/**
 * 波次策略接口
 */
interface IEnemyGenStrategy {
  name: string
  enabled: boolean
  config: IEnemyGenConfig
  execute (stage: Stage, player: SmallTV): EnemyBase[]
}

export type {
  IEnemyGenStrategy,
  IEnemyGenConfig
}
