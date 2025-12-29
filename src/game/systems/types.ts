import { Stage } from '../../core/stage'

interface ISystem {
  update (stage: Stage, deltaTime: number): void
}

export type {
  ISystem
}
