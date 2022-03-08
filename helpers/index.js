const delay = time =>
  new Promise(resolve =>
    setTimeout(resolve, time)
  )

const splitBuffer = (buffer, delimiter) => {
  let result = []
  let currentToken = []
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === delimiter) {
      if (currentToken.length !== 0) {
        result.push(currentToken)
      }
      currentToken = [] // clear array
    }
    else {
      currentToken.push(buffer[i])
    }
  }
  if (currentToken.length !== 0) {
    result.push(currentToken)
  }
  return result
}

module.exports = {
  delay,
  splitBuffer,
}
