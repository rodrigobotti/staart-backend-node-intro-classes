const { EventEmitter } = require('events')
const { delay } = require('../helpers')


const stackOverflowError = () => {
  const server = new EventEmitter()

  server.on('ping', () => {
    console.log('ping')
    server.emit('pong')
  })

  server.on('pong', () => {
    console.log('pong')
    server.emit('ping')
  })

  server.emit('ping')
}

// stackOverflowError()

const runsForever = () => {
  const server = new EventEmitter()

  server.on('ping', () => {
    console.log('ping')
    setTimeout(() => {
      server.emit('pong')
    }, 1000)
  })

  server.on('pong', () => {
    console.log('pong')
    setTimeout(() => {
      server.emit('ping')
    }, 1000)
  })

  server.emit('ping')
}

// runsForever()

const runsForeverAsync = () => {
  const server = new EventEmitter()
    .on('ping', async () => {
      console.log('ping')
      await delay(1000)
      server.emit('pong')
    })
    .on('pong', async () => {
      console.log('pong')
      await delay(1000)
      server.emit('ping')
    })

  server.emit('ping')
}

// runsForeverAsync()

const errors = () => {
  const server = new EventEmitter({
    captureRejections: true, // <- capturar promises rejeitadas no evento 'error'
  })
    .on('ping', async () => {
      console.log('ping')
      await delay(1000)
      server.emit('pong')
    })
    .on('pong', async () => {
      console.log('pong')
      await delay(1000)
      server.emit('ping')
    })
    .on('error', (error) => {
      console.error('Captured error event', error)
    })
    .on('forceExplodeAsync', (error) => {
      return Promise.reject(error)
    })

    // necessário node14
    // prioritário sobre 'error'
    server[Symbol.for('nodejs.rejection')] = (error) => {
      console.error('rejection handler', error)
    }

  server.emit('ping')

  setTimeout(() => {
    server.emit('error', Error('explode!'))
  }, 5_000)

  setTimeout(() => {
    server.emit('forceExplodeAsync', Error('to be rejected'))
  }, 8_000)
}

// errors()
