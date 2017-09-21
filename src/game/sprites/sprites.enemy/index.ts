import { Sprite22 } from './22'
import { Sprite33 } from './33'
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
  Sprite22,
  Sprite33,
  getRandomEnemy
}
