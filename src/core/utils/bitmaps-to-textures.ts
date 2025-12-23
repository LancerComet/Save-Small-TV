import { SpriteColorMap, SpriteBitmaps, SpriteTextures } from '../sprite/types.ts'
import { bitmapToImageData } from './bitmap-to-image-data'

/**
 * Transform bitmaps to textures.
 *
 * @param {number} width
 * @param {number} height
 * @param {SpriteBitmaps} bitmaps
 * @param {SpriteColorMap} colorMap
 * @returns {SpriteTextures}
 */
function bitmapsToTextures (width: number, height: number, bitmaps: SpriteBitmaps, colorMap: SpriteColorMap): SpriteTextures {
  const result: SpriteTextures = []

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
