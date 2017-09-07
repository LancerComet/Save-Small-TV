import { hexToRgb } from './hex-to-rgb'

/**
 * Create ImageData by using bitmap.
 *
 * @param {number} width
 * @param {number} height
 * @param {string[]} bitmap
 * @param {[key: string]: string} colorMap
 * @returns {ImageData}
 */
function bitmapToImageData (width: number, height: number, bitmap: string[], colorMap: {[key: string]: string}): ImageData {
  const arrayBuffer = new ArrayBuffer(width * height)
  const uint8Arr = new Uint8ClampedArray(arrayBuffer)

  // Convert bitmap to rgb pixel data.
  for (let i = 0, length = bitmap.length; i < length; i += 4) {
    const bit = bitmap[i]
    const hexColor = colorMap[bit]
    const rgbColor = hexToRgb(hexColor).concat(255)  // Push alpha into rgb color array.
    uint8Arr.set(rgbColor, i)
  }

  return new ImageData(uint8Arr, width, height)
}

export {
  bitmapToImageData
}
