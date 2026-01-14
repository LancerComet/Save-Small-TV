/**
 * Menu Manager
 * Controls menu stack and handles transitions between menus.
 */

import { Stage } from '../../core/stage'
import { IMenu, IMenuInput } from './types'

/**
 * Menu Manager - Singleton
 * Manages active menus and menu navigation stack.
 */
class MenuManager {
  /**
   * Stack of active menus. Last item is the topmost visible menu.
   */
  private menuStack: IMenu[] = []

  /**
   * Registry of all available menus.
   */
  private menus: Map<string, IMenu> = new Map()

  /**
   * Whether the game is paused due to menu.
   */
  get isPaused (): boolean {
    return this.menuStack.length > 0
  }

  /**
   * Get the currently active (topmost) menu.
   */
  get currentMenu (): IMenu | null {
    return this.menuStack.length > 0
      ? this.menuStack[this.menuStack.length - 1]
      : null
  }

  /**
   * Register a menu for later use.
   */
  register (menu: IMenu): void {
    this.menus.set(menu.id, menu)
  }

  /**
   * Unregister a menu.
   */
  unregister (menuId: string): void {
    this.menus.delete(menuId)
  }

  /**
   * Open a menu by ID.
   */
  open (menuId: string): boolean {
    const menu = this.menus.get(menuId)
    if (!menu) {
      console.warn(`Menu not found: ${menuId}`)
      return false
    }

    // Deactivate current menu if any
    if (this.currentMenu) {
      this.currentMenu.isActive = false
    }

    // Push new menu onto stack
    this.menuStack.push(menu)
    menu.isActive = true
    menu.selectedIndex = 0 // Reset selection

    // Call lifecycle hook
    if (menu.onOpen) {
      menu.onOpen()
    }

    return true
  }

  /**
   * Close the topmost menu.
   */
  close (): void {
    const menu = this.menuStack.pop()
    if (menu) {
      menu.isActive = false
      if (menu.onClose) {
        menu.onClose()
      }
    }

    // Reactivate previous menu if any
    if (this.currentMenu) {
      this.currentMenu.isActive = true
    }
  }

  /**
   * Close all menus.
   */
  closeAll (): void {
    while (this.menuStack.length > 0) {
      this.close()
    }
  }

  /**
   * Convert stage input to menu input.
   */
  getMenuInput (stage: Stage): IMenuInput {
    const input = stage.input
    const gp = stage.gamepad.state

    return {
      up: input.moveUp || gp.dpadUp,
      down: input.moveDown || gp.dpadDown,
      left: input.moveLeft || gp.dpadLeft,
      right: input.moveRight || gp.dpadRight,
      confirm: input.actionX || input.start || gp.buttonA,
      cancel: input.esc || gp.buttonB
    }
  }

  /**
   * Update the current menu.
   */
  update (stage: Stage, deltaTime: number): void {
    const menu = this.currentMenu
    if (!menu) return

    const input = this.getMenuInput(stage)
    menu.update(input, deltaTime)
  }

  /**
   * Draw all visible menus (from bottom to top).
   */
  draw (stage: Stage): void {
    // Draw all menus in stack (allows seeing menus underneath)
    for (const menu of this.menuStack) {
      menu.draw(stage)
    }
  }
}

// Export singleton instance
export const menuManager = new MenuManager()
