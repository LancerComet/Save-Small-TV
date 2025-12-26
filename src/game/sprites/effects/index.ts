import { ParticleBase, ParticleFactory } from './base'
import type { IParticleConfig } from './base'
import { BloodParticle, BloodEffect } from './effect.blood'
import { ExplosionParticle, ExplosionEffect } from './effect.explosion'

export type { IParticleConfig }
export {
  // 基类
  ParticleBase,
  ParticleFactory,
  // 血液粒子
  BloodParticle,
  BloodEffect,
  // 爆炸粒子
  ExplosionParticle,
  ExplosionEffect
}
