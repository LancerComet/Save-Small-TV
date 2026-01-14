/**
 * Upgrade Selection Menu
 * Displayed when player levels up - shows 3 random upgrades to choose from.
 */

import { Stage } from '../../../core/stage'
import { BaseMenu } from '../base'
import { IMenuItem, Rarity, RARITY_COLORS } from '../types'
import { IUpgradeItem } from '../../upgrade/types'
import { upgradePool } from '../../upgrade/upgrade-pool'
import { GameState } from '../../state'
import { playerSystem } from '../../systems/player'
import { menuManager } from '../menu-manager'

/**
 * Number of upgrade choices to present.
 */
const UPGRADE_CHOICES = 3

/**
 * Upgrade menu item - wraps an IUpgradeItem for display.
 */
interface IUpgradeMenuItem extends IMenuItem {
  upgrade: IUpgradeItem
}

/**
 * 稀有度短名称
 */
const RARITY_NAMES: Record<Rarity, string> = {
  [Rarity.COMMON]: 'C',
  [Rarity.UNCOMMON]: 'U',
  [Rarity.RARE]: 'R',
  [Rarity.EPIC]: 'E',
  [Rarity.LEGENDARY]: 'L'
}

/**
 * Upgrade Selection Menu
 * Shows random upgrade choices when leveling up.
 */
export class UpgradeMenu extends BaseMenu {
  id = 'upgrade-menu'
  title = 'LEVEL UP!'

  // Current upgrade choices
  private upgradeChoices: IUpgradeItem[] = []

  // Override items to be IUpgradeMenuItem
  declare items: IUpgradeMenuItem[]

  // Horizontal layout settings - 更大的卡片
  private cardWidth = 70
  private cardHeight = 90
  private cardSpacing = 8

  constructor () {
    super()
    this.backgroundColor = 'rgba(0, 0, 20, 0.95)'
  }

  /**
   * Called when menu opens - generate random upgrade choices.
   */
  onOpen () {
    const player = playerSystem.instance
    if (!player) return

    // Get random upgrades
    this.upgradeChoices = upgradePool.selectRandom(UPGRADE_CHOICES, player)

    // Convert to menu items
    this.items = this.upgradeChoices.map((upgrade, index) => ({
      id: upgrade.id,
      label: upgrade.name,
      description: upgrade.description,
      enabled: true,
      upgrade,
      onSelect: () => this.selectUpgrade(upgrade)
    }))

    // Reset selection
    this.selectedIndex = 0
  }

  /**
   * Apply selected upgrade and close menu.
   */
  private selectUpgrade (upgrade: IUpgradeItem) {
    const player = playerSystem.instance
    if (!player) return

    // Apply the upgrade
    upgradePool.applyUpgrade(upgrade, player)

    // Consume the level-up
    GameState.consumeLevelUp()

    // Close this menu
    menuManager.close()

    // If there are more pending level-ups, reopen
    if (GameState.pendingLevelUps > 0) {
      menuManager.open('upgrade-menu')
    }
  }

  /**
   * Override navigation for horizontal layout.
   */
  protected navigateUp (): void {
    // Do nothing - horizontal layout
  }

  protected navigateDown (): void {
    // Do nothing - horizontal layout
  }

  protected navigateLeft (): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--
    } else {
      this.selectedIndex = this.items.length - 1
    }
  }

  protected navigateRight (): void {
    if (this.selectedIndex < this.items.length - 1) {
      this.selectedIndex++
    } else {
      this.selectedIndex = 0
    }
  }

  /**
   * Don't allow canceling upgrade selection.
   */
  onCancel (): boolean {
    return false // Prevent closing
  }

  /**
   * Override draw for card-based layout.
   */
  draw (stage: Stage): void {
    if (!this.isActive) return

    const ctx = stage.context
    const [width, height] = stage.logicalSize

    // Draw dark overlay
    ctx.fillStyle = this.backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Draw title - 居中
    const titleText = `LEVEL UP!`
    this.drawCenteredText(ctx, titleText, width / 2, 20, 8, '#f1c40f')

    // Draw level
    const levelText = `Lv.${GameState.playerLevel}`
    this.drawCenteredText(ctx, levelText, width / 2, 30, 6, '#ffffff')

    // Draw subtitle
    this.drawCenteredText(ctx, 'Choose an upgrade', width / 2, 40, 5, '#888888')

    // Calculate card positions - 垂直居中
    const totalWidth = this.items.length * this.cardWidth + (this.items.length - 1) * this.cardSpacing
    const startX = (width - totalWidth) / 2
    const cardY = (height - this.cardHeight) / 2 - 5

    // Draw each upgrade card
    this.items.forEach((item, index) => {
      const cardX = startX + index * (this.cardWidth + this.cardSpacing)
      this.drawUpgradeCard(ctx, item, cardX, cardY, index === this.selectedIndex)
    })

    // Draw controls hint
    this.drawCenteredText(ctx, '[A/D] Select  [Enter] Confirm', width / 2, height - 8, 5, '#666666')
  }

  /**
   * 绘制居中文字
   */
  private drawCenteredText (
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    y: number,
    fontSize: number,
    color: string
  ) {
    ctx.font = `${fontSize}px kenpixel`
    ctx.fillStyle = color
    const metrics = ctx.measureText(text)
    ctx.fillText(text, centerX - metrics.width / 2, y)
  }

  /**
   * Draw a single upgrade card.
   */
  private drawUpgradeCard (
    ctx: CanvasRenderingContext2D,
    item: IUpgradeMenuItem,
    x: number,
    y: number,
    isSelected: boolean
  ) {
    const upgrade = item.upgrade
    const rarityColor = RARITY_COLORS[upgrade.rarity]
    const w = this.cardWidth
    const h = this.cardHeight

    // Card background
    ctx.fillStyle = isSelected ? 'rgba(109, 194, 202, 0.4)' : 'rgba(20, 20, 40, 0.95)'
    ctx.fillRect(x, y, w, h)

    // Card border (rarity colored)
    ctx.strokeStyle = isSelected ? '#ffffff' : rarityColor
    ctx.lineWidth = isSelected ? 2 : 1
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)

    // Selection indicator (arrow above card)
    if (isSelected) {
      ctx.fillStyle = '#f1c40f'
      const arrowX = x + w / 2
      const arrowY = y - 3
      ctx.beginPath()
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(arrowX - 4, arrowY - 5)
      ctx.lineTo(arrowX + 4, arrowY - 5)
      ctx.closePath()
      ctx.fill()
    }

    // ========== 卡片内容布局 ==========
    const padding = 4
    const contentX = x + padding
    const contentWidth = w - padding * 2

    // 1. 图标区域 (顶部)
    const iconSize = 20
    const iconX = x + (w - iconSize) / 2
    const iconY = y + 6

    if (upgrade.drawIcon) {
      upgrade.drawIcon(ctx, iconX, iconY, iconSize)
    } else {
      // Default icon - 简单方块
      ctx.fillStyle = rarityColor
      ctx.fillRect(iconX, iconY, iconSize, iconSize)
    }

    // 2. 稀有度标签 (图标下方)
    const rarityY = iconY + iconSize + 6
    ctx.fillStyle = rarityColor
    ctx.font = '5px kenpixel'
    const rarityText = RARITY_NAMES[upgrade.rarity]
    const rarityMetrics = ctx.measureText(rarityText)
    ctx.fillText(rarityText, x + (w - rarityMetrics.width) / 2, rarityY)

    // 3. 名称 (稀有度下方) - 居中
    const nameY = rarityY + 10
    ctx.fillStyle = '#ffffff'
    ctx.font = '6px kenpixel'
    this.drawTextCentered(ctx, upgrade.name, x + w / 2, nameY, contentWidth, 6, 2)

    // 4. 描述 (底部区域) - 居中
    const descY = nameY + 16
    ctx.fillStyle = '#aaaaaa'
    ctx.font = '5px kenpixel'
    this.drawTextCentered(ctx, upgrade.description, x + w / 2, descY, contentWidth, 5, 3)
  }

  /**
   * 在指定区域内居中绘制文字，自动换行
   * @param centerX 中心X坐标
   * @param maxLines 最大行数，超出截断
   */
  private drawTextCentered (
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    y: number,
    maxWidth: number,
    fontSize: number,
    maxLines: number
  ) {
    ctx.font = `${fontSize}px kenpixel`
    const lineHeight = fontSize + 2
    const words = text.split(' ')
    let line = ''
    let lineCount = 0
    let currentY = y

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const testLine = line + (line ? ' ' : '') + word
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && line !== '') {
        // 绘制当前行 - 居中
        const lineMetrics = ctx.measureText(line)
        ctx.fillText(line, centerX - lineMetrics.width / 2, currentY)
        lineCount++
        currentY += lineHeight

        if (lineCount >= maxLines) {
          return // 达到最大行数，停止
        }

        line = word
      } else {
        line = testLine
      }
    }

    // 绘制最后一行 - 居中
    if (line && lineCount < maxLines) {
      const lineMetrics = ctx.measureText(line)
      ctx.fillText(line, centerX - lineMetrics.width / 2, currentY)
    }
  }
}

// Create and export singleton
export const upgradeMenu = new UpgradeMenu()
