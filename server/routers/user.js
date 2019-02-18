const Router = require('koa-router')
const userRouter = new Router({prefix: '/user'})

userRouter
  .post('/login', async ctx => {
    const user = ctx.request.body
    if (user.username === 'admin' && user.password === 'admin') {
      ctx.session.user = {
        username: 'admin'
      }
      ctx.body = {
        status: 200,
        data: {
          username: 'admin'
        }
      }
    } else {
      ctx.body = {
        status:400,
        message: 'username or password error'
      }
    }
  })

module.exports = userRouter