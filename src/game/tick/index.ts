/**
 * Game logic.
 * This will be executed in every single frame.
 */

import { Stage } from '../../core/stage'

import { spaceBackground } from '../background'
import { ENERMY_BASE_COUNT, ENERMY_INCREMENT_RATIO } from '../config'
import { BloodEffect, BloodParticle, ExplosionEffect, ExplosionParticle } from '../sprites/effects'
import { Enemy, getRandomEnemy } from '../sprites/enemy'
import { SmallTV } from '../sprites/player'
import { SpecialItemBase } from '../sprites/special-items/defines/_base.ts'
import { PowerBulletItem } from '../sprites/special-items/defines/power-bullet.ts'
import { ShotgunItem } from '../sprites/special-items/defines/shotgun.ts'
import { SpecialItemType } from '../sprites/special-items/types.ts'
import { getRandomItem } from '../sprites/special-items/utils.ts'
import { WeaponBase } from '../sprites/weapon/defines/_base.ts'
import { Bullet } from '../sprites/weapon/defines/bullet.ts'
import { PowerBullet } from '../sprites/weapon/defines/power-bullet.ts'
import { Shotgun, ShotgunPellet } from '../sprites/weapon/defines/shotgun.ts'
import { IWeapon, WeaponType } from '../sprites/weapon/types.ts'
import { floor, rand } from '../utils'
import { waveManager } from '../waves'

// Time constants (in seconds)
const MAX_SPECIAL_ITEMS = 5
const GEN_ENEMY_INTERVAL = 0.5 // seconds - 更快生成
const ENEMIES_PER_SPAWN = 3 // 每次生成敌人数量
const GEN_WEAPON_INTERVAL = 0.083 // ~5 frames at 60fps = 5/60 seconds
const ITEM_DROP_CHANCE = 0.3 // 30% chance to drop item
const WEAPON_DURATION = 10 // seconds

// Speed multiplier for 60fps baseline
const BASE_FPS = 60

const DEFAULT_LEVEL = 1
const DEFAULT_SCORE = 0
const SCORE_PER_LEVEL = 100 // 每100分升一级

let score = DEFAULT_SCORE
let level = DEFAULT_LEVEL
let gameOver = false

let stageWidth: number = null
let stageHeight: number = null

/**
 * Game ticking function.
 * All logic will be executed in here.
 *
 * @param {Stage} stage
 * @param {number} deltaTime - Time elapsed since last frame in seconds
 */
function tick (stage: Stage, deltaTime: number) {
  if (gameOver) {
    return Game.$gameInWaiting(stage)
  }

  Init.$tick(stage)

  // Draw space background first (with parallax)
  spaceBackground.update()
  spaceBackground.draw(stage.context, stage.camera.x, stage.camera.y)

  Enemys.$tick(stage, deltaTime)
  Waves.$tick(stage, deltaTime) // 波次系统
  Effects.$tick(stage, deltaTime)
  SpecialItems.$tick(stage, deltaTime)
  Player.$tick(stage, deltaTime)
  Weapons.$tick(stage, deltaTime)
  UI.$tick(stage)
  Game.$tick()
}

export {
  tick
}

/**
 * Initialization.
 *
 * @class Init
 */
class Init {
  /**
   * Initialize stage size.
   *
   * @static
   * @param {Stage} stage
   * @memberof Init
   */
  static size (stage: Stage) {
    const stageSize = stage.logicalSize
    stageWidth = stageSize[0]
    stageHeight = stageSize[1]
    // 初始化摄像机视口
    stage.camera.setViewport(stageWidth, stageHeight)
    // 初始化太空背景
    spaceBackground.init(stageWidth, stageHeight)
  }

  /**
   * Initialize player.
   *
   * @static
   * @memberof Init
   */
  static initPlayer () {
    Player.$reset()
  }

  /**
   * Ticking.
   *
   * @static
   * @param {Stage} stage
   * @memberof Init
   */
  static $tick (stage: Stage) {
    // Init size.
    if (!stageWidth || !stageHeight) {
      Init.size(stage)
    }

    // Init player.
    !Player.instance && Init.initPlayer()
  }
}

/**
 * Enemys.
 *
 * @class Enemy
 */
class Enemys {
  static enemys: Enemy[] = []
  static $genEnemyCountdown = GEN_ENEMY_INTERVAL

  /**
   * Generate enemys.
   *
   * @static
   * @param {Stage} stage
   * @param {number} deltaTime
   * @memberof Enemy
   */
  static genEnemys (stage: Stage, deltaTime: number) {
    const enemys = Enemys.enemys

    const maxEnemies = Math.floor(ENERMY_BASE_COUNT + level * ENERMY_INCREMENT_RATIO)
    if (enemys.length >= maxEnemies) {
      return
    }

    if (Enemys.$genEnemyCountdown > 0) {
      Enemys.$genEnemyCountdown -= deltaTime
      return
    }

    // 一次生成多个敌人，直到达到上限
    const toSpawn = Math.min(ENEMIES_PER_SPAWN, maxEnemies - enemys.length)
    for (let i = 0; i < toSpawn; i++) {
      const EnemyType = getRandomEnemy()
      const enemy = new EnemyType()

      const startPosition = Enemys.createStartPosition(stage)
      enemy.x = startPosition[0]
      enemy.y = startPosition[1]

      enemys.push(enemy)
    }

    Enemys.$genEnemyCountdown = GEN_ENEMY_INTERVAL
  }

  /**
   * Create enemy start position relative to camera viewport.
   * Enemies spawn just outside the visible area.
   *
   * @static
   * @param {Stage} stage
   * @memberof Enemy
   */
  static createStartPosition (stage: Stage) {
    const camera = stage.camera
    const bounds = camera.getWorldBounds()
    const spawnOffset = 30 // 在视口外多远生成

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
   *
   * @static
   * @param {Enemy} enemy
   * @memberof Enemy
   */
  static detectPlayer (enemy: Enemy) {
    // 死亡的敌人不会伤害玩家
    if (enemy.isDead) { return }

    // 敌人的碰撞区域（使用padding缩小）
    const eLeft = enemy.x + enemy.paddingX
    const eTop = enemy.y + enemy.paddingY
    const eRight = enemy.x + enemy.width - enemy.paddingX
    const eBottom = enemy.y + enemy.height - enemy.paddingY

    const allPlayers = Player.allPlayers
    for (let i = 0, length = allPlayers.length; i < length; i++) {
      const player = allPlayers[i]
      // 玩家的碰撞区域（也使用padding缩小）
      const pLeft = player.x + player.paddingX
      const pTop = player.y + player.paddingY
      const pRight = player.x + player.width - player.paddingX
      const pBottom = player.y + player.height - player.paddingY

      // AABB碰撞检测：两个矩形相交
      if (
        eLeft < pRight &&
        eRight > pLeft &&
        eTop < pBottom &&
        eBottom > pTop
      ) {
        player.takeDamage(enemy.attack)
      }
    }
  }

  /**
   * Auto move single enemy.
   *
   * @static
   * @param {Enemy} enemy
   * @param {number} deltaTime
   * @memberof Enemy
   */
  static autoMove (enemy: Enemy, deltaTime: number) {
    if (enemy.isDead) {
      // 生成爆炸效果（只在刚死亡时触发一次）
      if (!enemy.hasSpawnedBlood) {
        Effects.spawnExplosion(
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
          SpecialItems.dropItem(enemy.x, enemy.y)
          enemy.hasDroppedItem = true
        }

        // 增加分数
        score += 10

        // 检查是否升级
        const newLevel = Math.floor(score / SCORE_PER_LEVEL) + 1
        if (newLevel > level) {
          level = newLevel
        }

        Enemys.enemys.splice(
          Enemys.enemys.indexOf(enemy), 1
        )
      }
      return
    }

    // 敌人通过行为系统移动（追踪玩家）
    const player = Player.instance
    if (!player) { return }

    enemy.move(player, deltaTime)
  }

  /**
   * Draw single enemy.
   *
   * @static
   * @param {Stage} stage
   * @param {Enemy} enemy
   * @memberof Enemy
   */
  static draw (stage: Stage, enemy: Enemy) {
    enemy.updateTexture() // Update texture animation
    const [screenX, screenY] = stage.camera.toScreen(enemy.x, enemy.y)
    stage.context.drawImage(
      enemy.offscreen.canvasElement,
      screenX,
      screenY
    )
  }

  /**
   * Ticking.
   *
   * @static
   * @param {Stage} stage
   * @param {number} deltaTime
   * @memberof Enemy
   */
  static $tick (stage: Stage, deltaTime: number) {
    Enemys.genEnemys(stage, deltaTime)

    for (let i = 0, length = Enemys.enemys.length; i < length; i++) {
      const enemy = Enemys.enemys[i]
      if (!enemy) { continue }
      Enemys.detectPlayer(enemy)
      Enemys.autoMove(enemy, deltaTime)
      Enemys.draw(stage, enemy)
    }
  }

  /**
   * Data resetting function.
   *
   * @static
   * @memberof Enemy
   */
  static $reset () {
    Enemys.enemys = []
    Enemys.$genEnemyCountdown = GEN_ENEMY_INTERVAL
  }
}

/**
 * Wave System - 波次系统
 * 管理特殊敌人波次
 *
 * @class Waves
 */
class Waves {
  /**
   * 检测波次敌人与玩家的碰撞
   */
  static detectPlayer (enemy: Enemy) {
    if (enemy.isDead) return

    const eLeft = enemy.x + enemy.paddingX
    const eTop = enemy.y + enemy.paddingY
    const eRight = enemy.x + enemy.width - enemy.paddingX
    const eBottom = enemy.y + enemy.height - enemy.paddingY

    for (const player of Player.allPlayers) {
      if (!player || player.isDead) continue

      const pLeft = player.x + 1
      const pTop = player.y + 2
      const pRight = player.x + player.width - 1
      const pBottom = player.y + player.height - 2

      if (eRight > pLeft && eLeft < pRight && eBottom > pTop && eTop < pBottom) {
        gameOver = true
        return
      }
    }
  }

  /**
   * 检测武器与波次敌人的碰撞
   */
  static checkWeaponHit (weapon: WeaponBase): boolean {
    const weaponPdX = weapon.paddingX
    const weaponPdY = weapon.paddingY

    for (let i = waveManager.waveEnemies.length - 1; i >= 0; i--) {
      const enemy = waveManager.waveEnemies[i]
      if (!enemy || enemy.isDead) continue

      const startX = enemy.x + enemy.paddingX
      const startY = enemy.y + enemy.paddingY
      const endX = enemy.x + enemy.width - enemy.paddingX
      const endY = enemy.y + enemy.height - enemy.paddingY

      if (
        (weapon.x + weaponPdX >= startX && weapon.x - weaponPdX <= endX) &&
        (weapon.y + weaponPdY >= startY && weapon.y - weaponPdY <= endY)
      ) {
        enemy.hp -= weapon.attack

        // 出血效果
        Effects.spawnBlood(weapon.x, weapon.y, 6)

        if (enemy.isDead) {
          // 爆炸效果
          Effects.spawnExplosion(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            12
          )
          score += 20 // 波次敌人分数更高
          waveManager.waveEnemies.splice(i, 1)
        }

        return true // 武器命中
      }
    }
    return false
  }

  static $tick (stage: Stage, deltaTime: number) {
    const player = Player.instance
    if (!player) return

    // 更新波次计时器
    waveManager.update(stage, player, deltaTime)

    // 更新和绘制冲锋敌人
    waveManager.tickEnemies(stage, deltaTime)

    // 检测与玩家碰撞
    for (const enemy of waveManager.waveEnemies) {
      Waves.detectPlayer(enemy)
    }
  }

  static $reset () {
    waveManager.reset()
  }
}

/**
 * Visual Effects management.
 *
 * @class Effects
 */
class Effects {
  static bloodParticles: BloodParticle[] = []

  /**
   * Spawn blood particles at position.
   *
   * @static
   * @param {number} x
   * @param {number} y
   * @param {number} count
   * @memberof Effects
   */
  static spawnBlood (x: number, y: number, count: number = 8) {
    const particles = BloodEffect.create(x, y, count, 3)
    Effects.bloodParticles.push(...particles)
  }

  /**
   * Explosion particles.
   */
  static explosionParticles: ExplosionParticle[] = []

  /**
   * Spawn explosion particles at position.
   *
   * @static
   * @param {number} x
   * @param {number} y
   * @param {number} count
   * @memberof Effects
   */
  static spawnExplosion (x: number, y: number, count: number = 16) {
    const particles = ExplosionEffect.create(x, y, count, 3)
    Effects.explosionParticles.push(...particles)
  }

  /**
   * Update and draw all particles.
   *
   * @static
   * @param {Stage} stage
   * @param {number} deltaTime
   * @memberof Effects
   */
  static $tick (stage: Stage, deltaTime: number) {
    const ctx = stage.context

    // 处理血液粒子
    for (let i = Effects.bloodParticles.length - 1; i >= 0; i--) {
      const particle = Effects.bloodParticles[i]
      if (!particle) { continue }

      particle.update(deltaTime)

      if (particle.isDead) {
        Effects.bloodParticles.splice(i, 1)
        continue
      }

      const [screenX, screenY] = stage.camera.toScreen(particle.x, particle.y)
      particle.draw(ctx, screenX, screenY)
    }

    // 处理爆炸粒子
    for (let i = Effects.explosionParticles.length - 1; i >= 0; i--) {
      const particle = Effects.explosionParticles[i]
      if (!particle) { continue }

      particle.update(deltaTime)

      if (particle.isDead) {
        Effects.explosionParticles.splice(i, 1)
        continue
      }

      const [screenX, screenY] = stage.camera.toScreen(particle.x, particle.y)
      particle.draw(ctx, screenX, screenY)
    }
  }

  /**
   * Data resetting function.
   *
   * @static
   * @memberof Effects
   */
  static $reset () {
    Effects.bloodParticles = []
    Effects.explosionParticles = []
  }
}

/**
 * Special Items management.
 *
 * @class SpecialItems
 */
class SpecialItems {
  static items: SpecialItemBase[] = []

  /**
   * Drop an item at specified position.
   *
   * @static
   * @param {number} x
   * @param {number} y
   * @memberof SpecialItems
   */
  static dropItem (x: number, y: number) {
    if (SpecialItems.items.length >= MAX_SPECIAL_ITEMS) { return }

    const item = getRandomItem()
    item.x = x
    item.y = y
    SpecialItems.items.push(item)
  }

  /**
   * Check if player picks up an item.
   *
   * @static
   * @param {SpecialItemBase} item
   * @memberof SpecialItems
   */
  static detectPickup (item: SpecialItemBase) {
    if (item.isPickedUp) { return }

    const startX = item.x
    const startY = item.y
    const endX = item.x + item.width
    const endY = item.y + item.height

    for (let i = 0, length = Player.allPlayers.length; i < length; i++) {
      const player = Player.allPlayers[i]
      if (!player || player.isDead) { continue }

      const pStartX = player.x
      const pStartY = player.y
      const pEndX = player.x + player.width
      const pEndY = player.y + player.height

      // Simple collision detection
      if (
        ((pStartX >= startX && pStartX <= endX) || (pEndX >= startX && pEndX <= endX) || (startX >= pStartX && startX <= pEndX)) &&
        ((pStartY >= startY && pStartY <= endY) || (pEndY >= startY && pEndY <= endY) || (startY >= pStartY && startY <= pEndY))
      ) {
        item.isPickedUp = true
        SpecialItems.applyItemEffect(player, item)
      }
    }
  }

  /**
   * Apply item effect to player.
   *
   * @static
   * @param {SmallTV} player
   * @param {SpecialItemBase} item
   * @memberof SpecialItems
   */
  static applyItemEffect (player: SmallTV, item: SpecialItemBase) {
    switch (item.itemType) {
      case SpecialItemType.POWER_BULLET:
        player.switchWeapon(WeaponType.POWER_BULLET, WEAPON_DURATION, true)
        break
      case SpecialItemType.SHOTGUN:
        player.switchWeapon(WeaponType.SHOTGUN, WEAPON_DURATION, true)
        break
      default:
        break
    }
  }

  /**
   * Update item lifetime.
   *
   * @static
   * @param {SpecialItemBase} item
   * @param {number} deltaTime
   * @memberof SpecialItems
   */
  static updateLifetime (item: SpecialItemBase, deltaTime: number) {
    if (item.isPickedUp) {
      // Remove picked up items
      SpecialItems.items.splice(SpecialItems.items.indexOf(item), 1)
      return
    }

    item.lifeCountdown -= deltaTime
    if (item.lifeCountdown <= 0) {
      // Remove expired items
      SpecialItems.items.splice(SpecialItems.items.indexOf(item), 1)
    }
  }

  /**
   * Draw item on stage.
   *
   * @static
   * @param {Stage} stage
   * @param {SpecialItemBase} item
   * @memberof SpecialItems
   */
  static draw (stage: Stage, item: SpecialItemBase) {
    item.updateTexture() // Update texture animation
    const [screenX, screenY] = stage.camera.toScreen(item.x, item.y)
    stage.context.drawImage(
      item.offscreen.canvasElement,
      screenX,
      screenY
    )
  }

  /**
   * Ticking.
   *
   * @static
   * @param {Stage} stage
   * @param {number} deltaTime
   * @memberof SpecialItems
   */
  static $tick (stage: Stage, deltaTime: number) {
    for (let i = SpecialItems.items.length - 1; i >= 0; i--) {
      const item = SpecialItems.items[i]
      if (!item) { continue }

      SpecialItems.detectPickup(item)
      SpecialItems.updateLifetime(item, deltaTime)

      // Only draw if item still exists
      if (SpecialItems.items.indexOf(item) >= 0) {
        SpecialItems.draw(stage, item)
      }
    }
  }

  /**
   * Data resetting function.
   *
   * @static
   * @memberof SpecialItems
   */
  static $reset () {
    SpecialItems.items = []
  }
}

/**
 * Player manager.
 * Handles player instance and controls.
 *
 * @class Player
 */
class Player {
  static instance: SmallTV = null

  static get allPlayers () {
    return [Player.instance]
  }

  static keyControl (stage: Stage) {
    const player = Player.instance
    const input = stage.input

    // WASD 或左摇杆控制移动
    if (input.moveLeft) {
      player.dirX = 'L'
    } else if (input.moveRight) {
      player.dirX = 'R'
    } else {
      player.dirX = null
    }

    if (input.moveUp) {
      player.dirY = 'T'
    } else if (input.moveDown) {
      player.dirY = 'B'
    } else {
      player.dirY = null
    }

    // 保存模拟量用于平滑移动（手柄摇杆）
    player.analogMoveX = input.analogMoveX
    player.analogMoveY = input.analogMoveY

    // 检测右摇杆是否有输入（无极方向射击）
    const rightStickX = input.analogShootX
    const rightStickY = input.analogShootY
    const rightStickMagnitude = Math.sqrt(rightStickX * rightStickX + rightStickY * rightStickY)

    if (rightStickMagnitude > 0.3) {
      // 使用右摇杆的无极方向射击
      player.shootAngle = Math.atan2(rightStickY, rightStickX)
      player.useAnalogShooting = true
      player.attacking = true

      // 同时设置一个大致方向用于显示（四方向纹理）
      if (Math.abs(rightStickX) > Math.abs(rightStickY)) {
        player.weaponDirection = rightStickX > 0 ? 'R' : 'L'
      } else {
        player.weaponDirection = rightStickY > 0 ? 'B' : 'T'
      }
    } else if (input.shootLeft || input.shootRight || input.shootUp || input.shootDown) {
      // 键盘四方向射击
      player.useAnalogShooting = false
      player.shootAngle = null

      if (input.shootLeft) {
        player.weaponDirection = 'L'
      } else if (input.shootRight) {
        player.weaponDirection = 'R'
      } else if (input.shootUp) {
        player.weaponDirection = 'T'
      } else if (input.shootDown) {
        player.weaponDirection = 'B'
      }
      player.attacking = true
    } else {
      player.attacking = false
      player.useAnalogShooting = false
    }
  }

  static move (deltaTime: number) {
    const player = Player.instance
    const speed = player.speed * BASE_FPS * deltaTime

    // 如果有手柄模拟量输入，使用模拟量进行平滑移动
    if (player.analogMoveX !== 0 || player.analogMoveY !== 0) {
      player.x += player.analogMoveX * speed
      player.y += player.analogMoveY * speed
    } else {
      // 键盘输入使用方向
      if (player.dirX === 'L') { player.x -= speed }
      if (player.dirX === 'R') { player.x += speed }
      if (player.dirY === 'T') { player.y -= speed }
      if (player.dirY === 'B') { player.y += speed }
    }
  }

  static positionLimit () {
    // 无缝地图：移除边界限制，玩家可以自由移动
    // 如需世界边界，可在此添加
  }

  /**
   * Update camera to follow player.
   *
   * @static
   * @param {Stage} stage
   * @memberof Player
   */
  static updateCamera (stage: Stage) {
    const player = Player.instance
    stage.camera.follow(player.x, player.y, player.width, player.height)
  }

  static draw (stage: Stage) {
    const player = Player.instance
    player.updateTexture() // Update texture animation
    const [screenX, screenY] = stage.camera.toScreen(player.x, player.y)
    stage.context.drawImage(
      player.offscreen.canvasElement, screenX, screenY
    )
  }

  static $tick (stage: Stage, deltaTime: number) {
    Player.keyControl(stage)
    Player.move(deltaTime)
    Player.positionLimit()
    Player.updateCamera(stage) // 摄像机跟随玩家
    Player.draw(stage)
  }

  static $reset () {
    const player = new SmallTV()
    player.x = stageWidth / 2 - player.width / 2
    player.y = stageHeight / 2 - player.height / 2
    Player.instance = player
  }
}

/**
 * Weapons.
 *
 * @class Weapons
 */
class Weapons {
  static generateWeaponTimer = GEN_WEAPON_INTERVAL

  static get allWeapons () {
    return [
      Player.instance.weapons
    ]
  }

  static createWeapon (deltaTime: number) {
    if (Weapons.generateWeaponTimer > 0) {
      Weapons.generateWeaponTimer -= deltaTime
      return
    }

    for (let i = 0, length = Player.allPlayers.length; i < length; i++) {
      const player = Player.allPlayers[i]
      if (!player || !player.attacking) { continue }

      // Tick weapon duration
      player.tickWeaponDuration(deltaTime)

      // Handle different weapon types
      if (player.currentWeaponType === WeaponType.SHOTGUN) {
        // Shotgun creates multiple pellets
        const pellets = Shotgun.createPellets({
          direction: player.weaponDirection,
          x: player.x,
          y: player.y
        }, player.useAnalogShooting ? player.shootAngle : undefined)
        player.weapons.push(...pellets)
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

    Weapons.generateWeaponTimer = GEN_WEAPON_INTERVAL
  }

  static tickWeapon (stage: Stage, deltaTime: number) {
    for (let i = 0, playerLength = Player.allPlayers.length; i < playerLength; i++) {
      const player = Player.allPlayers[i]
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

        const weaponPdX = weapon.paddingX
        const weaponPdY = weapon.paddingY

        // Move weapon - speed is now pixels per second
        const speed = weapon.speed * BASE_FPS * deltaTime
        const direction = weapon.direction

        // 如果武器使用角度移动（无极方向射击）
        if (weapon.useAngleMovement) {
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
        const weaponWithRange = weapon as (PowerBullet | ShotgunPellet)
        if (weaponWithRange.isOutOfRange && weaponWithRange.isOutOfRange()) {
          weapons.splice(j, 1)
          continue
        }

        // If weapon hits some enemy.
        let weaponDestroyed = false

        // 先检测冲锋敌人
        if (Waves.checkWeaponHit(weapon)) {
          weapons.splice(j, 1)
          weaponDestroyed = true
        }

        // 再检测普通敌人
        if (!weaponDestroyed) {
          for (let k = 0, enemyLength = Enemys.enemys.length; k < enemyLength; k++) {
            const enemy = Enemys.enemys[k]
            if (!enemy || enemy.isDead) { continue }

            const startX = enemy.x + enemy.paddingX
            const startY = enemy.y + enemy.paddingY
            const endX = enemy.x + enemy.width - enemy.paddingX
            const endY = enemy.y + enemy.height - enemy.paddingY

            if (
              (weapon.x + weaponPdX >= startX && weapon.x - weaponPdX <= endX) &&
              (weapon.y + weaponPdY >= startY && weapon.y - weaponPdY <= endY)
            ) {
              enemy.hp -= weapon.attack

              // 被打中时出血效果
              Effects.spawnBlood(
                weapon.x,
                weapon.y,
                6 // 较少的血液粒子
              )

              weapons.splice(j, 1)
              weaponDestroyed = true
              break
            }
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

  static $tick (stage: Stage, deltaTime: number) {
    Weapons.createWeapon(deltaTime)
    Weapons.tickWeapon(stage, deltaTime)
  }

  static $reset () {
    Weapons.generateWeaponTimer = GEN_WEAPON_INTERVAL
  }
}

/**
 * UI.
 *
 * @class UI
 */
class UI {
  static printTitle (stage: Stage) {
    // 左上角版本信息
    stage.printText('Save small TV 0.4', 4, 10, 6)
  }

  static printScore (stage: Stage) {
    // 右上角游戏信息
    const text = `Score: ${score}  Level: ${level}`
    const textWidth = stage.measureText(text, 6)
    stage.printText(text, stageWidth - textWidth - 4, 10, 6)
  }

  // 缓存道具实例用于获取纹理
  static bulletIcon: Bullet = null
  static powerBulletItemIcon: PowerBulletItem = null
  static shotgunItemIcon: ShotgunItem = null

  static getItemSprite (type: WeaponType) {
    if (type === WeaponType.POWER_BULLET) {
      if (!UI.powerBulletItemIcon) {
        UI.powerBulletItemIcon = new PowerBulletItem()
        UI.powerBulletItemIcon.updateTexture()
      }
      return UI.powerBulletItemIcon
    } else if (type === WeaponType.SHOTGUN) {
      if (!UI.shotgunItemIcon) {
        UI.shotgunItemIcon = new ShotgunItem()
        UI.shotgunItemIcon.updateTexture()
      }
      return UI.shotgunItemIcon
    } else {
      // 普通子弹用子弹图标
      if (!UI.bulletIcon) {
        UI.bulletIcon = new Bullet({ x: 0, y: 0, direction: 'R' })
        UI.bulletIcon.updateTexture()
      }
      return UI.bulletIcon
    }
  }

  static printWeaponInfo (stage: Stage) {
    const player = Player.instance
    if (!player) {
      return
    }

    const weaponType = player.currentWeaponType
    if (weaponType === WeaponType.BULLET) {
      return
    }

    // 获取当前武器对应的道具图标
    const itemSprite = UI.getItemSprite(weaponType)

    // 图标尺寸（special item 是完整 8x8，保持原始大小）
    const srcSize = 8
    const iconSize = 10
    const smallFontSize = 5
    const gap = 2

    // 固定总高度
    const totalHeight = iconSize + gap + smallFontSize

    // 整体位置（左下角）
    const baseX = 4
    const baseY = stageHeight - totalHeight - 4

    // 图标位置
    const iconX = baseX
    const iconY = baseY

    // 绘制道具图标
    stage.context.drawImage(
      itemSprite.offscreen.canvasElement,
      0, 0, srcSize, srcSize,
      iconX, iconY, iconSize, iconSize
    )

    // 如果有武器持续时间，显示倒计时
    if (player.weaponDuration > 0) {
      const countdown = Math.ceil(player.weaponDuration).toString()
      const textWidth = stage.measureText(countdown, smallFontSize)
      const textX = iconX + (iconSize - textWidth) / 2
      const textY = iconY + iconSize + gap + smallFontSize
      stage.printText(countdown, textX, textY, smallFontSize)
    }
  }

  /**
   * 绘制玩家血条
   */
  static printHPBar (stage: Stage) {
    const player = Player.instance
    if (!player) { return }

    // 血条尺寸
    const barWidth = 30
    const barHeight = 4
    const barX = 4
    const barY = 18 // 在版本信息下方

    // 计算血量百分比
    const hpPercent = player.hp / player.maxHp

    const ctx = stage.context

    // 背景（深红色）
    ctx.fillStyle = '#4e4a4e'
    ctx.fillRect(barX, barY, barWidth, barHeight)

    // 血条颜色（根据血量变化）
    let barColor = '#6abe30' // 绿色 (>50%)
    if (hpPercent <= 0.25) {
      barColor = '#ac3232' // 红色 (<=25%)
    } else if (hpPercent <= 0.5) {
      barColor = '#df7126' // 橙色 (<=50%)
    }

    // 当前血量
    ctx.fillStyle = barColor
    ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight)

    // 边框
    ctx.strokeStyle = '#deeed6'
    ctx.lineWidth = 1
    ctx.strokeRect(barX + 0.5, barY + 0.5, barWidth - 1, barHeight - 1)

    // 无敌状态闪烁效果
    if (player.isInvincible) {
      // 每隔一段时间闪烁
      const blink = Math.floor(player.invincibleTimer * 10) % 2 === 0
      if (blink) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight)
      }
    }
  }

  static $printGameOver (stage: Stage) {
    const fontSize = 8
    const lineHeight = 12
    const lines = [
      'GAME OVER',
      `Your score: ${score}`,
      'Press ENTER to restart'
    ]

    // 计算总高度，垂直居中
    const totalHeight = lines.length * lineHeight
    const startY = (stageHeight - totalHeight) / 2 + fontSize

    for (let i = 0; i < lines.length; i++) {
      const text = lines[i]
      const textWidth = stage.measureText(text, fontSize)
      const x = (stageWidth - textWidth) / 2
      const y = startY + i * lineHeight
      stage.printText(text, x, y, fontSize)
    }
  }

  static $tick (stage: Stage) {
    UI.printTitle(stage)
    UI.printScore(stage)
    UI.printHPBar(stage)
    UI.printWeaponInfo(stage)
  }
}

/**
 * Game controlling class.
 *
 * @class Game
 */
class Game {
  static detectGameOver () {
    const allPlayers = Player.allPlayers
    const deadPlayer = allPlayers.filter(item => item.isDead)
    if (deadPlayer.length === allPlayers.length) {
      gameOver = true
    }
  }

  static waitRestart (stage: Stage) {
    if (stage.input.start) {
      Game.$restartGame()
    }
  }

  static $restartGame () {
    gameOver = false
    level = DEFAULT_LEVEL
    score = DEFAULT_SCORE
    Enemys.$reset()
    Waves.$reset()
    Weapons.$reset()
    SpecialItems.$reset()
    Effects.$reset()
    Player.$reset()
  }

  static $gameInWaiting (stage: Stage) {
    UI.$printGameOver(stage)
    Game.waitRestart(stage)
  }

  static $tick () {
    Game.detectGameOver()
  }
}
