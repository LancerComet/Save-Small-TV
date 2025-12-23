/**
 * Game logic.
 * This will be executed in every single frame.
 */

import { Stage } from '../../core/stage'

import { Enemy, getRandomEnemy } from '../sprites/sprites.enemy'
import { SmallTV } from '../sprites/sprites.player'
import { Bullet, Weapon, WeaponType, Shotgun, PowerBullet, ShotgunPellet } from '../sprites/sprites.weapon'
import { SpecialItem, ItemType, getRandomItem } from '../sprites/sprites.special-items'
import { BloodParticle, BloodEffect, ExplosionParticle, ExplosionEffect } from '../sprites/sprites.effects'
import { spaceBackground } from '../background'

import { floor, rand } from '../utils'
import { ENERMY_BASE_COUNT, ENERMY_INCREMENT_RATIO } from '../config'

// Time constants (in seconds)
const MAX_SPECIAL_ITEMS = 5
const GEN_SPECIAL_INTERVAL = 30  // seconds
const MAX_ENEMYS = 10
const GEN_ENEMY_INTERVAL = 0.5  // seconds - 更快生成
const ENEMIES_PER_SPAWN = 3  // 每次生成敌人数量
const GEN_WEAPON_INTERVAL = 0.083  // ~5 frames at 60fps = 5/60 seconds
const ITEM_DROP_CHANCE = 0.3  // 30% chance to drop item
const WEAPON_DURATION = 10  // seconds
const ITEM_LIFETIME = 10  // seconds

// Speed multiplier for 60fps baseline
const BASE_FPS = 60

const DEFAULT_LEVEL = 1
const DEFAULT_SCORE = 0
const SCORE_PER_LEVEL = 100  // 每100分升一级

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
  Effects.$tick(stage, deltaTime)
  SpecialItems.$tick(stage, deltaTime)
  Player1.$tick(stage, deltaTime)
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
  static player1 () {
    Player1.$reset()
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
    !Player1.player && Init.player1()
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
    const spawnOffset = 30  // 在视口外多远生成

    // 随机选择从哪个方向生成（上、下、左、右）
    const side = floor(rand(4))
    let x: number, y: number

    switch (side) {
      case 0:  // 上方
        x = bounds.left + rand(stageWidth)
        y = bounds.top - spawnOffset
        break
      case 1:  // 下方
        x = bounds.left + rand(stageWidth)
        y = bounds.bottom + spawnOffset
        break
      case 2:  // 左侧
        x = bounds.left - spawnOffset
        y = bounds.top + rand(stageHeight)
        break
      case 3:  // 右侧
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
        player.isDead = true
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
          20  // 爆炸粒子数量
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

    // 敌人朝向玩家移动
    const player = Player1.player
    if (!player) { return }

    // 计算朝向玩家的方向
    const dx = player.x - enemy.x
    const dy = player.y - enemy.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 0) {
      // 归一化方向并乘以速度
      const speed = enemy.speed * BASE_FPS * deltaTime
      enemy.x += (dx / distance) * speed
      enemy.y += (dy / distance) * speed
    }
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
    enemy.updateTexture()  // Update texture animation
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
  static items: SpecialItem[] = []

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
   * @param {SpecialItem} item
   * @memberof SpecialItems
   */
  static detectPickup (item: SpecialItem) {
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
   * @param {SpecialItem} item
   * @memberof SpecialItems
   */
  static applyItemEffect (player: SmallTV, item: SpecialItem) {
    switch (item.itemType) {
      case ItemType.POWER_BULLET:
        player.switchWeapon(WeaponType.POWER_BULLET, WEAPON_DURATION, true)
        break
      case ItemType.SHOTGUN:
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
   * @param {SpecialItem} item
   * @param {number} deltaTime
   * @memberof SpecialItems
   */
  static updateLifetime (item: SpecialItem, deltaTime: number) {
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
   * @param {SpecialItem} item
   * @memberof SpecialItems
   */
  static draw (stage: Stage, item: SpecialItem) {
    item.updateTexture()  // Update texture animation
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
 * Player 1.
 *
 * @class Player1
 */
class Player {
  static get allPlayers () {
    return [
      Player1.player
    ]
  }

  static weapons: Weapon[] = []

  static keyControl (stage: Stage, player: SmallTV) {
    const keyPressed = stage.keyPressed

    // WASD 控制移动
    if (keyPressed.A) {
      player.dirX = 'L'
    } else if (keyPressed.D) {
      player.dirX = 'R'
    } else {
      player.dirX = null
    }

    if (keyPressed.W) {
      player.dirY = 'T'
    } else if (keyPressed.S) {
      player.dirY = 'B'
    } else {
      player.dirY = null
    }

    // 箭头键控制发射方向，按下即发射
    if (keyPressed.LEFT) {
      player.weaponDirection = 'L'
      player.attacking = true
    } else if (keyPressed.RIGHT) {
      player.weaponDirection = 'R'
      player.attacking = true
    } else if (keyPressed.UP) {
      player.weaponDirection = 'T'
      player.attacking = true
    } else if (keyPressed.DOWN) {
      player.weaponDirection = 'B'
      player.attacking = true
    } else {
      player.attacking = false
    }
  }

  static move (stage: Stage, player: SmallTV, deltaTime: number) {
    const speed = player.speed * BASE_FPS * deltaTime
    if (player.dirX === 'L') { player.x -= speed }
    if (player.dirX === 'R') { player.x += speed }
    if (player.dirY === 'T') { player.y -= speed }
    if (player.dirY === 'B') { player.y += speed }
  }

  static positionLimit (player: SmallTV) {
    // 无缝地图：移除边界限制，玩家可以自由移动
    // 如需世界边界，可在此添加
  }

  /**
   * Update camera to follow player.
   *
   * @static
   * @param {Stage} stage
   * @param {SmallTV} player
   * @memberof Player
   */
  static updateCamera (stage: Stage, player: SmallTV) {
    stage.camera.follow(player.x, player.y, player.width, player.height)
  }

  static draw (stage: Stage, player: SmallTV) {
    player.updateTexture()  // Update texture animation
    const [screenX, screenY] = stage.camera.toScreen(player.x, player.y)
    stage.context.drawImage(
      player.offscreen.canvasElement, screenX, screenY
    )
  }

  static $tick (stage: Stage, player: SmallTV, deltaTime: number) {
    Player.keyControl(stage, player)
    Player.move(stage, player, deltaTime)
    Player.positionLimit(player)
    Player.updateCamera(stage, player)  // 摄像机跟随玩家
    Player.draw(stage, player)
  }
}

/**
 * Player 1 Class.
 *
 * @class Player1
 */
class Player1 {
  static player: SmallTV = null

  static $tick (stage: Stage, deltaTime: number) {
    Player.$tick(stage, Player1.player, deltaTime)
  }

  static $reset () {
    const player1 = new SmallTV()
    player1.x = stageWidth / 2 - player1.width / 2
    player1.y = stageHeight / 2 - player1.height / 2

    Player1.player = player1
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
      Player1.player.weapons
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
        })
        player.weapons.push(...pellets)
      } else {
        // Normal or Power bullet
        const CurrentWeapon = player.currentWeaponClass
        const weapon: Weapon = new CurrentWeapon(<IWeapon> {
          direction: player.weaponDirection,
          x: player.x,
          y: player.y
        })
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

        // 散弹使用角度移动
        if (weapon instanceof ShotgunPellet) {
          weapon.move(speed)
        } else {
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
              6  // 较少的血液粒子
            )

            weapons.splice(j, 1)
            weaponDestroyed = true
            break
          }
        }

        if (weaponDestroyed) { continue }

        // If weapon moves out of camera view, destroy it.
        if (!stage.camera.isVisible(weapon.x, weapon.y, weapon.width, weapon.height)) {
          weapons.splice(j, 1)
          continue
        }

        weapon.updateTexture()  // Update texture animation
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
    stage.printText('=== Save small TV v0.4 ===', 5, 10)
  }

  static printScore (stage: Stage) {
    stage.printText(`Score: ${score}, Level: ${level}`, 120, 10)
  }

  static printWeaponInfo (stage: Stage) {
    const player = Player1.player
    if (!player) { return }

    let weaponName = 'Bullet'
    if (player.currentWeaponType === WeaponType.POWER_BULLET) {
      weaponName = 'Power'
    } else if (player.currentWeaponType === WeaponType.SHOTGUN) {
      weaponName = 'Shotgun'
    }

    const duration = player.weaponDuration > 0
      ? ` (${Math.ceil(player.weaponDuration)}s)`
      : ''

    stage.printText(`Weapon: ${weaponName}${duration}`, 5, stageHeight - 5)
  }

  static $printGameOver (stage: Stage) {
    stage.printText(
      'Game over young man !!', stageWidth / 2 - 50, stageHeight / 2 - 14
    )
    stage.printText(
      `Your score is ${score}.`, stageWidth / 2 - 29, stageHeight / 2 - 2
    )
    stage.printText(
      'Press enter to restart.', stageWidth / 2 - 42, stageHeight / 2 + 9
    )
  }

  static $tick (stage: Stage) {
    UI.printTitle(stage)
    UI.printScore(stage)
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
    if (stage.keyPressed.START) {
      Game.$restartGame()
    }
  }

  static $restartGame () {
    gameOver = false
    level = DEFAULT_LEVEL
    score = DEFAULT_SCORE
    Enemys.$reset()
    Weapons.$reset()
    SpecialItems.$reset()
    Effects.$reset()
    Player1.$reset()
  }

  static $gameInWaiting (stage: Stage) {
    UI.$printGameOver(stage)
    Game.waitRestart(stage)
  }

  static $tick () {
    Game.detectGameOver()
  }
}

function randomX () {
  return [-20, stageWidth + 20][floor(rand(2))]
}

function randomY () {
  return [-20, stageHeight + 20][floor(rand(2))]
}

function isOutOfStage (x: number, y: number, width: number, height: number) {
  return (x >= stageWidth + width || x <= 0 - width) ||
    (y >= stageHeight + height || y <= 0 - height)
}
