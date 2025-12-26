import { SpriteDirection } from '../../../core/sprite/types.ts'

enum WeaponType {
  BULLET = 'BULLET',
  POWER_BULLET = 'POWER_BULLET',
  SHOTGUN = 'SHOTGUN',
  LASER = 'LASER',
  SRAW = 'SRAW' // 自动追踪导弹
}

interface IWeapon {
  x: number
  y: number
  direction: SpriteDirection
}

export {
  WeaponType
}

export type {
  IWeapon
}
