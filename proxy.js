const httpProxy = require('http-proxy')
const proxyServer = httpProxy.createProxyServer({});

const proxy = (env, opts = { proxy: {} }) => {
  let target = opts['proxy']['production']|| 'https://ec.rosepie.com'
  
  if (env === 'beta') {
    target = opts['proxy']['beta'] || 'https://p.beta.k8s.rose-pie.com'
  }
  
  if (['rel', 'release'].includes(env)) {
    target = opts['proxy']['release'] || 'https://n.meiguipai.net'
  }
  
  if (['pre_production', 'preProduction'].includes(env)) {
    target = opts['proxy']['pre_production'] || 'https://n.meiguipai.com'
  }

  return (req, res) => {
    proxyServer.web(req, res, {
      changeOrigin: true,
      ignorePath: true,
      target: target + req.url.substring(4)
    })
  }
}

module.exports = proxy
