const { join } = require('path')
const {
  readFile: readFileOriginal,
  writeFile: writeFileOriginal,
} = require('fs').promises

const {
  bus,
  Metric,
  Units,
  ConsoleMetricSubscriber,
} = require('./metrics')

const metricSubscriber = ConsoleMetricSubscriber()
bus.subscribe(metricSubscriber)

const measureDuration = (label, action) =>
  (...args) => {
    const start = Date.now()
    return action(...args)
      .finally(() => {
        const duration = Date.now() - start
        const metric = Metric({
          name: `${label}Duration`,
          value: duration,
          unit: Units.Milliseconds,
        })
        bus.publish(metric)
      })
  }

const countOcurrence = (label, action) =>
  (...args) => {
    const metric = Metric({
      name: `${label}Count`,
      value: 1,
      unit: Units.Count,
    })
    bus.publish(metric)
    return action(...args)
  }

const withMetrics = (label, action) =>
  countOcurrence(label, measureDuration(label, action))

const readFile = withMetrics('readFile', readFileOriginal)
const writeFile = withMetrics('writeFile', writeFileOriginal)
const copyFile = (source, dest) =>
  readFile(source)
    .then(data => writeFile(dest, data))

const copyFileWithMetrics = withMetrics('copyFile', copyFile)

const main = async () => {
  const separator = '*'.repeat(50)

  await copyFileWithMetrics(
    join(__dirname, '..', 'package.json'),
    join(__dirname, 'copy.package.json')
  )

  console.log(separator)
  await copyFileWithMetrics(
    join(__dirname, '..', '.gitignore'),
    join(__dirname, 'copy.gitignore')
  )

  console.log(separator)
  await copyFileWithMetrics(
    join(__dirname, '..', '.editorconfig'),
    join(__dirname, 'copy.editorconfig')
  )
}

main()
