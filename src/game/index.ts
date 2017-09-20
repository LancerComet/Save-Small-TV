/**
 * Game logic.
 * This file is the entry of whole game.
 * Contains all logic for the game.
 */

import { Stage } from '../core/stage'
import { Sprite22 } from './sprites.enemy/22'
import { Sprite33 } from './sprites.enemy/33'
import { tick } from './tick'

// Create new stage.
const stage = new Stage(
  <HTMLCanvasElement> document.getElementById('app-canvas'),
  {
    enableSmooth: false,
    scale: 3
  }
)

stage.onTick(tick)
stage.start()
