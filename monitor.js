const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics
const register = new client.Registry()
collectDefaultMetrics({ register })

const http_requests_total = new client.Counter({
  name: 'http_requests_total',
  help: 'Number of HTTP requests',
  registers: [register]
})

module.exports = {
  client,
  register,
  http_requests_total
}
