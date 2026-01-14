/**
 * Stat Upgrades
 * Basic attribute upgrades (HP, Speed, Damage, etc.)
 */

import { IUpgradeItem, UpgradeCategory } from '../types'
import { Rarity } from '../../menu/types'
import { SmallTV } from '../../sprites/player'

/**
 * Helper to create stat upgrades easily.
 */
function createStatUpgrade (
  id: string,
  name: string,
  description: string,
  rarity: Rarity,
  maxStacks: number,
  applyFn: (player: SmallTV) => void,
  iconColor: string = '#ffffff'
): IUpgradeItem {
  return {
    id,
    name,
    description,
    category: UpgradeCategory.STAT,
    rarity,
    maxStacks,
    apply: applyFn,
    drawIcon: (ctx, x, y, size) => {
      ctx.fillStyle = iconColor
      ctx.fillRect(x, y, size, size)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, size, size)
    }
  }
}

/**
 * All stat upgrades.
 */
export const statUpgrades: IUpgradeItem[] = [
  // HP Upgrades
  createStatUpgrade(
    'hp_boost_small',
    'Vitality I',
    '+20 Max HP',
    Rarity.COMMON,
    5,
    (player) => {
      player.maxHp += 20
      player.hp += 20 // Also heal
    },
    '#e74c3c'
  ),

  createStatUpgrade(
    'hp_boost_medium',
    'Vitality II',
    '+40 Max HP',
    Rarity.UNCOMMON,
    3,
    (player) => {
      player.maxHp += 40
      player.hp += 40
    },
    '#c0392b'
  ),

  createStatUpgrade(
    'hp_boost_large',
    'Vitality III',
    '+80 Max HP',
    Rarity.RARE,
    2,
    (player) => {
      player.maxHp += 80
      player.hp += 80
    },
    '#922b21'
  ),

  // Speed Upgrades
  createStatUpgrade(
    'speed_boost_small',
    'Swift Feet I',
    '+10% Movement Speed',
    Rarity.COMMON,
    5,
    (player) => {
      player.speedMultiplier = (player.speedMultiplier || 1) + 0.1
    },
    '#3498db'
  ),

  createStatUpgrade(
    'speed_boost_medium',
    'Swift Feet II',
    '+20% Movement Speed',
    Rarity.UNCOMMON,
    3,
    (player) => {
      player.speedMultiplier = (player.speedMultiplier || 1) + 0.2
    },
    '#2980b9'
  ),

  // Damage Upgrades
  createStatUpgrade(
    'damage_boost_small',
    'Power I',
    '+15% Damage',
    Rarity.COMMON,
    5,
    (player) => {
      player.damageMultiplier = (player.damageMultiplier || 1) + 0.15
    },
    '#e67e22'
  ),

  createStatUpgrade(
    'damage_boost_medium',
    'Power II',
    '+25% Damage',
    Rarity.UNCOMMON,
    3,
    (player) => {
      player.damageMultiplier = (player.damageMultiplier || 1) + 0.25
    },
    '#d35400'
  ),

  createStatUpgrade(
    'damage_boost_large',
    'Power III',
    '+40% Damage',
    Rarity.RARE,
    2,
    (player) => {
      player.damageMultiplier = (player.damageMultiplier || 1) + 0.4
    },
    '#a04000'
  ),

  // Fire Rate Upgrades
  createStatUpgrade(
    'fire_rate_small',
    'Quick Draw I',
    '+15% Fire Rate',
    Rarity.COMMON,
    5,
    (player) => {
      player.fireRateMultiplier = (player.fireRateMultiplier || 1) + 0.15
    },
    '#9b59b6'
  ),

  createStatUpgrade(
    'fire_rate_medium',
    'Quick Draw II',
    '+25% Fire Rate',
    Rarity.UNCOMMON,
    3,
    (player) => {
      player.fireRateMultiplier = (player.fireRateMultiplier || 1) + 0.25
    },
    '#8e44ad'
  ),

  // Defense Upgrades
  createStatUpgrade(
    'armor_small',
    'Iron Skin I',
    '+5 Armor (damage reduction)',
    Rarity.COMMON,
    5,
    (player) => {
      player.armor = (player.armor || 0) + 5
    },
    '#7f8c8d'
  ),

  createStatUpgrade(
    'armor_medium',
    'Iron Skin II',
    '+10 Armor (damage reduction)',
    Rarity.UNCOMMON,
    3,
    (player) => {
      player.armor = (player.armor || 0) + 10
    },
    '#95a5a6'
  ),

  // HP Regen
  createStatUpgrade(
    'hp_regen_small',
    'Regeneration I',
    '+1 HP per second',
    Rarity.UNCOMMON,
    3,
    (player) => {
      player.hpRegen = (player.hpRegen || 0) + 1
    },
    '#2ecc71'
  ),

  createStatUpgrade(
    'hp_regen_medium',
    'Regeneration II',
    '+2 HP per second',
    Rarity.RARE,
    2,
    (player) => {
      player.hpRegen = (player.hpRegen || 0) + 2
    },
    '#27ae60'
  ),

  // XP Bonus
  createStatUpgrade(
    'xp_boost',
    'Quick Learner',
    '+25% XP Gain',
    Rarity.UNCOMMON,
    3,
    (player) => {
      player.xpMultiplier = (player.xpMultiplier || 1) + 0.25
    },
    '#f1c40f'
  ),

  // Critical Hit
  createStatUpgrade(
    'crit_chance',
    'Precision',
    '+10% Critical Chance',
    Rarity.RARE,
    3,
    (player) => {
      player.critChance = (player.critChance || 0) + 0.1
    },
    '#e74c3c'
  ),

  createStatUpgrade(
    'crit_damage',
    'Brutality',
    '+50% Critical Damage',
    Rarity.RARE,
    2,
    (player) => {
      player.critDamage = (player.critDamage || 1.5) + 0.5
    },
    '#c0392b'
  ),

  // Healing
  createStatUpgrade(
    'heal_instant',
    'Medkit',
    'Restore 50% HP',
    Rarity.COMMON,
    -1, // Unlimited
    (player) => {
      const healAmount = Math.floor(player.maxHp * 0.5)
      player.hp = Math.min(player.hp + healAmount, player.maxHp)
    },
    '#1abc9c'
  ),

  createStatUpgrade(
    'heal_full',
    'Full Restore',
    'Fully restore HP',
    Rarity.RARE,
    -1,
    (player) => {
      player.hp = player.maxHp
    },
    '#16a085'
  )
]
