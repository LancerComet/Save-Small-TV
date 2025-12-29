import { Stage } from '../../core/stage'
import { LaserItem } from '../sprites/special-items/defines/laser'
import { PowerBulletItem } from '../sprites/special-items/defines/power-bullet'
import { ShotgunItem } from '../sprites/special-items/defines/shotgun'
import { SRAWItem } from '../sprites/special-items/defines/sraw'
import { Bullet } from '../sprites/weapon/defines/bullet'
import { WeaponType } from '../sprites/weapon/types'
import { GameState } from '../state'
import { playerSystem } from './player'
import { ISystem } from './types'

class UISystem implements ISystem {
  // 缓存道具实例用于获取纹理
  bulletIcon: Bullet | null = null
  powerBulletItemIcon: PowerBulletItem | null = null
  shotgunItemIcon: ShotgunItem | null = null
  laserItemIcon: LaserItem | null = null
  srawItemIcon: SRAWItem | null = null

  getItemSprite (type: WeaponType) {
    if (type === WeaponType.POWER_BULLET) {
      if (!this.powerBulletItemIcon) {
        this.powerBulletItemIcon = new PowerBulletItem()
        this.powerBulletItemIcon.updateTexture()
      }
      return this.powerBulletItemIcon
    } else if (type === WeaponType.SHOTGUN) {
      if (!this.shotgunItemIcon) {
        this.shotgunItemIcon = new ShotgunItem()
        this.shotgunItemIcon.updateTexture()
      }
      return this.shotgunItemIcon
    } else if (type === WeaponType.LASER) {
      if (!this.laserItemIcon) {
        this.laserItemIcon = new LaserItem()
        this.laserItemIcon.updateTexture()
      }
      return this.laserItemIcon
    } else if (type === WeaponType.SRAW) {
      if (!this.srawItemIcon) {
        this.srawItemIcon = new SRAWItem()
        this.srawItemIcon.updateTexture()
      }
      return this.srawItemIcon
    } else {
      // 普通子弹用子弹图标
      if (!this.bulletIcon) {
        this.bulletIcon = new Bullet({ x: 0, y: 0, direction: 'R' })
        this.bulletIcon.updateTexture()
      }
      return this.bulletIcon
    }
  }

  printTitle (stage: Stage) {
    // 左上角版本信息
    stage.printText('Save small TV 0.5', 4, 10, 6)
  }

  printTimer (stage: Stage) {
    // 屏幕上方正中间显示游戏时间
    const [stageWidth] = stage.logicalSize
    const totalSeconds = Math.floor(GameState.gameTime)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    const fontSize = 8
    const textWidth = stage.measureText(timeText, fontSize)
    const x = (stageWidth - textWidth) / 2
    const y = 10
    stage.printText(timeText, x, y, fontSize)
  }

  printScore (stage: Stage) {
    // 右上角游戏信息
    const [stageWidth] = stage.logicalSize
    const text = `Score: ${GameState.score}  Level: ${GameState.level}`
    const textWidth = stage.measureText(text, 6)
    stage.printText(text, stageWidth - textWidth - 4, 10, 6)
  }

  printWeaponInfo (stage: Stage) {
    const player = playerSystem.instance
    if (!player) {
      return
    }

    const weaponType = player.currentWeaponType
    if (weaponType === WeaponType.BULLET) {
      return
    }

    const [stageWidth, stageHeight] = stage.logicalSize

    // 获取当前武器对应的道具图标
    const itemSprite = this.getItemSprite(weaponType)

    // 图标尺寸（special item 是完整 8x8，保持原始大小）
    const srcSize = 8
    const iconSize = 10
    const smallFontSize = 5
    const gap = 2

    // 固定总高度
    const totalHeight = iconSize + gap + smallFontSize

    // 整体位置（左下角）
    const baseX = 4
    const baseY = stageHeight - totalHeight - 4

    // 图标位置
    const iconX = baseX
    const iconY = baseY

    // 绘制道具图标
    stage.context.drawImage(
      itemSprite.offscreen.canvasElement,
      0, 0, srcSize, srcSize,
      iconX, iconY, iconSize, iconSize
    )

    // 如果有武器持续时间，显示倒计时
    if (player.weaponDuration > 0) {
      const countdown = Math.ceil(player.weaponDuration).toString()
      const textWidth = stage.measureText(countdown, smallFontSize)
      const textX = iconX + (iconSize - textWidth) / 2
      const textY = iconY + iconSize + gap + smallFontSize
      stage.printText(countdown, textX, textY, smallFontSize)
    }
  }

  printHPBar (stage: Stage) {
    const player = playerSystem.instance
    if (!player) { return }

    // 血条尺寸
    const barWidth = 30
    const barHeight = 4
    const barX = 4
    const barY = 18 // 在版本信息下方

    // 计算血量百分比
    const hpPercent = Math.max(0, player.hp / player.maxHp)

    const ctx = stage.context

    // 背景（深红色）
    ctx.fillStyle = '#4e4a4e'
    ctx.fillRect(barX, barY, barWidth, barHeight)

    // 血条颜色（根据血量变化）
    let barColor = '#6abe30' // 绿色 (>50%)
    if (hpPercent <= 0.25) {
      barColor = '#ac3232' // 红色 (<=25%)
    } else if (hpPercent <= 0.5) {
      barColor = '#df7126' // 橙色 (<=50%)
    }

    // 当前血量
    ctx.fillStyle = barColor
    ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight)

    // 边框
    ctx.strokeStyle = '#deeed6'
    ctx.lineWidth = 1
    ctx.strokeRect(barX + 0.5, barY + 0.5, barWidth - 1, barHeight - 1)

    // 无敌状态闪烁效果
    if (player.isInvincible) {
      // 每隔一段时间闪烁
      const blink = Math.floor(player.invincibleTimer * 10) % 2 === 0
      if (blink) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight)
      }
    }
  }

  printBuffIndicators (stage: Stage) {
    const player = playerSystem.instance
    if (!player) return

    const ctx = stage.context
    const indicatorSize = 6
    const gap = 2
    let offsetX = 4
    const baseY = 24 // 在血条下方

    // 护盾状态
    if (player.hasShield) {
      // 绘制护盾图标（蓝色圆形）
      ctx.fillStyle = '#00aaff'
      ctx.beginPath()
      ctx.arc(offsetX + indicatorSize / 2, baseY + indicatorSize / 2, indicatorSize / 2, 0, Math.PI * 2)
      ctx.fill()
      // 倒计时
      const countdown = Math.ceil(player.shieldTimer).toString()
      stage.printText(countdown, offsetX + indicatorSize + 1, baseY + indicatorSize, 4)
      offsetX += indicatorSize + stage.measureText(countdown, 4) + gap + 4
    }

    // 加速状态
    if (player.hasSpeedBuff) {
      // 绘制加速图标（黄色闪电）
      ctx.fillStyle = '#ffff00'
      ctx.beginPath()
      ctx.moveTo(offsetX + indicatorSize / 2, baseY)
      ctx.lineTo(offsetX + 1, baseY + indicatorSize / 2)
      ctx.lineTo(offsetX + indicatorSize / 2 - 1, baseY + indicatorSize / 2)
      ctx.lineTo(offsetX + indicatorSize / 2 - 2, baseY + indicatorSize)
      ctx.lineTo(offsetX + indicatorSize - 1, baseY + indicatorSize / 2 - 1)
      ctx.lineTo(offsetX + indicatorSize / 2, baseY + indicatorSize / 2 - 1)
      ctx.closePath()
      ctx.fill()
      // 倒计时
      const countdown = Math.ceil(player.speedBuffTimer).toString()
      stage.printText(countdown, offsetX + indicatorSize + 1, baseY + indicatorSize, 4)
    }
  }

  printGameOver (stage: Stage) {
    const [stageWidth, stageHeight] = stage.logicalSize
    const fontSize = 8
    const lineHeight = 12
    const lines = [
      'Gmae over young man!!',
      `Your score: ${GameState.score}`,
      'Press ENTER to restart'
    ]

    // 计算总高度，垂直居中
    const totalHeight = lines.length * lineHeight
    const startY = (stageHeight - totalHeight) / 2 + fontSize

    for (let i = 0; i < lines.length; i++) {
      const text = lines[i]
      const textWidth = stage.measureText(text, fontSize)
      const x = (stageWidth - textWidth) / 2
      const y = startY + i * lineHeight
      stage.printText(text, x, y, fontSize)
    }
  }

  update (stage: Stage, deltaTime: number) {
    this.printTitle(stage)
    this.printTimer(stage)
    this.printScore(stage)
    this.printHPBar(stage)
    this.printBuffIndicators(stage)
    this.printWeaponInfo(stage)
  }
}

const uiSystem = new UISystem()

export {
  uiSystem
}
