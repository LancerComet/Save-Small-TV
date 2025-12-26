import { Enemy } from './base'
import { Sprite22 } from './22'
import { Sprite33 } from './33'
import { FireballEnemy } from './fireball'
import { UncleEnemy } from './boss'
import { floor, rand } from '../../utils'

const ENEMY_TYPES = [
  Sprite22,
  Sprite33
]

/**
 * Get random Enemy,
 *
 * @returns
 */
function getRandomEnemy () {
  return ENEMY_TYPES[floor(rand() * ENEMY_TYPES.length)]
}

export {
  Enemy,
  Sprite22,
  Sprite33,
  FireballEnemy,
  UncleEnemy, // 新的公务员大叔 Boss
  getRandomEnemy
}
