/**
 * Game logic.
 * This will be executed in every single frame.
 *
 * Sprite 将会存储两份引用, 一份在这里, 一份在 Stage 中.
 * 这里的 Sprite 用于业务控制, Stage 中的用于绘制.
 */

import { Stage } from '../../core/stage'
import { Sprite } from '../../core/sprite'

import * as sprites from '../sprites/sprites.enemy'
import { SmallTV } from '../sprites/sprites.player'
import { Bullet, Weapon } from '../sprites/sprites.weapon'

import { floor, rand } from '../utils'

const MAX_SPECIAL_ITEMS = 1
const GEN_SPECIAL_INTERVAL = 30 * 60  // Frames.
const MAX_ENEMYS = 10
const GEN_ENEMY_INTERVAL = 2 * 60  // Frames.
const GEN_WEAPON_INTERVAL = 5  // Frames.

let score = 0
let level = 1

let $genSpecialItemsCountdown = 0

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
  Player1.$tick(stage)
  Weapons.$tick(stage)
  Enemy.$tick(stage)
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

    Player1.player1 = player1
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
    !Player1.player1 && Init.player1()
  }
}

/**
 * Enemys.
 *
 * @class Enemy
 */
class Enemy {
  static enemys: Sprite[] = []
  static $genEnemyCountdown = GEN_ENEMY_INTERVAL

  /**
   * Generate enemys.
   *
   * @static
   * @param {Stage} stage
   * @memberof Enemy
   */
  static genEnemys (stage: Stage) {
    const enemys = Enemy.enemys

    // Total enemy count is equal to level.
    if (enemys.length >= level) { return }

    if (Enemy.$genEnemyCountdown > 0) {
      Enemy.$genEnemyCountdown--
      return
    }

    const logicSize = stage.logicalSize

    for (let i = 0; i < level; i++) {
      const EnemyType = sprites.getRandomEnemy()
      const enemy = new EnemyType()

      const startPosition = Enemy.createStartPosition()
      enemy.x = startPosition[0]
      enemy.y = startPosition[1]

      enemys.push(enemy)
    }

    Enemy.$genEnemyCountdown = GEN_ENEMY_INTERVAL
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
   * Tick all enemys.
   *
   * @static
   * @memberof Enemy
   */
  static tickEnemys (stage: Stage) {
    const enemys = Enemy.enemys

    for (let i = 0, length = enemys.length; i < length; i++) {
      const enemy = enemys[i]
      Enemy.detectAttack(enemy)
      Enemy.autoMove(enemy)
      Enemy.draw(stage, enemy)
    }
  }

  /**
   * Detect attacking for single enemy,
   *
   * @static
   * @param {Sprite} enemy
   * @memberof Enemy
   */
  static detectAttack (enemy: Sprite) {
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
   * @param {Sprite} enemy
   * @memberof Enemy
   */
  static autoMove (enemy: Sprite) {
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
   * @param {Sprite} enemy
   * @memberof Enemy
   */
  static draw (stage: Stage, enemy: Sprite) {
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
    Enemy.genEnemys(stage)
    Enemy.tickEnemys(stage)
  }

  /**
   * Data resetting function.
   *
   * @static
   * @memberof Enemy
   */
  static $reset () {
    Enemy.enemys = []
    Enemy.$genEnemyCountdown = GEN_ENEMY_INTERVAL
  }
}

/**
 * Player 1.
 *
 * @class Player1
 */
class Player1 {
  static player1: SmallTV = null
  static weapons: Sprite[] = []

  static keyControl (stage: Stage) {
    const player1 = Player1.player1

    const keyPressed = stage.keyPressed

    if (keyPressed.L) {
      player1.dirX = player1.weaponDirection = 'L'
    } else if (keyPressed.R) {
      player1.dirX = player1.weaponDirection = 'R'
    } else {
      player1.dirX = null
    }

    if (keyPressed.T) {
      player1.dirY = player1.weaponDirection = 'T'
    } else if (keyPressed.B) {
      player1.dirY = player1.weaponDirection = 'B'
    } else {
      player1.dirY = null
    }

    player1.attacking = keyPressed.X || keyPressed.Y || false
  }

  static move (stage: Stage) {
    const player1 = Player1.player1
    if (player1.dirX === 'L') { player1.x -= player1.speed }
    if (player1.dirX === 'R') { player1.x += player1.speed }
    if (player1.dirY === 'T') { player1.y -= player1.speed }
    if (player1.dirY === 'B') { player1.y += player1.speed }
  }

  static positionLimit () {
    const player1 = Player1.player1
    if (player1.x <= 0) { player1.x = 0 }
    if (player1.x >= stageWidth - player1.width) { player1.x = stageWidth - player1.width }
    if (player1.y <= 0) { player1.y = 0 }
    if (player1.y >= stageHeight - player1.height) { player1.y = stageHeight - player1.height }
  }

  static draw (stage: Stage) {
    const player1 = Player1.player1
    stage.context.drawImage(
      player1.offscreen.canvasElement, player1.x, player1.y
    )
  }

  static $tick (stage: Stage) {
    Player1.keyControl(stage)
    Player1.move(stage)
    Player1.positionLimit()
    Player1.draw(stage)
  }
}

class Weapons {
  static generateWeaponTimer = GEN_WEAPON_INTERVAL

  static get players () {
    return [Player1.player1]
  }

  static createWeapon () {
    if (Weapons.generateWeaponTimer > 0) {
      Weapons.generateWeaponTimer--
      return
    }

    for (let i = 0, length = Weapons.players.length; i < length; i++) {
      const player = Weapons.players[i]
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
    for (let i = 0, playerLength = Weapons.players.length; i < playerLength; i++) {
      const player = Weapons.players[i]
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
    stage.printText('Save small TV v0.3', 5, 10)
  }

  static $tick (stage: Stage) {
    UI.printTitle(stage)
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
