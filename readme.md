# Readme

## Install

``` npm install wrap-next-handler ```

## Usage

```
const wrapHandler = require('wrap_next_handler')

const packageInfo = require("./package.json")
const env = process.env.APP_ENV || packageInfo.env
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })

const handle = wrapHandler(app, env)
const port = process.env.PORT || 3200

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
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
