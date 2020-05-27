# Readme

## Install

` npm install wrap-next-handler `

## Usage

```javascript
const wrapHandler = require('wrap-next-handler') // <- require this package

const packageInfo = require("./package.json")
const env = process.env.APP_ENV || packageInfo.env
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })

const handle = wrapHandler(app, env) // <- pass app to wrapHandler
const port = process.env.PORT || 3200

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl) <- using this handler
    }).listen(port, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:' + port)
    })
})
```

## feature
* support /metrics path for prometheus collect metrics
* support /api/v1/healthz/status for livenessProbe in Deployment
* suuport /api/p proxy requests to nodeProxy in different environments through env variables
