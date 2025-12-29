import { Stage } from '../../core/stage'
import { enemyGenerator } from '../enemy-generator'
import { Enemy } from '../sprites/enemy'
import { SmallTV } from '../sprites/player'
import { GEN_WEAPON_INTERVAL } from '../sprites/weapon/config'
import { WeaponBase } from '../sprites/weapon/defines/_base'
import { Laser } from '../sprites/weapon/defines/laser'
import { PowerBullet } from '../sprites/weapon/defines/power-bullet'
import { Shotgun, ShotgunPellet } from '../sprites/weapon/defines/shotgun'
import { SRAW_FIRE_INTERVAL, SRAW_MISSILE_COUNT, SRAWMissile } from '../sprites/weapon/defines/sraw'
import { WeaponType, IWeapon } from '../sprites/weapon/types'
import { enemySystem } from './enemy'
import { playerSystem } from './player'
import { ISystem } from './types'
import { waveSystem } from './wave'

class WeaponSystem implements ISystem {
  generateWeaponTimer = GEN_WEAPON_INTERVAL
  srawFireTimer = 0 // SRAW 发射计时器

  resetSrawTimer () {
    this.srawFireTimer = 0
  }

  /**
   * 获取最近的敌人列表
   */
  getNearestEnemies (x: number, y: number, count: number): Enemy[] {
    // 收集所有敌人
    const allEnemies: Enemy[] = [
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
    // 更新通用武器生成计时器
    if (this.generateWeaponTimer > 0) {
      this.generateWeaponTimer -= deltaTime
    }

    const players = playerSystem.allPlayers
    for (let i = 0, length = players.length; i < length; i++) {
      const player = players[i]
      if (!player) { continue }

      // SRAW 自动发射（不需要按攻击键，使用独立计时器）
      if (player.currentWeaponType === WeaponType.SRAW) {
        this.srawFireTimer -= deltaTime
        if (this.srawFireTimer <= 0) {
          this.createSRAWMissiles(player)
          this.srawFireTimer = SRAW_FIRE_INTERVAL
        }
        continue // SRAW 不需要其他武器逻辑
      }

      // 其他武器需要等待通用计时器
      if (this.generateWeaponTimer > 0) { continue }

      // 其他武器需要玩家按攻击键
      if (!player.attacking) { continue }

      // Handle different weapon types
      if (player.currentWeaponType === WeaponType.SHOTGUN) {
        // Shotgun creates multiple pellets
        const pellets = Shotgun.createPellets({
          direction: player.weaponDirection,
          x: player.x,
          y: player.y
        }, player.useAnalogShooting ? player.shootAngle : undefined)
        player.weapons.push(...pellets)
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

        player.weapons.push(laser)
      } else {
        // Normal or Power bullet
        const CurrentWeapon = player.currentWeaponClass
        const weapon: WeaponBase = new CurrentWeapon(<IWeapon> {
          direction: player.weaponDirection,
          x: player.x,
          y: player.y
        })

        // 如果是无极方向射击，设置角度
        if (player.useAnalogShooting && player.shootAngle !== null) {
          weapon.setAngle(player.shootAngle)
        }

        player.weapons.push(weapon)
      }
    }

    // 只有在计时器归零时才重置（表示本帧创建了武器）
    if (this.generateWeaponTimer <= 0) {
      this.generateWeaponTimer = GEN_WEAPON_INTERVAL
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

        // 检查是否为激光武器（可穿透）
        const isLaser = weapon instanceof Laser

        // 先检测波次敌人
        const waveHit = waveSystem.checkWeaponHit(weapon, isLaser)
        if (waveHit && !isLaser) {
          weapons.splice(j, 1)
          weaponDestroyed = true
        }

        // 再检测普通敌人
        if (!weaponDestroyed || isLaser) {
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
    this.generateWeaponTimer = GEN_WEAPON_INTERVAL
    this.srawFireTimer = 0
  }
}

const weaponSystem = new WeaponSystem()

export {
  weaponSystem
}
