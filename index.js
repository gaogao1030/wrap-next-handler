const { register, http_requests_total } = require('./monitor')
const proxy = require('./proxy')

const wrapNextHanlder = (app, env, opts) => {
  const handle = app.getRequestHandler()
  return (req, res, parsedUrl) => {
    const { pathname, query } = parsedUrl
    http_requests_total.inc()

    if (pathname === '/metrics') {
      res.statusCode = 200
      res.setHeader('Content-Type', register.contentType)
      res.end(register.metrics())
      return
    }

    if (pathname === '/api/v1/healthz/status') {
      const { NODE_NAME, NODE_IP, NODE_VERSION, POD_IP, POD_NAME, COMMIT_SHORT_SHA } = process.env
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ 
        NodeName: NODE_NAME || 'none',
        NodeIP: NODE_IP || 'none',
        PodName: POD_NAME || 'none',
        PodIP: POD_IP || 'none',
        NodeVersion: NODE_VERSION || 'none',
        COMMIT_SHORT_SHA: COMMIT_SHORT_SHA|| 'none'
      }))
      return 
    }

    if (req.url.indexOf('/api/p/') === 0) {
      proxy(env, opts)(req, res)
      return 
    }
    handle(req, res, parsedUrl)
  }
}

module.exports = wrapNextHanlder
