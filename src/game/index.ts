/**
 * Game logic.
 * This file is the entry of whole game.
 * Contains all logic for the game.
 */

import { Stage } from '../core/stage'
import { Sprite22 } from './sprites.enemy/22'

// Create new stage.
const stage = new Stage(
  <HTMLCanvasElement> document.getElementById('app-canvas'),
  {
    enableSmooth: false,
    scale: 20
  }
)

// Create sprites.
const emery22 = new Sprite22()
stage.addSprite(emery22)


// Start game.
stage.start()
