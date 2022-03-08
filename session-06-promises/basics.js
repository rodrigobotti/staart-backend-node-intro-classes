const { join } = require('path')
const { readFile, writeFile } = require('fs').promises

/*
Promise<T> = Pending<T> | Settled<T>
Settled<T> = Fulfilled<T> | Rejected
*/

// .then: linearizando
// .catch: lidando com erros
// .finally: independentemente do resultado

const PackageJsonPath = join(__dirname, '..', 'package.json')

readFile(PackageJsonPath + 'xxx')
  .then(
    // podemos retornar valores puros
    data => '\n\n\n' + data + '\n\n\n'
  )
  .then(
    // podemos retornar outra promise
    data => writeFile('package.promise.json', data)
  )
  .then(
    // só cai aqui se a Promise do `writeFile` for fulfilled
    () => console.log('Cópia deu certo')
  )
  .catch(
    // lidando com o erro
    error => {
      console.log('quero fazer algo com o erro aqui')
      console.log('mas quero que continue sendo um erro (rejected)')
      return Promise.reject(
        error.code === 'ENOENT'
          ? Error('Arquivo não existe')
          : error
      )
    }
  )
  .catch(
    // capturando o erro -> não retorna uma promise rejected
    error => console.error(error)
  )
  .finally(
    () => console.log('Processo terminou')
  )

// contruindo promises - rejected
Promise.reject(Error('falhei'))
    .catch(() => {})

// construindo promises - fulfilled
Promise.resolve(1) // valor puro
Promise.resolve(
  /* outra promise */
)

let valorCacheado = null
const buscaCaraDeFazer = () =>
  Promise.resolve(2)
    .then(v => (valorCacheado = v))

const buscaValor = () =>
  Promise.resolve(
    valorCacheado ?? buscaCaraDeFazer()
  )

// construindo promises - construtor

const databaseRead = (id, callback) => {
  // fingir que está fazendo algo que leva tempo
  setTimeout(() =>
    id > 10
      ? callback(Error('Database error'))
      : callback(null, { id })
    , 500)
}

const databaseReadPromise = id =>
  new Promise((resolve, reject) => {
    databaseRead(id, (error, object) =>
      error ? reject(error) : resolve(object)
    )
  })

databaseReadPromise(1)
  .then(console.log)

const delay = (time) =>
  new Promise(resolve =>
    setTimeout(resolve, time)
  )

delay(1_000).then(() => console.log('Após 1s'))

// const databaseReadPromise = util.promisify(databaseRead)

// múltiplas promises - Promise.all

const GitIgnorePath = join(__dirname, '..', '.gitignore')

Promise.all([
  readFile(PackageJsonPath),
  readFile(GitIgnorePath),
  // Promise.reject(Error('falhei de propósito')),
])
  .then(([packageJsonData, gitIgnoreData]) => `
    package.json:
    ${packageJsonData}

    .gitignore:
    ${gitIgnoreData}
  `
  )
  .then(data => writeFile('combined.txt', data))
  .then(() => console.log('Cópia deu certo'))
  .catch(error => console.error(error))

// múltiplas promises - Promise.any

Promise.any([
  readFile(PackageJsonPath, {encoding: 'utf8'}),
  readFile(GitIgnorePath, {encoding: 'utf8'}),
  Promise.reject(Error('falhei de propósito')),
])
.then(console.log)

// múltiplas promises - Promise.race

Promise.race([
  delay(1000).then(() => 1000),
  delay(500).then(() => 500),
  delay(200).then(() => Promise.reject(Error('Falhei na corrida')))
])
  .then(console.log)
  .catch(console.error)

// multiplas promises - Promise.allSettled

// { status: 'fulfilled', value: T } | { status: 'rejected', reason: any }

Promise.allSettled([
  delay(1000).then(() => 1000),
  delay(500).then(() => 500),
  delay(2000).then(() => Promise.reject(Error('Falhei na corrida')))
])
  .then(console.log)


