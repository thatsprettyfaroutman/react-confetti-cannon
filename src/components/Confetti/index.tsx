import React, { useRef, useLayoutEffect, useEffect, useMemo, FC } from 'react'
import styled from 'styled-components'
import lerp from 'lerp'
import { range } from 'ramda'
import { Vector2 } from './Vector2'

type TLaunchPoint = () => { x: number; y: number; angle: number }
type TParticle = ReturnType<typeof createNewParticle>

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  pointer-events: none;
`

const uid = (() => {
  let count = 0
  return () => count++
})()

const createNewParticle = (launchPoint: TLaunchPoint, palette: string[]) => {
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

const GRAVITY = new Vector2(0, 0.1)

const drawParticle = (ctx: CanvasRenderingContext2D, particle: TParticle) => {
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

interface IConfettiProps {
  launchPoints: TLaunchPoint[]
  burstAmount?: number
  afterBurstAmount?: number
  palette?: string[]
  onEnd?: () => void
}

export const Confetti: FC<IConfettiProps> = ({
  launchPoints: launchPointsProp,
  burstAmount = 150,
  afterBurstAmount = 50,
  onEnd = () => {},
  palette = ['#25DEB3', '#00A8FF', '#EE295C', '#FFF027', '#66BEEC'],
  ...restProps
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const active = useRef(false)
  const particles = useRef<TParticle[]>([])
  const maxParticles = burstAmount + afterBurstAmount
  const launchPointsFallback = useMemo(
    () => [
      () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight,
        angle: 0,
      }),
    ],
    []
  )

  const launchPoints = launchPointsProp || launchPointsFallback

  useEffect(() => {
    launchPoints.forEach((launchPoint: any) => {
      range(0, burstAmount).forEach(() => {
        particles.current.push(createNewParticle(launchPoint, palette))
      })
    })
  }, [particles, launchPoints, burstAmount, palette])

  useLayoutEffect(() => {
    const canvas = ref && ref.current
    const ctx =
      ref &&
      ref.current &&
      ref.current.getContext &&
      ref.current.getContext('2d')

    if (!ctx) {
      return
    }
    active.current = true

    let spawnCount = particles.current.length
    const spawner = setInterval(() => {
      launchPoints.forEach((launchPoint: any) => {
        particles.current.push(createNewParticle(launchPoint, palette))
        spawnCount++
      })

      if (spawnCount > maxParticles) {
        clearInterval(spawner)
      }
    }, 1000 / 30)

    const cleaner = setInterval(() => {
      particles.current = particles.current.filter(
        (particle) => particle.position.y < window.innerHeight + 200
      )

      if (particles.current.length <= 0) {
        clearInterval(cleaner)
        onEnd()
      }
    }, 1000)

    const render = () => {
      if (!active.current) {
        return
      }

      // Empty the canvas
      // @ts-ignore
      // eslint-disable-next-line no-self-assign
      canvas.width = canvas.width

      for (let i = 0, n = particles.current.length; i < n; i++) {
        const particle = particles.current[i]

        if (particle.position.y > window.innerHeight + 200) {
          continue
        }

        particle.velocity.multiplyScalar(particle.friction)
        particle.rotationVelocity *= particle.friction

        particle.velocity.add(GRAVITY)
        particle.position.add(particle.velocity)
        particle.rotation += particle.rotationVelocity

        drawParticle(ctx, particle)
      }
      requestAnimationFrame(render)
    }
    render()

    return () => {
      active.current = false
      clearInterval(spawner)
      clearInterval(cleaner)
      particles.current = []
    }
  }, [ref, particles, maxParticles, launchPoints, onEnd])

  return (
    <Wrapper {...restProps}>
      <canvas ref={ref} width={window.innerWidth} height={window.innerHeight} />
    </Wrapper>
  )
}
