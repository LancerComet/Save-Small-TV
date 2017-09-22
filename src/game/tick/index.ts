/**
 * Game logic.
 * This will be executed in every single frame.
 */

import { Stage } from '../../core/stage'

import { Enemy, getRandomEnemy } from '../sprites/sprites.enemy'
import { SmallTV } from '../sprites/sprites.player'
import { Bullet, Weapon } from '../sprites/sprites.weapon'

import { floor, rand } from '../utils'

const MAX_SPECIAL_ITEMS = 1
const GEN_SPECIAL_INTERVAL = 30 * 60  // Frames.
const MAX_ENEMYS = 10
const GEN_ENEMY_INTERVAL = 2 * 60  // Frames.
const GEN_WEAPON_INTERVAL = 5  // Frames.

let score = 0
let level = 100

let stageWidth: number = null
let stageHeight: number = null

/**
 * Game ticking function.
 * All logic will be executed in here.
 *
 * @param {Stage} stage
 */
function tick (stage: Stage) {
  Init.$tick(stage)
  Enemys.$tick(stage)
  Player1.$tick(stage)
  Weapons.$tick(stage)
  UI.$tick(stage)
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
  }

  /**
   * Initialize player.
   *
   * @static
   * @memberof Init
   */
  static player1 () {
    const player1 = new SmallTV()
    player1.x = stageWidth / 2 - player1.width / 2
    player1.y = stageHeight / 2 - player1.height / 2

    Player1.player = player1
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
    if (!stageWidth || !stageHeight) { Init.size(stage) }

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
   * @memberof Enemy
   */
  static genEnemys (stage: Stage) {
    const enemys = Enemys.enemys

    // Total enemy count is equal to level.
    if (enemys.length >= level) { return }

    if (Enemys.$genEnemyCountdown > 0) {
      Enemys.$genEnemyCountdown--
      return
    }

    const logicSize = stage.logicalSize

    const EnemyType = getRandomEnemy()
    const enemy = new EnemyType()

    const startPosition = Enemys.createStartPosition()
    enemy.x = startPosition[0]
    enemy.y = startPosition[1]

    enemys.push(enemy)

    Enemys.$genEnemyCountdown = GEN_ENEMY_INTERVAL
  }

  /**
   * Create enemy start position.
   *
   * @static
   * @memberof Enemy
   */
  static createStartPosition () {
    return [
      [rand(stageWidth), randomY()],
      [randomX(), rand(stageHeight)]
    ][floor(rand(2))]
  }

  /**
   * Detect player distance.
   *
   * @static
   * @param {Enemy} enemy
   * @memberof Enemy
   */
  static detectPlayer (enemy: Enemy) {
    const startX = enemy.x
    const startY = enemy.y
    const endX = startX + enemy.width
    const endY = startY + enemy.height

    const allPlayers = Player.allPlayers
    for (let i = 0, length = allPlayers.length; i < length; i++) {
      const player = allPlayers[i]
      const $startX = player.x
      const $startY = player.y
      const $endX = player.x + player.width
      const $endY = player.y + player.height

      if (
        (($startX >= startX && $startX <= endX) || ($endX >= startX && $endX <= endX)) &&
        (($startY >= startY && $startY <= endY) || ($endY >= startY && $endY <= endY))
      ) {
        player.isDead = true
      }
    }
  }

  /**
   * Detect attacking for single enemy,
   *
   * @static
   * @param {Enemy} enemy
   * @memberof Enemy
   */
  static detectAttack (enemy: Enemy) {
    const padding = enemy.padding
    const startX = enemy.x - padding
    const startY = enemy.y - padding
    const sizeX = enemy.width
    const sizeY = enemy.height
    const endX = enemy.x - sizeX - padding
    const endY = enemy.y - sizeY - padding
    // TODO: line 435.
  }

  /**
   * Auto move single enemy.
   *
   * @static
   * @param {Enemy} enemy
   * @memberof Enemy
   */
  static autoMove (enemy: Enemy) {
    if (enemy.isDead) { return }

    const speed = enemy.speed
    const x = enemy.x
    const y = enemy.y
    const sizeX = enemy.width
    const sizeY = enemy.height

    enemy.x = enemy.dirX === 'L'
      ? x - speed
      : x + speed

    enemy.y = enemy.dirY === 'T'
      ? y - speed
      : y + speed

    if (x <= 0) {
      enemy.dirX = 'R'
    }

    if (y <= 0) {
      enemy.dirY = 'B'
    }

    if (x >= stageWidth - sizeX) {
      enemy.dirX = 'L'
    }

    if (y >= stageHeight - sizeY) {
      enemy.dirY = 'T'
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
    stage.context.drawImage(
      enemy.offscreen.canvasElement,
      enemy.x,
      enemy.y
    )
  }

  /**
   * Ticking.
   *
   * @static
   * @param {Stage} stage
   * @memberof Enemy
   */
  static $tick (stage: Stage) {
    Enemys.genEnemys(stage)

    for (let i = 0, length = Enemys.enemys.length; i < length; i++) {
      const enemy = Enemys.enemys[i]
      Enemys.detectPlayer(enemy)
      Enemys.detectAttack(enemy)
      Enemys.autoMove(enemy)
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

    if (keyPressed.L) {
      player.dirX = player.weaponDirection = 'L'
    } else if (keyPressed.R) {
      player.dirX = player.weaponDirection = 'R'
    } else {
      player.dirX = null
    }

    if (keyPressed.T) {
      player.dirY = player.weaponDirection = 'T'
    } else if (keyPressed.B) {
      player.dirY = player.weaponDirection = 'B'
    } else {
      player.dirY = null
    }

    player.attacking = keyPressed.X || keyPressed.Y || false
  }

  static move (stage: Stage, player: SmallTV) {
    if (player.dirX === 'L') { player.x -= player.speed }
    if (player.dirX === 'R') { player.x += player.speed }
    if (player.dirY === 'T') { player.y -= player.speed }
    if (player.dirY === 'B') { player.y += player.speed }
  }

  static positionLimit (player: SmallTV) {
    if (player.x <= 0) { player.x = 0 }
    if (player.x >= stageWidth - player.width) { player.x = stageWidth - player.width }
    if (player.y <= 0) { player.y = 0 }
    if (player.y >= stageHeight - player.height) { player.y = stageHeight - player.height }
  }

  static draw (stage: Stage, player: SmallTV) {
    stage.context.drawImage(
      player.offscreen.canvasElement, player.x, player.y
    )
  }

  static $tick (stage: Stage, player: SmallTV) {
    Player.keyControl(stage, player)
    Player.move(stage, player)
    Player.positionLimit(player)
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

  static $tick (stage: Stage) {
    Player.$tick(stage, Player1.player)
  }
}

/**
 * Weapons.
 *
 * @class Weapons
 */
class Weapons {
  static generateWeaponTimer = GEN_WEAPON_INTERVAL

  static createWeapon () {
    if (Weapons.generateWeaponTimer > 0) {
      Weapons.generateWeaponTimer--
      return
    }

    for (let i = 0, length = Player.allPlayers.length; i < length; i++) {
      const player = Player.allPlayers[i]
      if (!player || !player.attacking) { continue }

      const CurrentWeapon = player.currentWeaponClass
      const weapon: Weapon = new CurrentWeapon(<IWeapon> {
        direction: player.weaponDirection,
        x: player.x,
        y: player.y
      })

      player.weapons.push(weapon)
    }

    Weapons.generateWeaponTimer = GEN_WEAPON_INTERVAL
  }

  static tickWeapon (stage: Stage) {
    for (let i = 0, playerLength = Player.allPlayers.length; i < playerLength; i++) {
      const player = Player.allPlayers[i]
      if (!player) { continue }

      const weapons = player.weapons
      const weaponLength = weapons.length
      if (!weaponLength) { continue }

      for (let j = 0; j < weaponLength; j++) {
        const weapon = weapons[j]
        if (!weapon) { continue }

        // Move weapon.
        const direction = weapon.direction
        if (direction === 'L') { weapon.x -= weapon.speed }
        if (direction === 'R') { weapon.x += weapon.speed }
        if (direction === 'T') { weapon.y -= weapon.speed }
        if (direction === 'B') { weapon.y += weapon.speed }

        // If weapon moves out, destroy it.
        if (isOutOfStage(weapon.x, weapon.y, weapon.width, weapon.height)) {
          player.weapons.splice(
            player.weapons.indexOf(weapon),
            1
          )
          continue
        }

        stage.context.drawImage(
          weapon.offscreen.canvasElement, weapon.x, weapon.y
        )
      }
    }
  }

  static $tick (stage: Stage) {
    Weapons.createWeapon()
    Weapons.tickWeapon(stage)
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
    stage.printText('=== Save small TV v0.3 ===', 5, 10)
  }

  static printScore (stage: Stage) {
    stage.printText(`Score: ${score}, Level: ${level}`, 120, 10)
  }

  static $tick (stage: Stage) {
    UI.printTitle(stage)
    UI.printScore(stage)
  }
}

function randomX () {
  return [-20, stageWidth + 20][floor(rand(2))]
}

function randomY () {
  return [-20, stageHeight + 20][floor(rand(2))]
}

function isOutOfStage (x: number, y: number, width: number, height: number) {
  return (x > stageWidth + width || x < 0 - width) &&
    (y > stageHeight + height || y < 0 - height)
}
