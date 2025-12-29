/**
 * 投射物接口（子弹、火球等）
 */
interface IProjectile {
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  lifetime?: number
  update (deltaTime: number): void
  draw (ctx: CanvasRenderingContext2D): void
  isOutOfBounds (width: number, height: number): boolean
}

/**
 * 追踪类投射物.
 */
interface IHomingProjectile extends IProjectile {
  /**
   * 设置投射物的追踪目标, 传入 null 应当取消追踪.
   */
  setTarget: (target: { x: number; y: number } | null) => void
}

export type {
  IProjectile,
  IHomingProjectile
}
