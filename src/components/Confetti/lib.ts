import lerp from 'lerp'
import { TLaunchPoint, IParticle } from './types'
import { Vector2 } from './Vector2'

export const uid = (() => {
  let count = 0
  return () => count++
})()

export const createNewParticle = (
  launchPoint: TLaunchPoint,
  palette: string[]
) => {
  const id = uid()
  const { x, y, angle } = launchPoint()
  const correctedAngle =
    angle + Math.PI + lerp(-Math.PI / 15, Math.PI / 15, Math.random())

  const p = window.innerWidth / 800
  const initialVelocity = lerp(10, 20, Math.random() * p)

  return {
    id,
    width: lerp(4, 40, Math.random()),
    height: lerp(4, 20, Math.random()),
    rotation: Math.random() * Math.PI,
    rotationVelocity: lerp(-1, 1, Math.random()),
    position: new Vector2(x, y),
    velocity: new Vector2(
      Math.sin(correctedAngle) * initialVelocity,
      Math.cos(correctedAngle) * initialVelocity
    ),
    friction: lerp(0.97, 0.99, Math.random()),
    color: palette[Math.floor(Math.random() * palette.length)],
  }
}

export const drawParticle = (
  ctx: CanvasRenderingContext2D,
  particle: IParticle
) => {
  // first save the untranslated/unrotated context

  if (!ctx) {
    return
  }

  const { position, width, height, rotation, color } = particle
  const { x, y } = position

  ctx.save()

  ctx.beginPath()
  // move the rotation point to the center of the rect
  ctx.translate(x + width / 2, y + height / 2)
  // rotate the rect
  ctx.rotate(rotation)

  // draw the rect on the transformed context
  // Note: after transforming [0,0] is visually [x,y]
  //       so the rect needs to be offset accordingly when drawn
  ctx.rect(-width / 2, -height / 2, width, height)

  ctx.fillStyle = color
  ctx.fill()

  // restore the context to its untranslated/not-rotated state
  ctx.restore()
}
