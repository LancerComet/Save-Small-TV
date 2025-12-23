// Cache for parsed hex colors
const hexCache: Record<string, number[]> = {}

/**
 * Hex color to rgb color (with caching).
 *
 * @param {string} hexColor
 * @returns {number[]}
 */
function hexToRgb (hexColor: string): number[] {
  // Check cache first
  if (hexCache[hexColor]) {
    return hexCache[hexColor]
  }

  let hex = hexColor.replace(/#/, '')

  let r: number, g: number, b: number

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else {
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
  }

  const result = [r, g, b]
  hexCache[hexColor] = result
  return result
}

export {
  hexToRgb
}
