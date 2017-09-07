import { SpriteBase } from './sprite.base'
import { bitmapToImageData } from '../utils/bitmap-to-image-data'

/**
 * SpriteMethods Class.
 * Define all public methods.
 *
 * @class SpriteMethods
 * @extends {SpriteBase}
 */
class SpriteMethods extends SpriteBase {
  /**
   * Convert current bitmaps to imageData.
   *
   * @returns {ImageData[]}
   * @memberof SpriteMethods
   */
  converToImageData (): ImageData[] {
    const bitmaps = this.bitmaps

    const result = []
    for (let i = 0, length = bitmaps.length; i < length; i++) {
      result.push(
        bitmapToImageData(this.width, this.height, bitmaps[i], this.colorMaps)
      )
    }

    return result
  }
}

export {
  SpriteMethods
}
