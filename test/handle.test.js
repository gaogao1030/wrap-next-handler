const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const env = 'production'
const app = next({ dev: false })

const wrapHandler = require('../')
const tap = require('tap')
const fetch = require('node-fetch')

app.prepare().then(() => {
  tap.test('test wrap next handler with handleOpts', async (t) => {
    const handleOpts = {
      proxy: {
        beta: 'https://p.beta.k8s.rose-pie.com',
        release: 'https://n.meiguipai.net',
        pre_production: 'https:://n.meiguipai.com',
        production: 'https://ec.rosepie.com'
      }
    }
    
    const handle = wrapHandler(app, env, handleOpts)
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      handle(req, res, parsedUrl)
    })

    server.listen()
    const port = server.address().port
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
      server.close()
    })
  })

  tap.test('test wrap next handler without handleOpts', async (t) => {
    const handle = wrapHandler(app, env)
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl
      handle(req, res, parsedUrl)
    })

    server.listen()
    const port = server.address().port
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
      server.close()
    })
  })

})
