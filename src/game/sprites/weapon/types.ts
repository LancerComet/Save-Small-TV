import { SpriteDirection } from '../../../core/sprite/types.ts'

enum WeaponType {
  BULLET = 'BULLET',
  POWER_BULLET = 'POWER_BULLET',
  SHOTGUN = 'SHOTGUN'
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
