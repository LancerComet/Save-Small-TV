/**
 * Hex color to rgb color.
 *
 * @param {string} hexColor
 * @returns {number[]}
 */
function hexToRgb (hexColor: string): number[] {
  hexColor = hexColor.replace(/#/, '')

  const hexString = ['', '', '']

  let index = 0
  while (index < 3) {
    if (hexColor.length === 3) {
      hexString[index] = hexColor[index]
    } else if (hexColor.length === 6) {
      hexString[index] = hexColor.slice(index * 2, (index + 1) * 2)
    }
    index++
  }

  return hexString.map(item => parseInt(item, 16))
}

export {
  hexToRgb
}
