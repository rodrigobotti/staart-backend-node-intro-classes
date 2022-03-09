const { join } = require('path')
const { createReadStream } = require('fs')
const { pipeline } = require('stream/promises')
const { Readable } = require('stream')
const { delay } = require('../helpers')

async function* ticks (n) {
  for (let i = 0; i < n; i++) {
    await delay(1000)
    yield
  }
}

const clocks = async () => {
  const firstClock = async () => {
    for await(const _ of ticks(5)) {
      console.log('first: tick')
    }
  }
  const secondClock = async () => {
    for await(const _ of ticks(5)) {
      console.log('second: tick')
    }
  }
  await Promise.all([
    firstClock(),
    secondClock()
  ])
}

// clocks()

async function* toLines (source, _signal) {
  source.setEncoding('utf8')
  let lineBuffer = ''
  for await(const chunk of source) {
    const lines = lineBuffer.concat(chunk).split('\n')
    lineBuffer = lines.pop()
    for (const line of lines) {
      await delay(500)
      yield line
    }
  }
  if (lineBuffer.length) yield lineBuffer
}

async function* labelLines (source, _signal) {
  for await(const line of source) {
    yield `line: ${line}\n`
  }
}

const pipe = async () => {
  await pipeline(
    createReadStream(join(__dirname, '..', 'package.json')),
    toLines,
    labelLines,
    process.stdout
  )
}

// pipe()

const iterateStream = async () => {
  const characters = Readable.from([ 'a', 'b', 'c', 'd' ])

  for await(const c of characters) {
    console.log('character:', c)
  }
}

// iterateStream()

const InfinteClockAsyncIterable = () => ({
  async *[Symbol.asyncIterator] () {
    while (true) {
      await delay(1000)
      yield
    }
  }
})

const asyncIterator = async () => {
  let counter = 0
  for await(const _ of InfinteClockAsyncIterable()) {
    counter++
    console.log('Infinite clock tick')
    if (counter > 3) break
  }
}

asyncIterator()
