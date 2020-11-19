import React, { useRef, useLayoutEffect, useEffect, useMemo, FC } from 'react'
import { range } from 'ramda'
import styled from 'styled-components'
import { IConfettiProps, IParticle } from './types'
import { createNewParticle, drawParticle } from './lib'
import { GRAVITY } from './consts'
import { Vector2 } from './Vector2'

export * from './Vector2'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`

export const Confetti: FC<IConfettiProps> = ({
  launchPoints: launchPointsProp,
  burstAmount = 150,
  afterBurstAmount = 50,
  gravity = new Vector2(0, 0.1),
  onEnd = () => {},
  palette = ['#25DEB3', '#00A8FF', '#EE295C', '#FFF027', '#66BEEC'],
  ...restProps
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const active = useRef(false)
  const particles = useRef<IParticle[]>([])
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
    const canvas = canvasRef && canvasRef.current
    const ctx = canvas && canvas.getContext && canvas.getContext('2d')

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

      if (canvas) {
        // Empty and resize the canvas
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

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
  }, [canvasRef, particles, maxParticles, launchPoints, onEnd, palette])

  return (
    <Wrapper {...restProps}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </Wrapper>
  )
}
