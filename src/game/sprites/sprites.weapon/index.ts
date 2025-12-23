import { Weapon } from './base.weapon'
import { Bullet } from './weapon.bullet'
import { PowerBullet } from './weapon.power-bullet'
import { ShotgunPellet, Shotgun } from './weapon.shotgun'

/**
 * 武器类型枚举
 */
enum WeaponType {
  BULLET = 'BULLET',
  POWER_BULLET = 'POWER_BULLET',
  SHOTGUN = 'SHOTGUN'
}

/**
 * 武器类型到类的映射
 */
const WEAPON_CLASS_MAP = {
  [WeaponType.BULLET]: Bullet,
  [WeaponType.POWER_BULLET]: PowerBullet,
  [WeaponType.SHOTGUN]: null  // Shotgun 特殊处理，使用 Shotgun.createPellets
}

export {
  Bullet,
  PowerBullet,
  ShotgunPellet,
  Shotgun,
  Weapon,
  WeaponType,
  WEAPON_CLASS_MAP
}
