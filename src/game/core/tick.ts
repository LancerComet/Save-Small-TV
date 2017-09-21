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

import { floor, rand } from '../utils'

const MAX_SPECIAL_ITEMS = 1
const GEN_SPECIAL_INTERVAL = 30 * 60  // Frames.
const MAX_ENEMYS = 10
const GEN_ENEMY_INTERVAL = 2 * 60  // Frames.

const bullets = []
const enemys: Sprite[] = []

let score = 0
let level = 1

let $genEnemyCountdown = 0
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
  if (!stageWidth || !stageHeight) {
    const stageSize = stage.logicalSize
    stageWidth = stageSize[0]
    stageHeight = stageSize[1]
  }

  genEnemys(stage)
  genSpecialItems(stage)
  tickEnemys()
  drawEnemys(stage)
  printUI(stage)
}

export {
  tick
}

// Enemy.
// ========================

/**
 * Generate Enemys.
 *
 * @param {Stage} stage
 */
function genEnemys (stage: Stage) {
  if (enemys.length >= level) { return }

  if ($genEnemyCountdown > 0) {
    $genEnemyCountdown--
    return
  }

  const logicSize = stage.logicalSize

  // Enemy count is based on current level.
  for (let i = 0; i < level; i++) {
    const Enemy = sprites.getRandomEnemy()
    const enemy = new Enemy()

    // TODO: Set enemy's position.

    enemys.push(enemy)
  }
}

/**
 * Tick all enemys.
 */
function tickEnemys () {
  for (let i = 0, length = enemys.length; i < length; i++) {
    const enemy = enemys[i]
    enemyDetectAttack(enemy)
    enemyAutoMove(enemy)
  }
}

/**
 * Draw enemys to stage.
 */
function drawEnemys (stage: Stage) {
  for (let i = 0, length = enemys.length; i < length; i++) {
    const enemy = enemys[i]
    stage.context.drawImage(
      enemy.offscreen.canvasElement,
      enemy.x,
      enemy.y
    )
  }
}

/**
 * Detect whether this sprite is under attack.
 *
 * @param {Sprite} enemy
 */
function enemyDetectAttack (enemy: Sprite) {
}

/**
 * Move enemy automaticlly.
 *
 * @param {Sprite} enemy
 */
function enemyAutoMove (enemy: Sprite) {
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

// Special items.
// ========================

/**
 * Generate Special Items.
 *
 * @param {Stage} stage
 */
function genSpecialItems (stage: Stage) {
  // TODO: Generate special items.
}

// UI.
// ========================
function printUI (stage: Stage) {
  stage.printText('Save small TV v0.3', 10, 10)
}
