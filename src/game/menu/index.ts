export * from './types'
export * from './base'
export * from './menu-manager'
export * from './defines/upgrade-menu'
export * from './defines/pause-menu'

// Register menus with manager
import { menuManager } from './menu-manager'
import { upgradeMenu } from './defines/upgrade-menu'
import { pauseMenu } from './defines/pause-menu'

menuManager.register(upgradeMenu)
menuManager.register(pauseMenu)
