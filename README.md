🎉🎉🎉 CONFETTI 🎉🎉🎉

```
yarn install react-confetti-cannon
```

```javascript
const ConfettiLayer = () => {
  const launchPoints = useMemo(
    () => [
      () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.9,
        angle: 0,
      }),
    ],
    []
  )

  return (
    <Confetti
      launchPoints={launchPoints}
      // burstAmount={150}
      // afterBurstAmount={100}
      // onEnd={() => {}}
      // gravity={new Vector2(0, 0.1)}
    />
  )
}
```
