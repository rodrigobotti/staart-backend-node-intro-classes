const { EventEmitter } = require('events')

const MetricsBus = () => {
  const topic = new EventEmitter({
    captureRejections: true
  })
  .on('error', (error) => {
    console.error('MetricsBus captured error', error)
  })

  const bus = {
    publish(metric) {
      topic.emit('metric', metric)
      return this
    },
    subscribe(subscriber) {
      topic.on('metric', subscriber.handle.bind(subscriber))
      return this
    }
  }

  return bus
}

const Units = {
  Milliseconds: 'Milliseconds',
  Count: 'Count',
  // ...
}

const Metric = ({ name, unit, value }) => ({
  name,
  unit,
  value,
  service: 'metrics-example',
  timestamp: new Date(),
})

const ConsoleMetricSubscriber = () => ({
  handle: (metric) => {
    setTimeout(() => {
      console.log(JSON.stringify(metric, null, 2))
    }, 0)
  }
})

const bus = MetricsBus()

module.exports = {
  bus,
  Metric,
  Units,
  ConsoleMetricSubscriber,
}
