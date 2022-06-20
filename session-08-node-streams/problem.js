const { join } = require('path')
const { readFile } = require('fs').promises

const { splitBuffer } = require('../helpers')

// https://eforexcel.com/wp/wp-content/uploads/2020/09/5m-Sales-Records.zip
const LargeFilePath = join(__dirname, 'files', 'sales.csv')


const naiveApproach = async () => {
  // Error: Cannot create a string longer than 0x1fffffe8 characters
  //     code: 'ERR_STRING_TOO_LONG'
  //
  // const data = await readFile(LargeFilePath, { encoding: 'utf8' })

  const data = await readFile(LargeFilePath)
  const lines = splitBuffer(data, '\n').map(line => line.toString())

  // ...
  // não importa escrever o resto, vai falhar por falta de memória
  // FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
}

naiveApproach()


