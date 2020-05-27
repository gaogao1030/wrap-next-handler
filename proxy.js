const httpProxy = require('http-proxy')
const proxyServer = httpProxy.createProxyServer({});

const proxy = (env) => {
  let target = 'https://ec.rosepie.com'
  
  if (env === 'beta') {
    target = 'https://n.yunchuangfu.com'
  }
  
  if (['rel', 'release'].includes(env)) {
    target = 'https://n.meiguipai.net'
  }
  
  if (['pre_production', 'preProduction'].includes(env)) {
    target = 'https://n.meiguipai.com'
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
