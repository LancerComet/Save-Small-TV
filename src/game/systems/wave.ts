import { Stage } from '../../core/stage'
import { enemyGenerator } from '../enemy-generator'
import { Enemy } from '../sprites/enemy'
import { WeaponBase } from '../sprites/weapon/defines/_base'
import { Laser } from '../sprites/weapon/defines/laser'
import { GameState } from '../state'
import { checkSpriteCollision } from '../utils/collision'
import { effectSystem } from './effect'
import { playerSystem } from './player'
import { specialItemSystem } from './special-item'
import { ISystem } from './types'

class WaveSystem implements ISystem {
  /**
   * 检测波次敌人与玩家的碰撞
   */
  detectPlayer (enemy: Enemy) {
    if (enemy.isDead) return

    for (const player of playerSystem.allPlayers) {
      if (!player || player.isDead) continue

      // 使用统一碰撞检测工具
      if (checkSpriteCollision(enemy, player)) {
        player.takeDamage(enemy.attack)
        return
      }
    }
  }

  /**
   * 检测武器与波次敌人的碰撞
   * @param isLaser 是否为激光武器（可穿透）
   */
  checkWeaponHit (weapon: WeaponBase, isLaser: boolean = false): boolean {
    let hitAny = false

    for (let i = enemyGenerator.waveEnemies.length - 1; i >= 0; i--) {
      const enemy = enemyGenerator.waveEnemies[i]
      if (!enemy || enemy.isDead) continue

      // 激光穿透逻辑
      if (isLaser) {
        const laser = weapon as Laser
        if (!laser.canHitEnemy(enemy)) continue
      }

      // 使用统一碰撞检测工具
      if (checkSpriteCollision(weapon, enemy)) {
        // 激光记录命中
        if (isLaser) {
          (weapon as Laser).recordHit(enemy)
        }

        enemy.hp -= weapon.attack

        // 出血效果
        effectSystem.spawnBlood(weapon.x, weapon.y, 6)

        if (enemy.isDead) {
          // 触发死亡能力（如爆炸碎片）- 投射物会自动收集到 Enemy.deathProjectiles
          if (!enemy.hasTriggeredDeathAbilities) {
            enemy.triggerDeathAbilities(playerSystem.instance)
          }

          // 爆炸效果（精英敌人更大）
          effectSystem.spawnExplosion(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            enemy.isElite ? 50 : 12
          )

          // 使用敌人自身的属性决定分数和掉落
          GameState.score += enemy.scoreValue

          // 根据敌人的 dropCount 掉落道具
          for (let d = 0; d < enemy.dropCount; d++) {
            specialItemSystem.dropItem(enemy.x + d * 10, enemy.y + d * 10)
          }

          enemyGenerator.waveEnemies.splice(i, 1)
        }

        hitAny = true

        // 非激光武器命中后立即返回
        if (!isLaser) {
          return true
        }
      }
    }
    return hitAny
  }

  update (stage: Stage, deltaTime: number) {
    const player = playerSystem.instance
    if (!player) return

    // 更新波次计时器
    enemyGenerator.update(stage, player, deltaTime)

    // 更新和绘制冲锋敌人（传入 player 以支持 Boss 追踪和能力更新）
    enemyGenerator.tickEnemies(stage, player, deltaTime)

    // 检测与玩家碰撞
    for (const enemy of enemyGenerator.waveEnemies) {
      this.detectPlayer(enemy)
    }
  }

  reset () {
    enemyGenerator.reset()
  }
}

const waveSystem = new WaveSystem()

export {
  waveSystem
}
