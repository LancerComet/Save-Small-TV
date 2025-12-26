/**
 * Collision Utility - 碰撞检测工具
 * 
 * 统一管理所有碰撞检测逻辑，避免代码重复
 */

import { Sprite } from '../../core/sprite'

/**
 * 可碰撞对象接口
 */
interface ICollidable {
  x: number
  y: number
  width?: number
  height?: number
  paddingX?: number
  paddingY?: number
}

/**
 * 碰撞边界
 */
interface IBounds {
  left: number
  top: number
  right: number
  bottom: number
}

/**
 * 获取精灵的碰撞边界（考虑 padding）
 */
function getBounds (obj: ICollidable): IBounds {
  const paddingX = obj.paddingX ?? 0
  const paddingY = obj.paddingY ?? 0
  const width = obj.width ?? 0
  const height = obj.height ?? 0

  return {
    left: obj.x + paddingX,
    top: obj.y + paddingY,
    right: obj.x + width - paddingX,
    bottom: obj.y + height - paddingY
  }
}

/**
 * AABB 碰撞检测（两个矩形）
 */
function checkAABB (a: IBounds, b: IBounds): boolean {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  )
}

/**
 * 检测两个精灵是否碰撞
 */
function checkSpriteCollision (a: ICollidable, b: ICollidable): boolean {
  return checkAABB(getBounds(a), getBounds(b))
}

/**
 * 点与精灵碰撞检测
 */
function checkPointCollision (
  pointX: number,
  pointY: number,
  sprite: ICollidable
): boolean {
  const bounds = getBounds(sprite)
  return (
    pointX >= bounds.left &&
    pointX <= bounds.right &&
    pointY >= bounds.top &&
    pointY <= bounds.bottom
  )
}

/**
 * 检测精灵是否在边界外
 */
function isOutOfBounds (
  sprite: ICollidable,
  worldBounds: { left: number; right: number; top: number; bottom: number },
  buffer: number = 0
): boolean {
  return (
    sprite.x < worldBounds.left - buffer ||
    sprite.x > worldBounds.right + buffer ||
    sprite.y < worldBounds.top - buffer ||
    sprite.y > worldBounds.bottom + buffer
  )
}

/**
 * 计算两个精灵中心点距离
 */
function getDistance (a: ICollidable, b: ICollidable): number {
  const ax = a.x + (a.width ?? 0) / 2
  const ay = a.y + (a.height ?? 0) / 2
  const bx = b.x + (b.width ?? 0) / 2
  const by = b.y + (b.height ?? 0) / 2

  const dx = bx - ax
  const dy = by - ay
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * 计算从 a 到 b 的方向向量（单位向量）
 */
function getDirection (a: ICollidable, b: ICollidable): { x: number; y: number } {
  const ax = a.x + (a.width ?? 0) / 2
  const ay = a.y + (a.height ?? 0) / 2
  const bx = b.x + (b.width ?? 0) / 2
  const by = b.y + (b.height ?? 0) / 2

  const dx = bx - ax
  const dy = by - ay
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist === 0) return { x: 0, y: 0 }

  return {
    x: dx / dist,
    y: dy / dist
  }
}

export type { ICollidable, IBounds }
export {
  getBounds,
  checkAABB,
  checkSpriteCollision,
  checkPointCollision,
  isOutOfBounds,
  getDistance,
  getDirection
}
