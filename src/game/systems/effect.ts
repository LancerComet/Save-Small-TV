import { Stage } from '../../core/stage'
import { BloodEffect, ExplosionEffect, ParticleBase } from '../sprites/effects'
import { ISystem } from './types'

class EffectSystem implements ISystem {
  // 使用统一的粒子数组管理所有粒子
  allParticles: ParticleBase[] = []

  /**
   * Spawn blood particles at position.
   */
  spawnBlood (x: number, y: number, count: number = 8) {
    const particles = BloodEffect.create(x, y, count, 3)
    this.allParticles.push(...particles)
  }

  /**
   * Spawn explosion particles at position.
   */
  spawnExplosion (x: number, y: number, count: number = 16) {
    const particles = ExplosionEffect.create(x, y, count, 3)
    this.allParticles.push(...particles)
  }

  update (stage: Stage, deltaTime: number) {
    const ctx = stage.context

    // 统一处理所有粒子
    for (let i = this.allParticles.length - 1; i >= 0; i--) {
      const particle = this.allParticles[i]
      if (!particle) { continue }

      particle.update(deltaTime)

      if (particle.isDead) {
        this.allParticles.splice(i, 1)
        continue
      }

      const [screenX, screenY] = stage.camera.toScreen(particle.x, particle.y)
      particle.draw(ctx, screenX, screenY)
    }
  }

  reset () {
    this.allParticles = []
  }
}

const effectSystem = new EffectSystem()

export {
  effectSystem
}
