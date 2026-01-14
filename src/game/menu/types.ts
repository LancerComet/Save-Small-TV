/**
 * Menu System - Core Types
 * Defines interfaces for the menu system that supports both keyboard and gamepad.
 */

import { Stage } from '../../core/stage'

/**
 * Menu navigation input abstraction.
 * Provides unified input for keyboard and gamepad.
 */
export interface IMenuInput {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  confirm: boolean
  cancel: boolean
}

/**
 * Menu item interface.
 * Represents a single selectable item in a menu.
 */
export interface IMenuItem {
  /**
   * Unique identifier for this item.
   */
  id: string

  /**
   * Display label for the item.
   */
  label: string

  /**
   * Optional description shown when item is selected.
   */
  description?: string

  /**
   * Optional icon or visual representation.
   */
  icon?: {
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void
  }

  /**
   * Whether this item is currently selectable.
   */
  enabled: boolean

  /**
   * Called when item is selected/confirmed.
   */
  onSelect?: () => void
}

/**
 * Menu interface.
 * Represents a complete menu screen.
 */
export interface IMenu {
  /**
   * Unique identifier for this menu.
   */
  id: string

  /**
   * Menu title displayed at the top.
   */
  title: string

  /**
   * List of menu items.
   */
  items: IMenuItem[]

  /**
   * Currently selected item index.
   */
  selectedIndex: number

  /**
   * Whether this menu is currently active.
   */
  isActive: boolean

  /**
   * Update menu logic (input handling).
   */
  update(input: IMenuInput, deltaTime: number): void

  /**
   * Draw the menu to the screen.
   */
  draw(stage: Stage): void

  /**
   * Called when menu is opened.
   */
  onOpen?(): void

  /**
   * Called when menu is closed.
   */
  onClose?(): void

  /**
   * Called when user presses cancel.
   * Return true to allow closing, false to prevent.
   */
  onCancel?(): boolean
}

/**
 * Menu transition types.
 */
export type MenuTransition = 'none' | 'fade' | 'slide'

/**
 * Rarity levels for upgrades.
 */
export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

/**
 * Rarity colors for visual distinction.
 */
export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: '#ffffff',
  [Rarity.UNCOMMON]: '#1eff00',
  [Rarity.RARE]: '#0070dd',
  [Rarity.EPIC]: '#a335ee',
  [Rarity.LEGENDARY]: '#ff8000'
}

/**
 * Rarity weights for random selection.
 * Higher weight = more common.
 */
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  [Rarity.COMMON]: 50,
  [Rarity.UNCOMMON]: 30,
  [Rarity.RARE]: 15,
  [Rarity.EPIC]: 4,
  [Rarity.LEGENDARY]: 1
}
