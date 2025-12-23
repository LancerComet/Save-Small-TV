/**
 * Game logic.
 * This file is the entry of whole game.
 * Contains all logic for the game.
 */

import { Stage } from '../core/stage'
import { tick } from './tick'

const main = async () => {
  await document.fonts.load('8px kenpixel')

  // Create new stage.
  const stage = new Stage(
    document.getElementById('app-canvas') as HTMLCanvasElement,
    {
      enableSmooth: false,
      scale: 3
    }
  )

  stage.onTick(tick)
  stage.start()
}

main()
