import { Stage } from '../../core/stage'
import { SmallTV } from '../sprites/player'
import { ISystem } from './types'

class PlayerSystem implements ISystem {
  instance: SmallTV | null = null

  get allPlayers () {
    return [this.instance]
  }

  keyControl (stage: Stage) {
    const player = this.instance
    if (!player) return

    const input = stage.input

    // WASD 或左摇杆控制移动
    if (input.moveLeft) {
      player.dirX = 'L'
    } else if (input.moveRight) {
      player.dirX = 'R'
    } else {
      player.dirX = null
    }

    if (input.moveUp) {
      player.dirY = 'T'
    } else if (input.moveDown) {
      player.dirY = 'B'
    } else {
      player.dirY = null
    }

    // 保存模拟量用于平滑移动（手柄摇杆）
    player.analogMoveX = input.analogMoveX
    player.analogMoveY = input.analogMoveY

    // 检测右摇杆是否有输入（无极方向射击）
    const rightStickX = input.analogShootX
    const rightStickY = input.analogShootY
    const rightStickMagnitude = Math.sqrt(rightStickX * rightStickX + rightStickY * rightStickY)

    if (rightStickMagnitude > 0.3) {
      // 使用右摇杆的无极方向射击
      player.shootAngle = Math.atan2(rightStickY, rightStickX)
      player.useAnalogShooting = true
      player.attacking = true

      // 同时设置一个大致方向用于显示（四方向纹理）
      if (Math.abs(rightStickX) > Math.abs(rightStickY)) {
        player.weaponDirection = rightStickX > 0 ? 'R' : 'L'
      } else {
        player.weaponDirection = rightStickY > 0 ? 'B' : 'T'
      }
      player.updateLookDirection()
    } else if (input.shootLeft || input.shootRight || input.shootUp || input.shootDown) {
      // 键盘四方向射击
      player.useAnalogShooting = false
      player.shootAngle = null

      if (input.shootLeft) {
        player.weaponDirection = 'L'
      } else if (input.shootRight) {
        player.weaponDirection = 'R'
      } else if (input.shootUp) {
        player.weaponDirection = 'T'
      } else if (input.shootDown) {
        player.weaponDirection = 'B'
      }
      player.updateLookDirection()
      player.attacking = true
    } else {
      player.attacking = false
      player.useAnalogShooting = false
    }
  }

  move (deltaTime: number) {
    const player = this.instance
    if (!player) return

    const speed = player.getEffectiveSpeed() * deltaTime

    // 如果有手柄模拟量输入，使用模拟量进行平滑移动
    if (player.analogMoveX !== 0 || player.analogMoveY !== 0) {
      player.x += player.analogMoveX * speed
      player.y += player.analogMoveY * speed
    } else {
      // 键盘输入使用方向
      if (player.dirX === 'L') { player.x -= speed }
      if (player.dirX === 'R') { player.x += speed }
      if (player.dirY === 'T') { player.y -= speed }
      if (player.dirY === 'B') { player.y += speed }
    }
  }

  positionLimit () {
    // 无缝地图：移除边界限制，玩家可以自由移动
    // 如需世界边界，可在此添加
  }

  /**
   * Update camera to follow player.
   */
  updateCamera (stage: Stage) {
    const player = this.instance
    if (!player) return
    stage.camera.follow(player.x, player.y, player.width, player.height)
  }

  draw (stage: Stage) {
    const player = this.instance
    if (!player) return

    // 受伤无敌状态闪烁（护盾不闪烁）
    if (player.invincibleTimer > 0 && !player.hasShield) {
      const blink = Math.floor(player.invincibleTimer * 10) % 2 === 0
      if (blink) {
        return // 闪烁时跳过绘制
      }
    }

    player.updateTexture() // Update texture animation
    const [screenX, screenY] = stage.camera.toScreen(player.x, player.y)

    // 护盾状态绘制蓝色光环
    if (player.hasShield) {
      const ctx = stage.context
      ctx.save()
      ctx.strokeStyle = '#00aaff'
      ctx.lineWidth = 2
      const centerX = screenX + player.width / 2
      const centerY = screenY + player.height / 2
      const radius = Math.max(player.width, player.height) / 2 + 3
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    stage.context.drawImage(
      player.offscreen.canvasElement, screenX, screenY
    )
  }

  update (stage: Stage, deltaTime: number) {
    this.keyControl(stage)
    this.move(deltaTime)
    this.positionLimit()
    this.updateCamera(stage) // 摄像机跟随玩家
    this.draw(stage)
  }

  reset (stage: Stage) {
    const player = new SmallTV()
    const [stageWidth, stageHeight] = stage.logicalSize
    player.x = stageWidth / 2 - player.width / 2
    player.y = stageHeight / 2 - player.height / 2
    this.instance = player
  }
}

const playerSystem = new PlayerSystem()

export {
  playerSystem
}
