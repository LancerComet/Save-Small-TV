/**
 * Game logic.
 * This will be executed in every single frame.
 *
 * Sprite 将会存储两份引用, 一份在这里, 一份在 Stage 中.
 * 这里的 Sprite 用于业务控制, Stage 中的用于绘制.
 */

import { Stage } from '../core/stage'
import { Sprite } from '../core/sprite'
import * as sprites from './sprites.enemy'

import { floor, rand } from './utils'

const MAX_SPECIAL_ITEMS = 1
const GEN_SPECIAL_INTERVAL = 30 * 60  // Frames.
const MAX_ENEMYS = 10
const GEN_ENEMY_INTERVAL = 2 * 60  // Frames.

const ENEMY_TYPES = [
  sprites.Sprite22,
  sprites.Sprite33
]

const bullets = []
const enemys: Sprite[] = []

let score = 0
let level = 1

let $genEnemyCountdown = 0
let $genSpecialItemsCountdown = 0

/**
 * Game ticking function.
 * All logic will be executed in here.
 *
 * @param {Stage} stage
 */
function tick (stage: Stage) {
  genEnemys(stage)
  genSpecialItems(stage)
  tickEnemys()
}

export {
  tick
}

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
  const width = logicSize[0]
  const height = logicSize[1]

  // Enemy count is based on current level.
  for (let i = 0; i < level; i++) {
    const enemy = new ENEMY_TYPES[floor(rand() * ENEMY_TYPES.length)](width, height)

    // TODO: Set enemy's position.

    stage.addSprite(enemy)
    enemys.push(enemy)
  }
}

/**
 * Generate Special Items.
 *
 * @param {Stage} stage
 */
function genSpecialItems (stage: Stage) {
  // TODO: Generate special items.
}

/**
 * Get random Enemy,
 *
 * @returns
 */
function getRandomEnemy () {
  return ENEMY_TYPES[floor(rand() * ENEMY_TYPES.length)]
}

/**
 * Tick all enemys.
 */
function tickEnemys () {
  for (let i = 0, length = enemys.length; i < length; i++) {
    enemys[i].$tick()
  }
}
