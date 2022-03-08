const logCalled = () =>
  console.log('> Fui executada')

setTimeout(
  logCalled,
  5000
)
setInterval(
  logCalled,
  1000
)
setInterval(
  () => {
    console.log('>> Mais frequente')
  },
  500
)

const timeoutId = setTimeout(logCalled, 100)
setTimeout(
  () => clearTimeout(timeoutId),
  50
)

const intervalId = setInterval(logCalled, 1000)
setTimeout(
  () => clearInterval(intervalId),
  5500
)
