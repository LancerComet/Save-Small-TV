import { SpriteDirection } from '../../core/sprite/types'
import { Stage } from '../../core/stage'
import { enemyGenerator } from '../enemy-generator'
import { EnemyBase } from '../sprites/enemy'
import { SmallTV } from '../sprites/player'
import { GEN_WEAPON_INTERVAL } from '../sprites/weapon/config'
import { Laser } from '../sprites/weapon/defines/laser'
import { PowerBullet } from '../sprites/weapon/defines/power-bullet'
import { ShotgunPellet } from '../sprites/weapon/defines/shotgun'
import { SRAW_FIRE_INTERVAL, SRAW_MISSILE_COUNT, SRAWMissile } from '../sprites/weapon/defines/sraw'
import { WeaponType, IWeapon } from '../sprites/weapon/types'
import { WeaponBase } from '../sprites/weapon/weapon-base.ts'
import { enemySystem } from './enemy'
import { playerSystem } from './player'
import { ISystem } from './types'
import { waveSystem } from './wave'

class WeaponSystem implements ISystem {
  // 每个玩家独立的武器生成计时器 (通过 player 对象的 weaponCountdown)
  srawFireTimer = 0 // SRAW 发射计时器

  resetSrawTimer () {
    this.srawFireTimer = 0
  }

  /**
   * 根据方向获取角度（弧度）
   */
  getAngleFromDirection (direction: SpriteDirection): number {
    switch (direction) {
      case 'R': return 0
      case 'B': return Math.PI / 2
      case 'L': return Math.PI
      case 'T': return -Math.PI / 2
      default: return 0
    }
  }

  /**
   * 获取相反方向
   */
  getOppositeDirection (direction: SpriteDirection): SpriteDirection {
    switch (direction) {
      case 'L': return 'R'
      case 'R': return 'L'
      case 'T': return 'B'
      case 'B': return 'T'
      default: return 'L'
    }
  }

  /**
   * 获取最近的敌人列表
   */
  getNearestEnemies (x: number, y: number, count: number): EnemyBase[] {
    // 收集所有敌人
    const allEnemies: EnemyBase[] = [
      ...enemySystem.enemies,
      ...enemyGenerator.waveEnemies
    ].filter(e => e && !e.isDead)

    // 按距离排序
    allEnemies.sort((a, b) => {
      const distA = Math.hypot(a.x - x, a.y - y)
      const distB = Math.hypot(b.x - x, b.y - y)
      return distA - distB
    })

    // 返回最近的 count 个
    return allEnemies.slice(0, count)
  }

  /**
   * 创建 SRAW 导弹
   */
  createSRAWMissiles (player: SmallTV) {
    const nearestEnemies = this.getNearestEnemies(player.x, player.y, SRAW_MISSILE_COUNT)

    for (let i = 0; i < SRAW_MISSILE_COUNT; i++) {
      const missile = new SRAWMissile({
        x: player.x,
        y: player.y,
        direction: player.weaponDirection
      })

      // 给每个导弹分配一个目标
      if (nearestEnemies[i]) {
        missile.setTarget(nearestEnemies[i])
      } else if (nearestEnemies.length > 0) {
        // 如果敌人不够，循环分配
        missile.setTarget(nearestEnemies[i % nearestEnemies.length])
      }

      // 给导弹一个初始发射角度分散效果
      const spreadAngle = ((i - (SRAW_MISSILE_COUNT - 1) / 2) * 0.3) // 每个导弹偏移一定角度
      missile.setAngle((missile.angle || 0) + spreadAngle)

      player.weapons.push(missile)
    }
  }

  createWeapon (deltaTime: number) {
    const players = playerSystem.allPlayers
    for (let i = 0, length = players.length; i < length; i++) {
      const player = players[i]
      if (!player) { continue }

      // 更新玩家的武器冷却计时器
      if (player.weaponCountdown > 0) {
        player.weaponCountdown -= deltaTime
      }

      // SRAW 自动发射（不需要按攻击键，使用独立计时器）
      if (player.currentWeaponType === WeaponType.SRAW) {
        this.srawFireTimer -= deltaTime
        if (this.srawFireTimer <= 0) {
          this.createSRAWMissiles(player)
          this.srawFireTimer = player.getEffectiveFireRate(SRAW_FIRE_INTERVAL)
        }
        continue // SRAW 不需要其他武器逻辑
      }

      // 其他武器需要等待冷却
      if (player.weaponCountdown > 0) { continue }

      // 其他武器需要玩家按攻击键
      if (!player.attacking) { continue }

      // 计算有效射速间隔
      const effectiveInterval = player.getEffectiveFireRate(GEN_WEAPON_INTERVAL)

      // Handle different weapon types
      if (player.currentWeaponType === WeaponType.SHOTGUN) {
        // Shotgun creates multiple pellets
        const pellets = ShotgunPellet.createPellets({
          direction: player.weaponDirection,
          x: player.x,
          y: player.y
        }, player.useAnalogShooting ? player.shootAngle : undefined)

        // 应用伤害加成
        for (const pellet of pellets) {
          pellet.attack = player.getEffectiveDamage(pellet.attack)
        }

        player.weapons.push(...pellets)

        // 后射散弹
        if (player.hasRearShot) {
          const rearPellets = ShotgunPellet.createPellets({
            direction: this.getOppositeDirection(player.weaponDirection),
            x: player.x,
            y: player.y
          }, player.useAnalogShooting && player.shootAngle !== null
            ? player.shootAngle + Math.PI  // 反向角度
            : undefined)

          // 应用伤害加成（后射减少50%伤害）
          for (const pellet of rearPellets) {
            pellet.attack = player.getEffectiveDamage(pellet.attack) * 0.5
          }

          player.weapons.push(...rearPellets)
        }
      } else if (player.currentWeaponType === WeaponType.LASER) {
        // Laser weapon
        const laser = new Laser(<IWeapon> {
          direction: player.weaponDirection,
          x: player.x,
          y: player.y
        })

        // 如果是无极方向射击，设置角度
        if (player.useAnalogShooting && player.shootAngle !== null) {
          laser.setAngle(player.shootAngle)
        }

        // 应用伤害加成
        laser.attack = player.getEffectiveDamage(laser.attack)

        player.weapons.push(laser)

        // 后射激光
        if (player.hasRearShot) {
          const rearLaser = new Laser(<IWeapon> {
            direction: this.getOppositeDirection(player.weaponDirection),
            x: player.x,
            y: player.y
          })

          // 如果是无极方向射击，设置反向角度
          if (player.useAnalogShooting && player.shootAngle !== null) {
            rearLaser.setAngle(player.shootAngle + Math.PI)
          }

          // 应用伤害加成（后射减少50%伤害）
          rearLaser.attack = player.getEffectiveDamage(rearLaser.attack) * 0.5

          player.weapons.push(rearLaser)
        }
      } else {
        // Normal or Power bullet
        const CurrentWeapon = player.currentWeaponClass

        // 计算需要创建多少发子弹
        let bulletCount = 1
        if (player.hasTripleShot) {
          bulletCount = 3
        } else if (player.hasDoubleShot) {
          bulletCount = 2
        }

        // 创建主要子弹
        for (let b = 0; b < bulletCount; b++) {
          const weapon: WeaponBase = new CurrentWeapon(<IWeapon> {
            direction: player.weaponDirection,
            x: player.x,
            y: player.y
          })

          // 计算子弹散布角度
          let angleOffset = 0
          if (bulletCount === 2) {
            angleOffset = (b === 0 ? -0.15 : 0.15) // ±0.15 弧度 ≈ ±8.6度
          } else if (bulletCount === 3) {
            angleOffset = (b - 1) * 0.15 // -0.15, 0, 0.15
          }

          // 如果是无极方向射击，设置角度
          if (player.useAnalogShooting && player.shootAngle !== null) {
            weapon.setAngle(player.shootAngle + angleOffset)
          } else if (angleOffset !== 0) {
            // 根据方向计算基础角度
            const baseAngle = this.getAngleFromDirection(player.weaponDirection)
            weapon.setAngle(baseAngle + angleOffset)
          }

          // 应用伤害加成
          weapon.attack = player.getEffectiveDamage(weapon.attack)

          player.weapons.push(weapon)
        }

        // 后射子弹
        if (player.hasRearShot) {
          const rearWeapon: WeaponBase = new CurrentWeapon(<IWeapon> {
            direction: this.getOppositeDirection(player.weaponDirection),
            x: player.x,
            y: player.y
          })

          // 应用伤害加成（后射减少50%伤害）
          rearWeapon.attack = player.getEffectiveDamage(rearWeapon.attack) * 0.5

          player.weapons.push(rearWeapon)
        }
      }

      // 重置该玩家的武器冷却
      player.weaponCountdown = effectiveInterval
    }
  }

  tickWeapon (stage: Stage, deltaTime: number) {
    const players = playerSystem.allPlayers
    for (let i = 0, playerLength = players.length; i < playerLength; i++) {
      const player = players[i]
      if (!player) { continue }

      // Also tick weapon duration when not attacking
      player.tickWeaponDuration(deltaTime)
      // Tick invincible timer
      player.tickInvincible(deltaTime)

      const weapons = player.weapons
      const weaponLength = weapons.length
      if (!weaponLength) { continue }

      for (let j = weaponLength - 1; j >= 0; j--) {
        const weapon = weapons[j]
        if (!weapon) { continue }

        // Move weapon - speed is pixels per second
        const speed = weapon.speed * deltaTime
        const direction = weapon.direction

        // SRAW 导弹使用追踪逻辑
        if (weapon instanceof SRAWMissile) {
          weapon.updateTracking(deltaTime)
          weapon.moveByAngle(speed)
        } else if (weapon.useAngleMovement) {
          // 如果武器使用角度移动（无极方向射击）
          weapon.moveByAngle(speed)
        } else if (weapon instanceof ShotgunPellet) {
          // 散弹使用角度移动
          weapon.move(speed)
        } else {
          // 四方向移动
          if (direction === 'L') { weapon.x -= speed }
          if (direction === 'R') { weapon.x += speed }
          if (direction === 'T') { weapon.y -= speed }
          if (direction === 'B') { weapon.y += speed }
        }

        // Check range limit for special weapons
        const weaponWithRange = weapon as (PowerBullet | ShotgunPellet | Laser | SRAWMissile)
        if (weaponWithRange.isOutOfRange && weaponWithRange.isOutOfRange()) {
          weapons.splice(j, 1)
          continue
        }

        // If weapon hits some enemy.
        let weaponDestroyed = false

        // 检查是否为激光武器（可穿透）或玩家有穿透能力
        const isLaser = weapon instanceof Laser
        const canPierce = isLaser || player.hasPiercing

        // 先检测波次敌人
        const waveHit = waveSystem.checkWeaponHit(weapon, isLaser)
        if (waveHit && !canPierce) {
          weapons.splice(j, 1)
          weaponDestroyed = true
        }

        // 再检测普通敌人
        if (!weaponDestroyed || canPierce) {
          const enemies = enemySystem.enemies
          for (let k = 0, enemyLength = enemies.length; k < enemyLength; k++) {
            const enemy = enemies[k]

            // 激光使用特殊穿透逻辑
            if (isLaser) {
              const laser = weapon as Laser
              if (laser.canHitEnemy(enemy) && enemySystem.checkWeaponHitEnemy(weapon, enemy)) {
                laser.recordHit(enemy)
                // 激光不会被销毁，继续检测其他敌人
              }
            } else if (canPierce) {
              // 穿透武器：命中但不销毁
              if (enemySystem.checkWeaponHitEnemy(weapon, enemy)) {
                // 穿透后继续，不销毁武器
              }
            } else {
              // 普通武器
              if (enemySystem.checkWeaponHitEnemy(weapon, enemy)) {
                weapons.splice(j, 1)
                weaponDestroyed = true
                break
              }
            }
          }
        }

        // 激光穿透完所有目标后检查是否应该消失
        if (isLaser) {
          const laser = weapon as Laser
          if (laser.isOutOfRange()) {
            weapons.splice(j, 1)
            weaponDestroyed = true
          }
        }

        if (weaponDestroyed) { continue }

        // If weapon moves out of camera view, destroy it.
        if (!stage.camera.isVisible(weapon.x, weapon.y, weapon.width, weapon.height)) {
          weapons.splice(j, 1)
          continue
        }

        weapon.updateTexture() // Update texture animation
        const [screenX, screenY] = stage.camera.toScreen(weapon.x, weapon.y)
        stage.context.drawImage(
          weapon.offscreen.canvasElement, screenX, screenY
        )
      }
    }
  }

  update (stage: Stage, deltaTime: number) {
    this.createWeapon(deltaTime)
    this.tickWeapon(stage, deltaTime)
  }

  reset () {
    this.srawFireTimer = 0
  }
}

const weaponSystem = new WeaponSystem()

export {
  weaponSystem
}
