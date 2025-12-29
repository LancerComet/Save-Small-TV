interface Star {
  x: number
  y: number
  size: number
  brightness: number
  layer: number // 0 = far (slow), 1 = mid, 2 = near (fast)
}

// Star colors for different brightness levels
const STAR_COLORS = [
  '#666666', // dim
  '#888888',
  '#aaaaaa',
  '#cccccc',
  '#ffffff' // bright
]

// Parallax speed multipliers for each layer
const LAYER_SPEEDS = [0.1, 0.3, 0.6]

// Star density per layer
const STARS_PER_LAYER = [80, 40, 20]

/**
 * Space background with parallax stars.
 * Creates a sense of movement in infinite space.
 */
class SpaceBackground {
  private stars: Star[] = []
  private viewportWidth: number = 0
  private viewportHeight: number = 0
  private initialized: boolean = false

  // Buffer zone around viewport for seamless scrolling
  private readonly BUFFER = 100

  /**
   * Initialize the background with stars.
   * Only generates stars on first call, subsequent calls just update viewport.
   */
  init (width: number, height: number) {
    this.viewportWidth = width
    this.viewportHeight = height

    // Only generate stars once
    if (this.initialized) {
      return
    }

    this.stars = []

    // Generate stars for each layer (use large fixed area)
    const maxWidth = 1920
    const maxHeight = 1080
    for (let layer = 0; layer < 3; layer++) {
      const count = STARS_PER_LAYER[layer] * 4 // More stars for larger area
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random() * (maxWidth + this.BUFFER * 2) - this.BUFFER,
          y: Math.random() * (maxHeight + this.BUFFER * 2) - this.BUFFER,
          size: layer === 2 ? 2 : 1, // Near stars are bigger
          brightness: Math.floor(Math.random() * STAR_COLORS.length),
          layer
        })
      }
    }

    this.initialized = true
  }

  /**
   * Draw the starfield background.
   * Uses camera position for parallax effect.
   */
  draw (ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    if (!this.initialized) return

    const w = this.viewportWidth
    const h = this.viewportHeight

    for (const star of this.stars) {
      const speed = LAYER_SPEEDS[star.layer]

      // Calculate screen position with parallax
      // Wrap around for seamless infinite scrolling
      let screenX = star.x - (cameraX * speed) % (w + this.BUFFER * 2)
      let screenY = star.y - (cameraY * speed) % (h + this.BUFFER * 2)

      // Wrap coordinates
      while (screenX < -this.BUFFER) screenX += w + this.BUFFER * 2
      while (screenX > w + this.BUFFER) screenX -= w + this.BUFFER * 2
      while (screenY < -this.BUFFER) screenY += h + this.BUFFER * 2
      while (screenY > h + this.BUFFER) screenY -= h + this.BUFFER * 2

      // Only draw if on screen
      if (screenX >= 0 && screenX < w && screenY >= 0 && screenY < h) {
        ctx.fillStyle = STAR_COLORS[star.brightness]
        ctx.fillRect(Math.floor(screenX), Math.floor(screenY), star.size, star.size)
      }
    }
  }

  /**
   * Add occasional twinkling effect.
   */
  update () {
    // Randomly change star brightness for twinkling
    if (Math.random() < 0.1) {
      const randomStar = this.stars[Math.floor(Math.random() * this.stars.length)]
      if (randomStar) {
        randomStar.brightness = Math.floor(Math.random() * STAR_COLORS.length)
      }
    }
  }
}

// Singleton instance
const spaceBackground = new SpaceBackground()

export {
  spaceBackground,
  SpaceBackground
}
