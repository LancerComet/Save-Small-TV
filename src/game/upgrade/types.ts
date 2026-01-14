/**
 * Upgrade System - Types and Interfaces
 * Defines the structure for Roguelike upgrade items.
 */

import { SmallTV } from '../sprites/player'
import { Rarity } from '../menu/types'

/**
 * Upgrade category for organization and filtering.
 */
export enum UpgradeCategory {
  STAT = 'stat',           // HP, Speed, Attack
  WEAPON = 'weapon',       // Weapon modifications
  ABILITY = 'ability',     // New abilities
  PASSIVE = 'passive'      // Passive effects
}

/**
 * Upgrade item interface.
 * Represents a single upgrade that can be offered to the player.
 */
export interface IUpgradeItem {
  /**
   * Unique identifier.
   */
  id: string

  /**
   * Display name.
   */
  name: string

  /**
   * Description of the effect.
   */
  description: string

  /**
   * Category for organization.
   */
  category: UpgradeCategory

  /**
   * Rarity affects drop chance and visual styling.
   */
  rarity: Rarity

  /**
   * Maximum times this upgrade can be taken.
   * -1 for unlimited.
   */
  maxStacks: number

  /**
   * Current stack count (how many times player has taken this).
   */
  currentStacks?: number

  /**
   * Optional icon drawing function.
   */
  drawIcon?: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void

  /**
   * Apply this upgrade to the player.
   */
  apply (player: SmallTV): void

  /**
   * Check if this upgrade can be offered.
   * Used for prerequisites or exclusions.
   */
  canOffer? (player: SmallTV): boolean
}
