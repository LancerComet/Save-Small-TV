import { Sprite } from '../../../core/sprite'
import { IAbility, IProjectile } from '../../abilities'
import { IBehavior, ChaseBehavior } from '../../behaviors'

class Enemy extends Sprite {
  /**
   * Wether this sprite is dead.
   *
   * @readonly
   * @type {boolean}
   * @memberof Sprite
   */
  get isDead (): boolean {
    return this.hp <= 0
  }

  /**
   * Countdown before remove this enemy.
   */
  destroyCountdown: number = 0

  /**
   * Whether this enemy has already dropped an item.
   */
  hasDroppedItem: boolean = false

  /**
   * Whether blood effect has been spawned for this enemy.
   */
  hasSpawnedBlood: boolean = false

  /**
   * Whether death abilities have been triggered.
   */
  hasTriggeredDeathAbilities: boolean = false

  /**
   * 敌人的攻击力
   */
  attack: number = 20

  /**
   * 敌人的移动行为
   * 默认为追踪行为（追踪玩家）
   */
  behavior: IBehavior = new ChaseBehavior()

  /**
   * 敌人的能力列表
   */
  abilities: IAbility[] = []

  /**
   * 敌人的最大血量（用于血条显示等）
   * 默认为 0，表示不显示血条
   */
  maxHp: number = 0

  /**
   * 是否显示血条
   */
  get showHealthBar (): boolean {
    return this.maxHp > 0
  }

  /**
   * 是否是精英/Boss 级敌人（不会因出界被删除，死亡有特殊奖励）
   */
  isElite: boolean = false

  /**
   * 击杀获得的分数
   */
  scoreValue: number = 10

  /**
   * 击杀时掉落道具的数量
   */
  dropCount: number = 0

  /**
   * 设置行为
   * @param behavior 新的行为
   */
  setBehavior (behavior: IBehavior): this {
    this.behavior = behavior
    this.behavior.init?.(this)
    return this
  }

  /**
   * 添加能力
   * @param ability 要添加的能力
   */
  addAbility (ability: IAbility): this {
    ability.init?.(this)
    this.abilities.push(ability)
    return this
  }

  /**
   * 移除能力
   * @param name 能力名称
   */
  removeAbility (name: string): this {
    this.abilities = this.abilities.filter(a => a.name !== name)
    return this
  }

  /**
   * 更新所有能力
   * @param target 目标精灵
   * @param deltaTime 时间增量
   */
  updateAbilities (target: Sprite | null, deltaTime: number): void {
    for (const ability of this.abilities) {
      ability.update(this, target, deltaTime)
    }
  }

  /**
   * 触发死亡能力
   * @param target 目标精灵
   */
  triggerDeathAbilities (target: Sprite | null): void {
    if (this.hasTriggeredDeathAbilities) return
    this.hasTriggeredDeathAbilities = true

    for (const ability of this.abilities) {
      ability.onDeath?.(this, target)
    }
  }

  /**
   * 收集所有能力产生的投射物
   */
  collectProjectiles (): IProjectile[] {
    const projectiles: IProjectile[] = []
    for (const ability of this.abilities) {
      projectiles.push(...ability.getProjectiles())
    }
    return projectiles
  }

  /**
   * 根据行为移动
   * @param target 目标精灵（如玩家），可为 null
   * @param deltaTime 时间增量（秒）
   */
  move (target: Sprite | null, deltaTime: number): void {
    this.behavior.update(this, target, deltaTime)
  }
}

export {
  Enemy
}
