import { hexToRgb } from './hex-to-rgb'

/**
 * Transform single bitmap data to an imageData object.
 *
 * @param {number} width
 * @param {number} height
 * @param {TBitmap} bitmap
 * @param {TColorMap} colorMap
 * @returns {ImageData}
 */
function bitmapToImageData (width: number, height: number, bitmap: TBitmap, colorMap: TColorMap): ImageData {
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
