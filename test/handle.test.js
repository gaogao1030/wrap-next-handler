const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const app = next({ dev: false })

const wrapHandler = require('../')
const tap = require('tap')
const fetch = require('node-fetch')

app.prepare().then(() => {
  tap.test('test wrap next handler', async (t) => {
    
    const handle = wrapHandler(app)
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      handle(req, res, parsedUrl)
    })

    server.listen()
    const port = server.address().port
    t.plan(2)
    let res = await fetch(`http://localhost:${port}/metrics`)
    let text = await res.text()
    t.match(text, /http_requests_total/)
    res = await fetch(`http://localhost:${port}/api/v1/healthz/status`)
    let json = await res.json()
    t.equal(200, res.status)

    t.teardown(() => {
      server.close()
    })
  })

})
