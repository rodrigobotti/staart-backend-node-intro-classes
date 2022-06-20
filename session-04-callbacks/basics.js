const { join } = require('path')
const { readFile, writeFile } = require('fs')

const PackageJsonPath = join(__dirname, '..', '/package.json')
const CopyPath = join(__dirname, 'package.copy.json')

// não se importando com possíveis erros
readFile(PackageJsonPath, (_errRead, data) => {
  writeFile(CopyPath, data, (_errWrite) => {
    console.log('Terminou de copiar')
  })
})

// tratando os erros sem early return
readFile(PackageJsonPath, (errRead, data) => {
  if (!errRead) {
    writeFile(CopyPath, data, (errWrite) => {
      if (!errWrite) {
        console.log('Terminou de copiar')
      }
    })
  }
})

// tratando os erros com early return e logs
readFile(PackageJsonPath, (errRead, data) => {
  if (errRead) {
    console.error('Erro ao ler o arquivo', errRead)
    return
  }
  writeFile(CopyPath, data, (errWrite) => {
    if (errWrite) {
      console.error('Erro ao escrever o arquivo', errRead)
      return
    }
    console.log('Terminou de copiar')
  })
})
