const Koa = require('koa')
const send = require('koa-send')
const path = require('path')
const app = new Koa()
const isDev= process.env.NODE_ENV === 'development'
const staticRouter = require('./routers/static')
// 错误处理中间件
app.use(async (ctx, next) => {
  try{
    await next()
  } catch(err) {
    ctx.status = 500
    if (isDev) {
      ctx.body = err.message
    } else {
      ctx.body = '404'
    }
  }
})
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', {root: path.resolve(__dirname, '../')})
  } else {
    await next()
  }
})

app.use(staticRouter.routes()).use(staticRouter.allowedMethods())

const pageRouter = isDev ? require('./routers/dev-ssr') : require('./routers/ssr')
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.HOST || '3333'

app.listen(PORT, HOST,  () => {
  console.log(`server is listening on http://${HOST}:${PORT}`)
})
