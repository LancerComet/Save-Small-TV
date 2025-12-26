/**
 * Math floor.
 *
 * @param {number} num
 * @returns
 */
function floor (num: number) {
  return Math.floor(num)
}

/**
 * Generate random number.
 *
 * @returns
 */
function rand (radius: number = 1) {
  return Math.random() * radius
}

// 导出碰撞检测工具
export * from './collision'

export {
  floor,
  rand
}
