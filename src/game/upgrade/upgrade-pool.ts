/**
 * Upgrade Pool
 * Manages the collection of available upgrades and random selection.
 */

import { SmallTV } from '../sprites/player'
import { RARITY_WEIGHTS } from '../menu/types'
import { IUpgradeItem, UpgradeCategory } from './types'

/**
 * Upgrade Pool Manager
 * Handles registration and random selection of upgrades.
 */
class UpgradePool {
  /**
   * All registered upgrades.
   */
  private upgrades: Map<string, IUpgradeItem> = new Map()

  /**
   * Track how many times each upgrade has been taken.
   */
  private takenCounts: Map<string, number> = new Map()

  /**
   * Register an upgrade.
   */
  register (upgrade: IUpgradeItem): void {
    this.upgrades.set(upgrade.id, upgrade)
  }

  /**
   * Register multiple upgrades.
   */
  registerAll (upgrades: IUpgradeItem[]): void {
    upgrades.forEach(u => this.register(u))
  }

  /**
   * Get an upgrade by ID.
   */
  get (id: string): IUpgradeItem | undefined {
    return this.upgrades.get(id)
  }

  /**
   * Get all upgrades in a category.
   */
  getByCategory (category: UpgradeCategory): IUpgradeItem[] {
    return Array.from(this.upgrades.values())
      .filter(u => u.category === category)
  }

  /**
   * Get the current stack count for an upgrade.
   */
  getStackCount (id: string): number {
    return this.takenCounts.get(id) || 0
  }

  /**
   * Get available upgrades (can still be offered).
   */
  getAvailable (player: SmallTV): IUpgradeItem[] {
    return Array.from(this.upgrades.values()).filter(upgrade => {
      // Check max stacks
      const currentStacks = this.getStackCount(upgrade.id)
      if (upgrade.maxStacks !== -1 && currentStacks >= upgrade.maxStacks) {
        return false
      }

      // Check custom condition
      if (upgrade.canOffer && !upgrade.canOffer(player)) {
        return false
      }

      return true
    })
  }

  /**
   * Select random upgrades using weighted rarity.
   * @param count Number of upgrades to select
   * @param player Player instance for filtering
   * @returns Array of selected upgrades
   */
  selectRandom (count: number, player: SmallTV): IUpgradeItem[] {
    const available = this.getAvailable(player)
    if (available.length === 0) return []

    // Calculate weights
    const weighted: { upgrade: IUpgradeItem; weight: number }[] = available.map(upgrade => ({
      upgrade,
      weight: RARITY_WEIGHTS[upgrade.rarity]
    }))

    // Select unique upgrades (weighted without replacement)
    const selected: IUpgradeItem[] = []
    const pool = [...weighted]
    let totalWeight = pool.reduce((sum, w) => sum + w.weight, 0)

    while (selected.length < count && pool.length > 0) {
      let roll = Math.random() * totalWeight
      let selectedIndex = -1

      for (let i = 0; i < pool.length; i++) {
        roll -= pool[i].weight
        if (roll <= 0) {
          selectedIndex = i
          break
        }
      }

      // Fallback: pick first
      if (selectedIndex === -1) {
        selectedIndex = 0
      }

      const [chosen] = pool.splice(selectedIndex, 1)
      totalWeight -= chosen.weight
      selected.push(chosen.upgrade)
    }

    return selected
  }

  /**
   * Apply an upgrade and track it.
   */
  applyUpgrade (upgrade: IUpgradeItem, player: SmallTV): void {
    upgrade.apply(player)

    const currentCount = this.getStackCount(upgrade.id)
    this.takenCounts.set(upgrade.id, currentCount + 1)
  }

  /**
   * Reset all upgrade counts (for new game).
   */
  reset (): void {
    this.takenCounts.clear()
  }
}

// Export singleton
export const upgradePool = new UpgradePool()
