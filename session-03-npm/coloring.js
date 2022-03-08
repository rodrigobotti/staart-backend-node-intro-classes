const chalk = require('chalk')

const happy = message =>
  chalk.bgBlueBright(chalk.bold(chalk.whiteBright(message)))

const info = message =>
  chalk.bgGreenBright(chalk.black(message))

const angry = message =>
  chalk.bgRed(chalk.whiteBright(message))

module.exports = {
  happy,
  info,
  angry,
}
