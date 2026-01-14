import { Stage } from '../../core/stage'
import {
  ENERMY_BASE_COUNT,
  ENERMY_INCREMENT_RATIO,
  GEN_ENEMY_INTERVAL,
  ENEMIES_PER_SPAWN,
  SCORE_PER_LEVEL
} from '../config'
import { EnemyBase, Sprite22, Sprite33 } from '../sprites/enemy'
import { IkunEnemy } from '../sprites/enemy/defines/ikun'
import { ITEM_DROP_CHANCE } from '../sprites/special-items/config'
import { WeaponBase } from '../sprites/weapon/weapon-base.ts'
import { GameState } from '../state'
import { checkSpriteCollision } from '../utils/collision'
import { floor, rand } from '../utils/math'
import { effectSystem } from './effect'
import { enemyProjectileSystem } from './enemy-projectile'
import { playerSystem } from './player'
import { specialItemSystem } from './special-item'
import { ISystem } from './types'

class EnemySystem implements ISystem {
  enemies: EnemyBase[] = []
  genEnemyCountdown = GEN_ENEMY_INTERVAL

  private getRandomNormalEnemy () {
    const ENEMY_TYPES = [
      Sprite22,
      Sprite33,
      IkunEnemy
    ]
    return ENEMY_TYPES[floor(rand() * ENEMY_TYPES.length)]
  }

  /**
   * Generate enemies.
   */
  genNormalEnemies (stage: Stage, deltaTime: number) {
    const enemies = this.enemies

    const maxEnemies = Math.floor(ENERMY_BASE_COUNT + GameState.level * ENERMY_INCREMENT_RATIO)
    if (enemies.length >= maxEnemies) {
      return
    }

    if (this.genEnemyCountdown > 0) {
      this.genEnemyCountdown -= deltaTime
      return
    }

    // 一次生成多个敌人，直到达到上限
    const toSpawn = Math.min(ENEMIES_PER_SPAWN, maxEnemies - enemies.length)
    for (let i = 0; i < toSpawn; i++) {
      const EnemyType = this.getRandomNormalEnemy()
      const enemy = new EnemyType()

      const startPosition = this.createStartPosition(stage)
      enemy.x = startPosition[0]
      enemy.y = startPosition[1]

      enemies.push(enemy)
    }

    this.genEnemyCountdown = GEN_ENEMY_INTERVAL
  }

  /**
   * Create enemy start position relative to camera viewport.
   * Enemies spawn just outside the visible area.
   */
  createStartPosition (stage: Stage) {
    const camera = stage.camera
    const bounds = camera.getWorldBounds()
    const spawnOffset = 30 // 在视口外多远生成
    const [stageWidth, stageHeight] = stage.logicalSize

    // 随机选择从哪个方向生成（上、下、左、右）
    const side = floor(rand(4))
    let x: number, y: number

    switch (side) {
      case 0: // 上方
        x = bounds.left + rand(stageWidth)
        y = bounds.top - spawnOffset
        break
      case 1: // 下方
        x = bounds.left + rand(stageWidth)
        y = bounds.bottom + spawnOffset
        break
      case 2: // 左侧
        x = bounds.left - spawnOffset
        y = bounds.top + rand(stageHeight)
        break
      case 3: // 右侧
      default:
        x = bounds.right + spawnOffset
        y = bounds.top + rand(stageHeight)
        break
    }

    return [x, y]
  }

  /**
   * Detect player distance.
   */
  detectPlayer (enemy: EnemyBase) {
    // 死亡的敌人不会伤害玩家
    if (enemy.isDead) { return }

    const allPlayers = playerSystem.allPlayers
    for (let i = 0, length = allPlayers.length; i < length; i++) {
      const player = allPlayers[i]
      if (!player) { continue }

      // 使用统一碰撞检测工具
      if (checkSpriteCollision(enemy, player)) {
        player.takeDamage(enemy.attack)
      }
    }
  }

  /**
   * Auto move single enemy.
   */
  autoMove (enemy: EnemyBase, deltaTime: number) {
    const player = playerSystem.instance

    if (enemy.isDead) {
      // 触发死亡能力（如爆炸）- 投射物会自动收集到 Enemy.deathProjectiles
      if (!enemy.hasTriggeredDeathAbilities) {
        enemy.triggerDeathAbilities(player)
      }

      // 生成爆炸效果（只在刚死亡时触发一次）
      if (!enemy.hasSpawnedBlood) {
        effectSystem.spawnExplosion(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          20 // 爆炸粒子数量
        )
        enemy.hasSpawnedBlood = true
      }

      if (enemy.destroyCountdown > 0) {
        enemy.destroyCountdown -= deltaTime
      } else {
        // 敌人死亡时随机掉落道具
        if (!enemy.hasDroppedItem && rand() < ITEM_DROP_CHANCE) {
          specialItemSystem.dropItem(enemy.x, enemy.y)
          enemy.hasDroppedItem = true
        }

        // 增加分数 (使用敌人自身的分数值)
        GameState.score += enemy.scoreValue

        // 增加经验值 (使用敌人自身的经验值 * 玩家经验倍率)
        const xpGain = enemy.xpValue * (playerSystem.instance?.xpMultiplier || 1)
        GameState.addXP(xpGain)

        // 检查是否升级 (difficulty level, not player level)
        const newLevel = Math.floor(GameState.score / SCORE_PER_LEVEL) + 1
        if (newLevel > GameState.level) {
          GameState.level = newLevel
        }

        this.enemies.splice(
          this.enemies.indexOf(enemy), 1
        )
      }
      return
    }

    // 更新敌人能力
    enemy.updateAbilities(player, deltaTime)

    // 敌人通过行为系统移动（追踪玩家）
    if (!player) { return }

    enemy.move(player, deltaTime)
  }

  /**
   * Draw single enemy.
   */
  private drawSingle (stage: Stage, enemy: EnemyBase) {
    enemy.updateTexture() // Update texture animation
    const [screenX, screenY] = stage.camera.toScreen(enemy.x, enemy.y)
    stage.context.drawImage(
      enemy.offscreen.canvasElement,
      screenX,
      screenY
    )
  }

  /**
   * Draw all enemies without updating logic.
   * Used when game is paused to show frozen state.
   */
  draw (stage: Stage) {
    for (const enemy of this.enemies) {
      if (!enemy) continue
      this.drawSingle(stage, enemy)
    }
  }

  update (stage: Stage, deltaTime: number) {
    this.genNormalEnemies(stage, deltaTime)

    for (let i = 0, length = this.enemies.length; i < length; i++) {
      const enemy = this.enemies[i]
      if (!enemy) { continue }
      this.detectPlayer(enemy)
      this.autoMove(enemy, deltaTime)
      this.drawSingle(stage, enemy)
    }
  }

  /**
   * 检测武器与敌人的碰撞（公共方法）
   * 用于 Waves 和 Weapons 的碰撞检测
   */
  checkWeaponHitEnemy (weapon: WeaponBase, enemy: EnemyBase): boolean {
    if (!enemy || enemy.isDead) return false

    if (checkSpriteCollision(weapon, enemy)) {
      const damage = weapon.attack
      enemy.hp -= damage

      // 被打中时出血效果
      effectSystem.spawnBlood(weapon.x, weapon.y, 6)

      // 吸血效果：恢复造成伤害的 5%
      const player = playerSystem.instance
      if (player && player.hasLifesteal) {
        const healAmount = damage * 0.05
        player.hp = Math.min(player.maxHp, player.hp + healAmount)
      }

      if (enemy.isDead) {
        // 触发死亡能力 - 投射物会自动收集到 Enemy.deathProjectiles
        if (!enemy.hasTriggeredDeathAbilities) {
          enemy.triggerDeathAbilities(playerSystem.instance)
        }

        // 爆炸效果
        effectSystem.spawnExplosion(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          20
        )
        enemy.hasSpawnedBlood = true

        // 击杀爆炸效果：对周围敌人造成伤害
        if (player && player.hasExplosionOnKill) {
          this.triggerExplosionDamage(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 50, damage * 0.3)
        }
      }

      return true
    }

    return false
  }

  /**
   * 击杀爆炸效果：对范围内敌人造成伤害
   */
  triggerExplosionDamage (x: number, y: number, radius: number, damage: number) {
    // 爆炸效果
    effectSystem.spawnExplosion(x, y, radius)

    // 对范围内敌人造成伤害
    for (const enemy of this.enemies) {
      if (!enemy || enemy.isDead) continue

      const enemyCenterX = enemy.x + enemy.width / 2
      const enemyCenterY = enemy.y + enemy.height / 2
      const distance = Math.hypot(enemyCenterX - x, enemyCenterY - y)

      if (distance <= radius) {
        enemy.hp -= damage
        effectSystem.spawnBlood(enemyCenterX, enemyCenterY, 4)
      }
    }
  }

  reset () {
    this.enemies = []
    this.genEnemyCountdown = GEN_ENEMY_INTERVAL
    enemyProjectileSystem.reset()
  }
}

const enemySystem = new EnemySystem()

export {
  enemySystem
}
