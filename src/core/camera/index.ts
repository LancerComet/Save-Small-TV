/**
 * Camera class.
 * Handles world-to-screen coordinate transformation.
 *
 * @class Camera
 */
class Camera {
  /**
   * Camera position in world coordinates.
   * This represents the top-left corner of the viewport.
   */
  x: number = 0
  y: number = 0

  /**
   * Viewport size (screen size).
   */
  viewportWidth: number = 0
  viewportHeight: number = 0

  /**
   * Set viewport size.
   *
   * @param {number} width
   * @param {number} height
   * @memberof Camera
   */
  setViewport (width: number, height: number) {
    this.viewportWidth = width
    this.viewportHeight = height
  }

  /**
   * Follow a target (usually the player).
   * Centers the camera on the target.
   *
   * @param {number} targetX - Target's world X coordinate
   * @param {number} targetY - Target's world Y coordinate
   * @param {number} targetWidth - Target's width
   * @param {number} targetHeight - Target's height
   * @memberof Camera
   */
  follow (targetX: number, targetY: number, targetWidth: number = 0, targetHeight: number = 0) {
    // Center the camera on the target
    this.x = targetX + targetWidth / 2 - this.viewportWidth / 2
    this.y = targetY + targetHeight / 2 - this.viewportHeight / 2
  }

  /**
   * Convert world coordinates to screen coordinates.
   *
   * @param {number} worldX
   * @param {number} worldY
   * @returns {[number, number]} Screen coordinates [screenX, screenY]
   * @memberof Camera
   */
  toScreen (worldX: number, worldY: number): [number, number] {
    return [worldX - this.x, worldY - this.y]
  }

  /**
   * Convert screen coordinates to world coordinates.
   *
   * @param {number} screenX
   * @param {number} screenY
   * @returns {[number, number]} World coordinates [worldX, worldY]
   * @memberof Camera
   */
  toWorld (screenX: number, screenY: number): [number, number] {
    return [screenX + this.x, screenY + this.y]
  }

  /**
   * Check if a world position is visible on screen.
   *
   * @param {number} worldX
   * @param {number} worldY
   * @param {number} width
   * @param {number} height
   * @returns {boolean}
   * @memberof Camera
   */
  isVisible (worldX: number, worldY: number, width: number = 0, height: number = 0): boolean {
    const [screenX, screenY] = this.toScreen(worldX, worldY)
    return (
      screenX + width >= 0 &&
      screenX <= this.viewportWidth &&
      screenY + height >= 0 &&
      screenY <= this.viewportHeight
    )
  }

  /**
   * Get the world bounds of the current viewport.
   *
   * @returns {{ left: number, right: number, top: number, bottom: number }}
   * @memberof Camera
   */
  getWorldBounds (): { left: number, right: number, top: number, bottom: number } {
    return {
      left: this.x,
      right: this.x + this.viewportWidth,
      top: this.y,
      bottom: this.y + this.viewportHeight
    }
  }
}

export { Camera }
