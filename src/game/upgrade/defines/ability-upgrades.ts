/**
 * Weapon & Ability Upgrades
 * Special abilities and weapon modifications.
 */

import { Rarity } from '../../menu/types'
import { IUpgradeItem, UpgradeCategory } from '../types'

/**
 * Weapon modification upgrades.
 */
export const weaponUpgrades: IUpgradeItem[] = [
  // Multi-shot upgrades
  {
    id: 'double_shot',
    name: 'Double Shot',
    description: 'Fire 2 bullets at once',
    category: UpgradeCategory.WEAPON,
    rarity: Rarity.RARE,
    maxStacks: 1,
    apply: (player) => {
      player.hasDoubleShot = true
    },
    canOffer: (player) => !player.hasDoubleShot && !player.hasTripleShot,
    drawIcon: (ctx, x, y, size) => {
      ctx.fillStyle = '#f39c12'
      // Draw two bullets
      ctx.fillRect(x + 2, y + 2, size / 3, size - 4)
      ctx.fillRect(x + size / 2, y + 2, size / 3, size - 4)
    }
  },

  {
    id: 'triple_shot',
    name: 'Triple Shot',
    description: 'Fire 3 bullets in a spread',
    category: UpgradeCategory.WEAPON,
    rarity: Rarity.EPIC,
    maxStacks: 1,
    apply: (player) => {
      player.hasTripleShot = true
      player.hasDoubleShot = false // Upgrade from double
    },
    canOffer: (player) => player.hasDoubleShot && !player.hasTripleShot,
    drawIcon: (ctx, x, y, size) => {
      ctx.fillStyle = '#e74c3c'
      // Draw three bullets in fan
      ctx.fillRect(x + 1, y + 4, size / 4, size - 6)
      ctx.fillRect(x + size / 2 - size / 8, y + 1, size / 4, size - 4)
      ctx.fillRect(x + size - size / 4 - 1, y + 4, size / 4, size - 6)
    }
  },

  {
    id: 'rear_shot',
    name: 'Rear Guard',
    description: 'Also fire backwards',
    category: UpgradeCategory.WEAPON,
    rarity: Rarity.RARE,
    maxStacks: 1,
    apply: (player) => {
      player.hasRearShot = true
    },
    canOffer: (player) => !player.hasRearShot,
    drawIcon: (ctx, x, y, size) => {
      ctx.fillStyle = '#9b59b6'
      // Draw arrows pointing both ways
      const mid = size / 2
      ctx.beginPath()
      ctx.moveTo(x, y + mid)
      ctx.lineTo(x + mid, y + 2)
      ctx.lineTo(x + mid, y + size - 2)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(x + size, y + mid)
      ctx.lineTo(x + mid, y + 2)
      ctx.lineTo(x + mid, y + size - 2)
      ctx.closePath()
      ctx.fill()
    }
  },

  {
    id: 'piercing',
    name: 'Piercing Shots',
    description: 'Bullets pass through enemies',
    category: UpgradeCategory.WEAPON,
    rarity: Rarity.EPIC,
    maxStacks: 1,
    apply: (player) => {
      player.hasPiercing = true
    },
    canOffer: (player) => !player.hasPiercing,
    drawIcon: (ctx, x, y, size) => {
      ctx.fillStyle = '#3498db'
      // Draw arrow through rectangle
      ctx.fillRect(x + 2, y + size / 3, size - 4, size / 3)
      ctx.beginPath()
      ctx.moveTo(x + size, y + size / 2)
      ctx.lineTo(x + size - 4, y + 2)
      ctx.lineTo(x + size - 4, y + size - 2)
      ctx.closePath()
      ctx.fill()
    }
  },

  {
    id: 'lifesteal',
    name: 'Vampiric Shots',
    description: 'Heal 5% of damage dealt',
    category: UpgradeCategory.WEAPON,
    rarity: Rarity.EPIC,
    maxStacks: 1,
    apply: (player) => {
      player.hasLifesteal = true
    },
    canOffer: (player) => !player.hasLifesteal,
    drawIcon: (ctx, x, y, size) => {
      // Draw a heart
      ctx.fillStyle = '#e74c3c'
      const mid = x + size / 2
      ctx.beginPath()
      ctx.moveTo(mid, y + size - 2)
      ctx.bezierCurveTo(x, y + size / 2, x, y + 2, mid, y + size / 3)
      ctx.bezierCurveTo(x + size, y + 2, x + size, y + size / 2, mid, y + size - 2)
      ctx.fill()
    }
  }
]

/**
 * Passive ability upgrades.
 */
export const abilityUpgrades: IUpgradeItem[] = [
  {
    id: 'dodge_chance',
    name: 'Evasion',
    description: '15% chance to dodge attacks',
    category: UpgradeCategory.ABILITY,
    rarity: Rarity.RARE,
    maxStacks: 3,
    apply: (player) => {
      player.dodgeChance = (player.dodgeChance || 0) + 0.15
    },
    drawIcon: (ctx, x, y, size) => {
      ctx.strokeStyle = '#1abc9c'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x + size / 2, y + size / 2, size / 2 - 2, 0, Math.PI * 2)
      ctx.stroke()
    }
  },

  {
    id: 'magnet',
    name: 'Item Magnet',
    description: 'Attract items from further away',
    category: UpgradeCategory.ABILITY,
    rarity: Rarity.UNCOMMON,
    maxStacks: 3,
    apply: (player) => {
      player.magnetRange = (player.magnetRange || 0) + 15
    },
    drawIcon: (ctx, x, y, size) => {
      ctx.fillStyle = '#e74c3c'
      // Draw U shape magnet
      ctx.fillRect(x + 1, y + 1, size / 3, size - 2)
      ctx.fillRect(x + size - size / 3 - 1, y + 1, size / 3, size - 2)
      ctx.fillRect(x + 1, y + size - size / 3, size - 2, size / 3)
    }
  },

  {
    id: 'explosion_on_kill',
    name: 'Chain Reaction',
    description: 'Enemies explode on death',
    category: UpgradeCategory.ABILITY,
    rarity: Rarity.LEGENDARY,
    maxStacks: 1,
    apply: (player) => {
      player.hasExplosionOnKill = true
    },
    canOffer: (player) => !player.hasExplosionOnKill,
    drawIcon: (ctx, x, y, size) => {
      // Draw explosion star
      ctx.fillStyle = '#f39c12'
      const mid = x + size / 2
      const midY = y + size / 2
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4
        const r = i % 2 === 0 ? size / 2 - 1 : size / 4
        const px = mid + Math.cos(angle) * r
        const py = midY + Math.sin(angle) * r
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    }
  },

  {
    id: 'shield_on_level',
    name: 'Level Shield',
    description: 'Gain brief invincibility on level up',
    category: UpgradeCategory.ABILITY,
    rarity: Rarity.UNCOMMON,
    maxStacks: 1,
    apply: (player) => {
      player.hasShieldOnLevel = true
    },
    canOffer: (player) => !player.hasShieldOnLevel,
    drawIcon: (ctx, x, y, size) => {
      ctx.fillStyle = '#3498db'
      // Draw shield shape
      ctx.beginPath()
      ctx.moveTo(x + size / 2, y + 1)
      ctx.lineTo(x + size - 1, y + size / 3)
      ctx.lineTo(x + size / 2, y + size - 1)
      ctx.lineTo(x + 1, y + size / 3)
      ctx.closePath()
      ctx.fill()
    }
  }
]

/**
 * All weapon and ability upgrades combined.
 */
export const allSpecialUpgrades: IUpgradeItem[] = [
  ...weaponUpgrades,
  ...abilityUpgrades
]
