/**
 * Game logic.
 * This file is the entry of whole game.
 * Contains all logic for the game.
 */

import { Stage } from '../core/stage'
import { tick } from './tick'

// Create new stage.
const stage = new Stage(
  <HTMLCanvasElement> document.getElementById('app-canvas'),
  {
    enableSmooth: false,
    scale: 4
  }
)

stage.onTick(tick)
stage.start()
