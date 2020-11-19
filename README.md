🎉🎉🎉 CONFETTI 🎉🎉🎉

```
yarn install confetti
```

```javascript
const ConfettiArea = () => {
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
    />
  )
}
```
