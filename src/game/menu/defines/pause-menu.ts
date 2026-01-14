/**
 * Pause Menu
 * Simple pause menu with resume and quit options.
 */

import { BaseMenu } from '../base'
import { menuManager } from '../menu-manager'
import { GameState } from '../../state'

export class PauseMenu extends BaseMenu {
  id = 'pause-menu'
  title = 'PAUSED'

  constructor () {
    super()

    this.items = [
      {
        id: 'resume',
        label: 'Resume Game',
        enabled: true,
        onSelect: () => {
          menuManager.close()
        }
      },
      {
        id: 'quit',
        label: 'Quit to Title',
        enabled: true,
        onSelect: () => {
          menuManager.closeAll()
          GameState.gameOver = true // For now, just trigger game over
        }
      }
    ]
  }

  onCancel (): boolean {
    menuManager.close()
    return true
  }
}

export const pauseMenu = new PauseMenu()
