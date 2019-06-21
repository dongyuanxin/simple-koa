const http = require('http')
const Emitter = require('events')
const compose = require('koa-compose')

module.exports = class Application extends Emitter {
  constructor () {
    super()

    this.middleware = []
    this.context = {}
    this.request = {}
    this.response = {}
  }

  listen (...args) {
    const server = http.createServer(this.callback())
    return server.listen(...args)
  }

  use (fn) {
    this.middleware.push(fn)
    return this
  }

  callback () {
    const fn = compose(this.middleware)
    this.on('error', this.onerror)

    return (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
  }

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res
    // res.statusCode = 404
    const handleResponse = () => {
      res.end(res.body)
    }

    return fnMiddleware(ctx)
      .then(handleResponse)
      .catch(this.onerror)
  }

  createContext (req, res) {
    const context = Object.create(this.context)
    context.request = Object.create(this.request)
    context.response = Object.create(this.response)
    context.req = req
    context.res = res

    context.app = this
    context.state = {}

    return context
  }

  onerror (error) {
    console.log(`error occurs: ${error.message}`)
  }
}
