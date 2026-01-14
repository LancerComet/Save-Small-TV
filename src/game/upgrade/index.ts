export * from './types'
export * from './upgrade-pool'
export * from './defines/stat-upgrades'
export * from './defines/ability-upgrades'

// Initialize the upgrade pool with all upgrades
import { upgradePool } from './upgrade-pool'
import { statUpgrades } from './defines/stat-upgrades'
import { allSpecialUpgrades } from './defines/ability-upgrades'

// Register all upgrades
upgradePool.registerAll(statUpgrades)
upgradePool.registerAll(allSpecialUpgrades)
