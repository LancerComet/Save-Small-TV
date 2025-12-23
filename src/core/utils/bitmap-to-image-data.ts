import { SpriteColorMap, SpriteBitmap } from '../sprite/types.ts'
import { hexToRgb } from './hex-to-rgb'

/**
 * Transform single bitmap data to an imageData object.
 *
 * @param {number} width
 * @param {number} height
 * @param {SpriteBitmap} bitmap
 * @param {SpriteColorMap} colorMap
 * @returns {ImageData}
 */
function bitmapToImageData (width: number, height: number, bitmap: SpriteBitmap, colorMap: SpriteColorMap): ImageData {
  const arrayBuffer = new ArrayBuffer(bitmap.length * 4)
  const uint8Arr = new Uint8ClampedArray(arrayBuffer)

  // Convert bitmap to rgb pixel data.
  for (let i = 0, length = bitmap.length; i < length; i++) {
    const bit = bitmap[i]
    const hexColor = colorMap[bit]
    let rgbColor = []

    // Check if it is Transparent color.
    if (hexColor === 'transparent') {
      rgbColor = [0, 0, 0, 0]
    } else {
      rgbColor = hexToRgb(hexColor).concat(255) // Push alpha into rgb color array.
    }

    uint8Arr.set(rgbColor, i * 4)
  }

  return new ImageData(uint8Arr, width, height)
}

export {
  bitmapToImageData
}
