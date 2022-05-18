console.log('Estou na aula 2 mas sou um script')
const a = 3
const b = 2
console.log(a + b)
const xs = [1, 2, 3, 4, 5, 6, 7, 8]
const evens = xs.filter(x => x % 2 === 0)
console.log(evens)
const sum = xs.reduce((acc, curr) => acc + curr, 0)
console.log(sum)
