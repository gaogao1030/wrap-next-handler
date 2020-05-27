const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const env = 'production'
const app = next({ dev: false })

const wrapHandler = require('../')
const handle = wrapHandler(app, env)
const fetch = require('node-fetch')

const tap = require('tap')

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    handle(req, res, parsedUrl)
  })

  server.listen()
  const port = server.address().port

  tap.test('test wrap next handler', async (t) => {
    t.plan(3)
    let res = await fetch(`http://localhost:${port}/metrics`)
    let text = await res.text()
    t.match(text, /http_requests_total/)
    res = await fetch(`http://localhost:${port}/api/v1/healthz/status`)
    let json = await res.json()
    t.equal(200, res.status)

    res = await fetch(`http://localhost:${port}/api/p/member`)
    t.equal(403, res.status)
    t.teardown(() => {
      console.log('close server')
      server.close()
    })
  })

})

