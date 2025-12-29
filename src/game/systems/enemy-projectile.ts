import { Stage } from '../../core/stage'
import { enemyGenerator } from '../enemy-generator'
import { IProjectile } from '../projectile/types'
import { EnemyBase } from '../sprites/enemy'
import { checkPointCollision } from '../utils/collision'
import { enemySystem } from './enemy'
import { playerSystem } from './player'
import { ISystem } from './types'

class EnemyProjectileSystem implements ISystem {
  projectiles: IProjectile[] = []

  /**
   * 收集新产生的投射物
   */
  collectProjectiles () {
    // 收集普通敌人的投射物
    for (const enemy of enemySystem.enemies) {
      const newProjectiles = enemy.collectProjectiles()
      this.projectiles.push(...newProjectiles)
    }

    // 收集波次敌人的投射物（包括 Boss）
    for (const enemy of enemyGenerator.waveEnemies) {
      const newProjectiles = enemy.collectProjectiles()
      this.projectiles.push(...newProjectiles)
    }

    // 收集来自 Enemy 静态队列的投射物（主要是死亡时产生的）
    if (EnemyBase.deathProjectiles.length > 0) {
      this.projectiles.push(...EnemyBase.deathProjectiles)
      EnemyBase.deathProjectiles = []
    }
  }

  /**
   * 添加投射物
   */
  addProjectile (projectile: IProjectile) {
    this.projectiles.push(projectile)
  }

  update (stage: Stage, deltaTime: number) {
    this.collectProjectiles()

    const ctx = stage.context
    const bounds = stage.camera.getWorldBounds()
    const buffer = 50
    const worldWidth = bounds.right - bounds.left + buffer * 2
    const worldHeight = bounds.bottom - bounds.top + buffer * 2

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i]

      // 更新位置
      proj.update(deltaTime)

      // 检查生命周期是否结束（追踪弹等有 lifetime）
      const lifetimeExpired = 'lifetime' in proj && (proj as any).lifetime <= 0

      // 先调用投射物自己的 isOutOfBounds 方法（回旋镖返回后需要用这个删除）
      const projOutOfBounds = proj.isOutOfBounds(worldWidth, worldHeight)

      // 使用世界边界判断出界，而不是屏幕尺寸
      const outOfBounds = (
        proj.x < bounds.left - buffer ||
        proj.x > bounds.right + buffer ||
        proj.y < bounds.top - buffer ||
        proj.y > bounds.bottom + buffer
      )

      if (outOfBounds || lifetimeExpired || projOutOfBounds) {
        this.projectiles.splice(i, 1)
        continue
      }

      // 绘制
      ctx.save()
      const [screenX, screenY] = stage.camera.toScreen(proj.x, proj.y)
      ctx.translate(screenX - proj.x, screenY - proj.y)
      proj.draw(ctx)
      ctx.restore()

      // 检测与玩家碰撞
      for (const player of playerSystem.allPlayers) {
        if (!player || player.isDead) continue

        // 使用统一碰撞检测工具（点-矩形碰撞）
        if (checkPointCollision(proj.x, proj.y, player)) {
          player.takeDamage(proj.damage)
          this.projectiles.splice(i, 1)
          break
        }
      }
    }
  }

  reset () {
    this.projectiles = []
    EnemyBase.deathProjectiles = []
  }
}

const enemyProjectileSystem = new EnemyProjectileSystem()

export {
  enemyProjectileSystem
}
