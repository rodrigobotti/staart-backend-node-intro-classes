const { join } = require('path')
const { createReadStream, createWriteStream } = require('fs')
const { Readable, Writable, Transform, pipeline } = require('stream')

Readable.from([1, 2, 3, 4, 5, 6])
  .pipe(new Transform({
    objectMode: true, // falha
    transform(chunk, _encoding, callback) {
      callback(null, `${String(chunk + 1)}`)
    }
  }))
  .pipe(new Writable({
    objectMode: true,
    write(chunk, _encoding, callback) {
      setTimeout(() => {
        console.log(chunk)
        callback()
      }, 1000)
    }
  }))


const secondReadable = new Readable({ read() { } })
const mapper = new Transform({
  transform(chunk, _encoding, callback) {
    callback(null, `segundo: ${chunk}\n`)
  }
})

pipeline(
  secondReadable,
  mapper,
  process.stdout,
  (error) => {
    if (error) {
      console.error('Pipeline failed', error)
    } else {
      console.log('Pipeline succeeded')
    }
  }
)

let i = 0
const intervalId = setInterval(() => {
  secondReadable.push(String(i++))
}, 1000)
setTimeout(() => {
  clearInterval(intervalId)
}, 10_000)

secondReadable.on('data', (data) => console.log('segundo emitiu dados:', data))
mapper.on('data', (data) => console.log('mapper transformou dados: ', data))
secondReadable.on('close', () => console.log('dados finalizados'))
