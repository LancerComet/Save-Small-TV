import { Stage } from '../../core/stage'
import { SmallTV } from '../sprites/player'
import { MAX_SPECIAL_ITEMS, WEAPON_DURATION } from '../sprites/special-items/config'
import { SpecialItemType } from '../sprites/special-items/types'
import { getRandomItem, ISpecialItem } from '../sprites/special-items/utils'
import { WeaponType } from '../sprites/weapon/types'

import { playerSystem } from './player'
import { ISystem } from './types'
import { weaponSystem } from './weapon'

class SpecialItemSystem implements ISystem {
  items: ISpecialItem[] = []

  /**
   * Drop an item at specified position.
   */
  dropItem (x: number, y: number) {
    if (this.items.length >= MAX_SPECIAL_ITEMS) { return }

    const item = getRandomItem()
    item.x = x
    item.y = y
    this.items.push(item)
  }

  /**
   * Check if player picks up an item.
   */
  detectPickup (item: ISpecialItem) {
    if (item.isPickedUp) {
      return
    }

    const startX = item.x
    const startY = item.y
    const endX = item.x + item.width
    const endY = item.y + item.height

    const players = playerSystem.allPlayers
    for (let i = 0, length = players.length; i < length; i++) {
      const player = players[i]
      if (!player || player.isDead) { continue }

      const pStartX = player.x
      const pStartY = player.y
      const pEndX = player.x + player.width
      const pEndY = player.y + player.height

      // Simple collision detection
      if (
        ((pStartX >= startX && pStartX <= endX) || (pEndX >= startX && pEndX <= endX) || (startX >= pStartX && startX <= pEndX)) &&
        ((pStartY >= startY && pStartY <= endY) || (pEndY >= startY && pEndY <= endY) || (startY >= pStartY && startY <= pEndY))
      ) {
        item.isPickedUp = true
        this.applyItemEffect(player, item)
      }
    }
  }

  /**
   * Apply item effect to player.
   */
  applyItemEffect (player: SmallTV, item: ISpecialItem) {
    switch (item.itemType) {
      case SpecialItemType.POWER_BULLET:
        player.switchWeapon(WeaponType.POWER_BULLET, WEAPON_DURATION, true)
        break
      case SpecialItemType.SHOTGUN:
        player.switchWeapon(WeaponType.SHOTGUN, WEAPON_DURATION, true)
        break
      case SpecialItemType.LASER:
        player.switchWeapon(WeaponType.LASER, WEAPON_DURATION, true)
        break
      case SpecialItemType.SRAW:
        player.switchWeapon(WeaponType.SRAW, WEAPON_DURATION, true)
        // 立即发射一次
        weaponSystem.resetSrawTimer()
        break
      case SpecialItemType.HEAL: {
        // 恢复 30% 最大生命值
        const healAmount = Math.ceil(player.maxHp * 0.3)
        player.hp = Math.min(player.hp + healAmount, player.maxHp)
        break
      }
      case SpecialItemType.SHIELD:
        // 激活护盾（临时无敌）
        player.activateShield(true)
        break
      case SpecialItemType.SPEED_UP:
        // 激活速度加成
        player.activateSpeedBuff(true)
        break
      default:
        break
    }
  }

  /**
   * Update item lifetime.
   */
  updateLifetime (item: ISpecialItem, deltaTime: number) {
    if (item.isPickedUp) {
      // Remove picked up items
      this.items.splice(this.items.indexOf(item), 1)
      return
    }

    item.lifeCountdown -= deltaTime
    if (item.lifeCountdown <= 0) {
      // Remove expired items
      this.items.splice(this.items.indexOf(item), 1)
    }
  }

  /**
   * Draw item on stage.
   */
  draw (stage: Stage, item: ISpecialItem) {
    item.updateTexture() // Update texture animation
    const [screenX, screenY] = stage.camera.toScreen(item.x, item.y)
    stage.context.drawImage(
      item.offscreen.canvasElement,
      screenX,
      screenY
    )
  }

  update (stage: Stage, deltaTime: number) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i]
      if (!item) { continue }

      this.detectPickup(item)
      this.updateLifetime(item, deltaTime)

      // Only draw if item still exists
      if (this.items.indexOf(item) >= 0) {
        this.draw(stage, item)
      }
    }
  }

  reset () {
    this.items = []
  }
}

const specialItemSystem = new SpecialItemSystem()

export {
  specialItemSystem
}
