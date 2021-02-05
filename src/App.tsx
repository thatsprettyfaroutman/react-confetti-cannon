import React, { useState, useMemo } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Confetti } from './components/Confetti'
import { lerp } from './components/Confetti/lib'

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    background-color: #0B1438;
  }
`

const AppStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #0f1b4d; */
  width: 30rem;
  height: 40rem;
  border-radius: 1rem;
`

const Foreground = styled.div`
  position: relative;
  /* background-color: #142048; */
  width: 20rem;
  height: 30rem;
  border-radius: 1rem;
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
      <GlobalStyle />
      <Background>
        <Confetti
          key={update}
          launchPoints={launchPoints}
          burstAmount={burstAmount}
          afterBurstAmount={afterBurstAmount}
          onEnd={() => {
            setUpdate(update + 1)
          }}
        />
        <Foreground />
      </Background>
    </AppStyled>
  )
}
