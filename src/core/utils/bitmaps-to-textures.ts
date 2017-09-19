import { bitmapToImageData } from './bitmap-to-image-data'

/**
 * Transform bitmaps to textures.
 *
 * @param {number} width
 * @param {number} height
 * @param {TBitmaps} bitmaps
 * @param {TColorMap} colorMap
 * @returns {TTextures}
 */
function bitmapsToTextures (width: number, height: number, bitmaps: TBitmaps, colorMap: TColorMap): TTextures {
  const result: TTextures = []

  for (let i = 0, length = bitmaps.length; i < length; i++) {
    const bitmap = bitmaps[i]
    const imageData = bitmapToImageData(width, height, bitmap, colorMap)
    result.push(imageData)
  }

  return result
}

export {
  bitmapsToTextures
}
