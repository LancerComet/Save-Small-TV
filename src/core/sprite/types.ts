/**
 * Define type for bitmap.
 */
type SpriteBitmap = string[]

/**
 * Define type for bitmap.
 */
type SpriteBitmaps = SpriteBitmap[]

/**
 * Define type for color map.
 */
type SpriteColorMap = Record<string, string>

/**
 * Define type for texture.
 */
type SpriteTextures = Array<ImageData>

/**
 * Define type for direction.
 */
type SpriteDirection = 'L' | 'R' | 'T' | 'B'

export type {
  SpriteBitmap,
  SpriteBitmaps,
  SpriteColorMap,
  SpriteTextures,
  SpriteDirection
}
