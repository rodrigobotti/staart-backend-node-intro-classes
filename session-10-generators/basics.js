// Generator
function* example(arg) {
  const incremented = arg + 1
  console.log(`me invocou com ${arg}`)
  yield arg

  console.log('estava "suspeded" mas agora estou "resumed"')
  console.log(`ainda tenho o contexto da função: arg=${arg}, incremented=${incremented}`)
  const resumedArg = yield incremented

  console.log(`fui "resumed" recebendo o valor ${resumedArg}`)
  yield resumedArg + 3

  console.log('"resumed" novamente, mas agora é a última')
  return 42
  // lembrando que não retornar nada === return === return undefined
}

console.log('function:', example)
const generator = example(1)
console.log('generator:', generator)
console.log(generator.next())
console.log(generator.next(99))
console.log(generator.next())
console.log(generator.next())
// chamar mais vezes do que tem yield + return: { value: undefined; done: true }
console.log(generator.next())

// generator infinito
function* naturals() {
  let n = 0
  while (true) {
    yield n++
  }
}

const N = naturals() // não vai travar: só criou um Generator

const take = (n, gen) => {
  const acc = []
  for (let i = 0; i < n; i++) {
    const { value, done } = gen.next()
    if (done) {
      if (value !== undefined) {
        acc.push(value)
      }
      break
    }
    acc.push(value)
  }
  return acc
}

console.log(take(10, N))

function* hello() {
  yield 'hello'
  yield 'world'
  yield '!'
}

for (const message of hello()) {
  console.log(message)
}

for (const i of naturals()) {
  if (i > 20) {
    console.log('chega!')
    break
  }
}

// iterator protocol
// Iterator = { next: () => { value: T; done: boolean } }

const ZeroToNIterator = (n) => ({
  counter: 0,
  next() {
    const done = this.counter > n
    return {
      done,
      value: done ? undefined : this.counter++,
    }
  }
})


// iterable protocol
// Iterable = { [Symbol.iterator]: () => Iterator }

const ZeroToN = (n) => ({
  [Symbol.iterator]() {
    return ZeroToNIterator(n)
  }
})

for (const i of ZeroToN(5)) {
  console.log(i)
}

const AlternatingMessages = (n) => ({
  messages: ['Hello!', 'Bye!'],
  *[Symbol.iterator]() {
    for (let i = 0; i < n; i++) {
      const [hello, bye] = this.messages
      const message = i % 2 === 0 ? hello : bye
      yield message
    }
  }
  // [Symbol.iterator]: function* (){}
})

for (const message of AlternatingMessages(5)) {
  console.log(message)
}
