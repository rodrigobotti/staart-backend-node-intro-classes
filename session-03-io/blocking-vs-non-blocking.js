const { join } = require('path')
const {
  readFileSync,
  writeFileSync,
  readFile,
  writeFile,
} = require('fs')


const logDuration = (label, start) =>
  console.log(`🕐 ${label} took ${Date.now() - start}ms`)

const filePath = (...pathSegments) =>
  join(__dirname, ...pathSegments)

// Blocking

const copyFileBlocking = (source, dest) => {
  const startBlocking = Date.now()
  console.log('Read blocking - start')
  const content = readFileSync(source)
  console.log('Read blocking - end')

  console.log('Write blocking - start')
  writeFileSync(dest, content)
  console.log('Write blocking - end')
  logDuration('Blocking', startBlocking)
}

const source = filePath('files', 'example.txt')
const dest = filePath('files', 'example.copy.sync.txt')

copyFileBlocking(source, dest)
console.log('Somente depois de terminar a cópia')


// Non-Blocking

console.log('*'.repeat(50))

const copyFileNonBlocking = (source, dest) => {
  const startNonBlocking = Date.now()
  
  console.log('Read async - start')
  readFile(source, (_err, data) => {
    console.log('> Read async - end')
    
    console.log('> Write async - start')
    writeFile(dest, data, (_err) => {
      console.log('>> Write async - end')
      logDuration('>> Non-Blocking', startNonBlocking)
    })
  
  })
}

const destAsync = filePath('files', 'example.copy.async.txt')

copyFileNonBlocking(source, destAsync)

console.log('Async end ?')

console.log(
  'Continuando',
  1 + 1
)
console.log(
  'Continuando',
  Math.PI * Math.E
)
