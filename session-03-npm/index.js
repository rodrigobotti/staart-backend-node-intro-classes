const colors = require('./coloring')
const { AttendingClass, ClassSucks, WelcomeToClass } = require('./messages')

console.log('Aula 03 usando npm 😀 !')

console.log(colors.happy(WelcomeToClass))
console.log(colors.angry(ClassSucks))
console.log(colors.info(AttendingClass))
