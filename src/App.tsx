import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import lerp from 'lerp'
import { Confetti } from './components/Confetti'

const AppStyled = styled.div`
  padding: 2rem;
`

export const App = () => {
  const [update, setUpdate] = useState(0)

  const screenSizeMultiplier = window.innerWidth / 800

  const burstAmount = Math.floor(
    lerp(100, 150, Math.random() * screenSizeMultiplier)
  )
  const afterBurstAmount = Math.floor(
    lerp(40, 120, Math.random() * screenSizeMultiplier)
  )

  const launchPoints = useMemo(
    () => [
      () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.9,
        angle: 0.6,
      }),
      () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.9,
        angle: -0.6,
      }),
      () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.9,
        angle: 0,
      }),
    ],
    []
  )

  return (
    <AppStyled>
      <Confetti
        key={update}
        launchPoints={launchPoints}
        // burstAmount={burstAmount}
        // afterBurstAmount={afterBurstAmount}
        onEnd={() => {
          setUpdate(update + 1)
        }}
      />
      Particles: {burstAmount} + {afterBurstAmount}
    </AppStyled>
  )
}
