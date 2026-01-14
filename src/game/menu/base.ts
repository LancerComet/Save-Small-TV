/**
 * Menu System - Base Menu Class
 * Provides common functionality for all menus.
 */

import { Stage } from '../../core/stage'
import { IMenu, IMenuItem, IMenuInput } from './types'

/**
 * Abstract base class for menus.
 * Handles common navigation and rendering logic.
 */
export abstract class BaseMenu implements IMenu {
  abstract id: string
  abstract title: string

  items: IMenuItem[] = []
  selectedIndex: number = 0
  isActive: boolean = false

  // Input debounce to prevent rapid selection changes
  private inputCooldown: number = 0
  private readonly INPUT_COOLDOWN_TIME = 0.15 // seconds

  // Visual configuration
  protected backgroundColor = 'rgba(0, 0, 0, 0.85)'
  protected titleColor = '#ffffff'
  protected itemColor = '#cccccc'
  protected selectedColor = '#ffff00'
  protected disabledColor = '#666666'

  // Layout configuration
  protected padding = 20
  protected itemHeight = 16
  protected itemSpacing = 4

  /**
   * Update menu state based on input.
   */
  update (input: IMenuInput, deltaTime: number): void {
    if (!this.isActive) return

    // Handle input cooldown
    if (this.inputCooldown > 0) {
      this.inputCooldown -= deltaTime
      return
    }

    // Navigation
    if (input.up) {
      this.navigateUp()
      this.inputCooldown = this.INPUT_COOLDOWN_TIME
    } else if (input.down) {
      this.navigateDown()
      this.inputCooldown = this.INPUT_COOLDOWN_TIME
    } else if (input.left) {
      this.navigateLeft()
      this.inputCooldown = this.INPUT_COOLDOWN_TIME
    } else if (input.right) {
      this.navigateRight()
      this.inputCooldown = this.INPUT_COOLDOWN_TIME
    }

    // Selection
    if (input.confirm) {
      this.confirmSelection()
      this.inputCooldown = this.INPUT_COOLDOWN_TIME
    }

    // Cancel
    if (input.cancel) {
      if (this.onCancel) {
        this.onCancel()
      }
      this.inputCooldown = this.INPUT_COOLDOWN_TIME
    }
  }

  /**
   * Navigate to previous item.
   */
  protected navigateUp (): void {
    const enabledItems = this.getEnabledIndices()
    if (enabledItems.length === 0) return

    const currentPos = enabledItems.indexOf(this.selectedIndex)
    if (currentPos > 0) {
      this.selectedIndex = enabledItems[currentPos - 1]
    } else {
      this.selectedIndex = enabledItems[enabledItems.length - 1] // Wrap around
    }
  }

  /**
   * Navigate to next item.
   */
  protected navigateDown (): void {
    const enabledItems = this.getEnabledIndices()
    if (enabledItems.length === 0) return

    const currentPos = enabledItems.indexOf(this.selectedIndex)
    if (currentPos < enabledItems.length - 1) {
      this.selectedIndex = enabledItems[currentPos + 1]
    } else {
      this.selectedIndex = enabledItems[0] // Wrap around
    }
  }

  /**
   * Optional left navigation (for horizontal menus).
   */
  protected navigateLeft (): void {
    // Override in subclass if needed
  }

  /**
   * Optional right navigation (for horizontal menus).
   */
  protected navigateRight (): void {
    // Override in subclass if needed
  }

  /**
   * Confirm current selection.
   */
  protected confirmSelection (): void {
    const item = this.items[this.selectedIndex]
    if (item && item.enabled && item.onSelect) {
      item.onSelect()
    }
  }

  /**
   * Get indices of enabled items.
   */
  protected getEnabledIndices (): number[] {
    return this.items
      .map((item, index) => item.enabled ? index : -1)
      .filter(index => index >= 0)
  }

  /**
   * Draw the menu.
   */
  draw (stage: Stage): void {
    if (!this.isActive) return

    const ctx = stage.context
    const [width, height] = stage.logicalSize

    // Draw background overlay
    ctx.fillStyle = this.backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Calculate menu dimensions
    const menuWidth = Math.min(width - this.padding * 2, 200)
    const menuHeight = this.calculateMenuHeight()
    const menuX = (width - menuWidth) / 2
    const menuY = (height - menuHeight) / 2

    // Draw menu box
    this.drawMenuBox(ctx, menuX, menuY, menuWidth, menuHeight)

    // Draw title
    this.drawTitle(stage, menuX, menuY, menuWidth)

    // Draw items
    this.drawItems(stage, menuX, menuY + 24, menuWidth)
  }

  /**
   * Calculate total menu height.
   */
  protected calculateMenuHeight (): number {
    return 24 + this.items.length * (this.itemHeight + this.itemSpacing) + this.padding
  }

  /**
   * Draw menu background box.
   */
  protected drawMenuBox (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    // Background
    ctx.fillStyle = 'rgba(20, 20, 40, 0.95)'
    ctx.fillRect(x, y, width, height)

    // Border
    ctx.strokeStyle = '#6dc2ca'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)
  }

  /**
   * Draw menu title.
   */
  protected drawTitle (stage: Stage, x: number, y: number, width: number): void {
    const ctx = stage.context
    ctx.fillStyle = this.titleColor
    ctx.font = '8px kenpixel'
    const titleWidth = stage.measureText(this.title, 8)
    ctx.fillText(this.title, x + (width - titleWidth) / 2, y + 14)
  }

  /**
   * Draw menu items.
   */
  protected drawItems (stage: Stage, x: number, startY: number, width: number): void {
    const ctx = stage.context

    this.items.forEach((item, index) => {
      const itemY = startY + index * (this.itemHeight + this.itemSpacing)
      const isSelected = index === this.selectedIndex

      // Draw selection highlight
      if (isSelected) {
        ctx.fillStyle = 'rgba(109, 194, 202, 0.3)'
        ctx.fillRect(x + 4, itemY - 2, width - 8, this.itemHeight + 2)

        // Draw selector arrow
        ctx.fillStyle = this.selectedColor
        ctx.fillText('>', x + 8, itemY + 10)
      }

      // Draw item label
      ctx.fillStyle = !item.enabled ? this.disabledColor
        : isSelected ? this.selectedColor : this.itemColor
      ctx.font = '6px kenpixel'
      ctx.fillText(item.label, x + 20, itemY + 10)

      // Draw icon if present
      if (item.icon) {
        item.icon.draw(ctx, x + width - 20, itemY + 2, 12)
      }
    })
  }

  // Lifecycle hooks
  onOpen? (): void
  onClose? (): void
  onCancel? (): boolean
}
