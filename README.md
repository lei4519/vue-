# 服务端渲染流程
##  1. 运行npm run dev:server
- 开始执行/server/server.js中的代码
## 2. server.js
- 启动了node服务, 监听端口等. 定义了处理错误的中间件, 引入并使用了dev-ssr配置项文件:'./routers/dev-ssr.js'
## 3. dev-ssr.js
  1. 首先引入webpack服务端渲染配置文件, 使用配置文件调用webpack Node Api创建解析器实例, 解析器可以在node中运行来打包服务端渲染所需要的json包文件
  2. 修改解析器的文件读写系统, 更改为memory-fs, 使打包后的文件存储在内存中, 而不是写在硬盘里, 以提升运行速度
  3. 调用webpack解析器的watch方法, 就会开始执行打包服务端渲染的配置文件. 在之后检测到文件变更时, 就会自动重新编译
      ```javascript
      1. 服务端渲染配置文件的入口是'../client/server-entry.js'
      2. server-entry.js 中导出了一个函数
         这个函数接受一个context参数, 形式如 `{url: /}`
         调用router.push()方法跳转到传入的URL
         在路由的onReady事件中, 使用getMatchedComponents()方法查看当前路由匹配的组件数组
         如果其数组length不为0, 就说明匹配到了路由, 返回一个带有vue实例的promise.
      3. 这个函数和服务端渲染所需有的内容都会被vue-server-renderer/server-plugin插件打包进vue-ssr-server-bundle.json文件中
      4. 使用memory-fs读取vue-ssr-server-bundle.json中的内容, 使用JSON.parse解析后赋值给bundle变量
      ```
  4. 使用get('*')定义node中的路由, 每当有路由访问, 就会执行回调函数
      ```javascript
      1. 回调函数中先判断bundle是否存在, 确定webpack首次运行是否完成
      2. 使用axios发送请求, 请求客户端打包好的json文件
      3. 读取html的template模板文件内容
      4. 使用createBundleRenderer方法, 并将打包好的bunder传入进去, 得到renderer对象, 此时renderer对象中的renderToString方法就是我们在server-entry.js中导出的那个函数
      5. 调用renderer.renderToString()方法, 将url传入, 拿到相匹配的路由组件, 并将其渲染成字符串
      6. 使用ejs手动注入html内容, 向客户端响应html. 至此 结束
      ```

## 要点代码
> 服务端渲染的原理就是使用vue提供给我们的vue-server-renderer包, 将我们写好的vue应用转化为字符串. 所以最核心的代码就是以下3点
1. 使用工厂函数导出vue应用 避免服务端访问导致的交叉请求状态污染
```javascript
import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import createRouter from './config/router'
import createStore from '../store/store'

Vue.use(Router)
Vue.use(Vuex)
Vue.use(Meta)

export default () => {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: (h) => h(App)
  })
  return {app, router, store}
}
```
2. 写一个供vue-server-renderer调用的函数, 他的作用就是匹配路由并返回对应的app应用. 使用vue-server-renderer的server/plugin webpack插件进行打包, server/plugin会帮我们把这个函数和vue服务端渲染需要的代码打包进vue-ssr-server-bundle.json中
```javascript
import createApp from './create-app'
export default context => {
  return new Promise((resolve, reject) => {
    const {app, router, store} = createApp()
      router.push(context.url)
      router.onReady(() => {
        const matchedComponents = router.getMatchedComponents()
        if (!matchedComponents.length) {
          return reject(new Error('no component matched'))
        }
        resolve(app)
    })
  })
}
```
3. 调用vue-server-renderer的createBundleRenderer方法, 并将上面打包好的vue-ssr-server-bundle.json传入即可得到renderer实例, 使用renderer实例的renderToString方法, 并传入访问的路由路径, 即可渲染出app应用的字符串模板
4. 每当服务端被访问时, 都会调用renderer实例的renderToString方法, 并将访问的url传入, 如果有匹配的路径就返回app, 否则就404就好了

