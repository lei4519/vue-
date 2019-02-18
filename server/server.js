const Koa = require('koa')
const koaBody = require('koa-body')
const koaSession = require('koa-session')
const send = require('koa-send')
const path = require('path')
const isDev= process.env.NODE_ENV === 'development'
const staticRouter = require('./routers/static')
const apiRouter = require('./routers/api')
const userRouter = require('./routers/user')
const createDB = require('./db/db')
const config = require('../app.config')
const db = createDB(config.db.appId, config.db.appKey)

const app = new Koa()
const HOUR = 60 * 60 * 1000
app.keys = ['vue ssr tech']
app.use(koaSession({
  key: 'v-ssr-id',
  maxAge: 2 * HOUR
}, app))

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
  ctx.db= db 
  await next()
})
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', {root: path.resolve(__dirname, '../')})
  } else {
    await next()
  }
})
app.use(koaBody())
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
const pageRouter = isDev ? require('./routers/dev-ssr') : require('./routers/ssr')
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.HOST || '3333'

app.listen(PORT, HOST,  () => {
  console.log(`server is listening on http://${HOST}:${PORT}`)
})
