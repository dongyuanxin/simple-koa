const Koa = require('./lib/application')

const server = new Koa()

async function middleware1 (ctx, next) {
  console.log('1 inner')
  await next()
  console.log('1 outer')
}

async function middleware2 (ctx, next) {
  ctx.res.body = 'hello'
  console.log('2 inner')
  await next()
  console.log('2 outer')
}

server.use(middleware1)
server.use(middleware2)

server.listen(3000)