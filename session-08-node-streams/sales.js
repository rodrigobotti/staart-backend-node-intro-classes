const { createReadStream } = require('fs')
const { Transform } = require('stream')
const { pipeline } = require('stream/promises')

const { parse } = require('csv-parse')
const { bgRed, white } = require('chalk')
const { join } = require('path')

const ColumnNames = [
  'region',         // Region
  'country',        // Country
  'itemType',       // Item Type
  'salesChannel',   // Sales Channel
  'orderPriority',  // Order Priority
  'orderDate',      // Order Date
  'orderId',        // Order ID
  'shipDate',       // Ship Date
  'unitsSold',      // Units Sold
  'unitPrice',      // Unit Price
  'unitCost',       // Unit Cost
  'totalRevenue',   // Total Revenue
  'totalCost',      // Total Cost
  'totalProfit',    // Total Profit
]

// missão: "flagear" vendas de uma região cujo lucro ultrapassa um valor
// - linhas no formato <orderId>: <totalProfit>
// - fundo vermelho e texto branco caso flag

const csvParser = () =>
  parse({
    columns: ColumnNames,
    skipEmptyLines: true,
    delimiter: ',',
    trim: true,
  })

const regionFilter = (region) =>
  new Transform({
    objectMode: true,
    transform(sale, _encoding, callback) {
      if (sale.region === region) {
        callback(null, sale)
      } else {
        callback()
      }
    }
  })

const profitParser = () =>
  new Transform({
    objectMode: true,
    transform(sale, _encoding, callback) {
      callback(null, {
        ...sale,
        totalProfit: parseFloat(sale.totalProfit),
      })
    }
  })

const profitHighliter = (threshold) =>
  new Transform({
    objectMode: true,
    transform({ orderId, totalProfit }, _encoding, callback) {
      const line = `${orderId}: ${totalProfit}\n`
      const coloredLine = totalProfit > threshold ? bgRed(white(line)) : line
      callback(null, coloredLine)
    }
  })

const SalesFile = join(__dirname, 'files', 'sales.csv')
const Region = 'Europe'
const PriceThreshold = 50_000.00

pipeline(
  createReadStream(SalesFile),
  csvParser(),
  regionFilter(Region),
  profitParser(),
  profitHighliter(PriceThreshold),
  process.stdout
)
  .then(() => console.log('Pipeline succeeded'))
  .catch(error => console.error('Pipeline failed', error))

