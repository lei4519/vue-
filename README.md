## vue深精透

```
npm install
npm start
//访问http://localhost:3333 即可查看
```

### 项目介绍
  - 使用vue的服务端渲染/router/vuex等各种技术实现todolist，深入学习vue的各种技能要点。

### 项目收获
  - 使用webpack4, 从零搭建开发和生产环境
  - 使用koa搭建node服务，实现服务端渲染，分别实现开发和生产环境下的服务端渲染
    - 开发环境中使用webpack API创建Compiler实例在nodejs运行时打包服务端bundle，将打包后文件存入内存中提高读写速度
    - 生产环境下直接使用打包好的bundle文件渲染vue实例
  - 开发notify插件，使用extends来拓展基础组件，控制多个notify在页面中显示的顺序
  - 开发了Tabs插件，使用slot插槽动态插入内容，使用依赖注入实现上下级组件通信
  

### 服务端渲染流程
  - 1. 运行npm run dev:server
    - 开始执行/server/server.js中的代码
  - 2. server.js
    - 启动了node服务, 监听端口等. 定义了处理错误的中间件, 引入并使用了dev-ssr配置项文件:'./routers/dev-ssr.js'
  - 3. dev-ssr.js
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

### 核心代码
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
4. 每当服务端被访问时, 都会调用renderer实例的renderToString方法, 并将访问的url传入, 如果有匹配的路径就返回app, 否则404就好了

### 服务端重定向
  - 在asyncdata中做判断, 如果需要重定向则使用router对象跳转(此时router对象中的路径会改变), 之后服务端渲染时判断访问的路径和router对象的路径是否一致, 如果不一致就重定向至router对象中的路径

### nodejs执行模块原理
  - nodejs通过文件模块读取文件，此时文件中的代码只是字符串，无法通过js执行。
  - nodejs通过module模块包装字符串，在代码外部包裹一层function，function的参数为module,exports,require， 这也是我们在文件中为什么可以直接使用这几个变量的原因。
  - 接着使用vm模块，通过new vm.Script()，将字符串代码变为真正可执行的js代码
  - 通过runInThisContext使new出的代码对象拥有nodejs公共的全局变量
  - 接着执行代码对象, 并将我们准备好的模块对象传入, 就可以使用模块对象访问代码中导出变量了
  ```javascript
    // nodejs使用module模块执行文件 
    const NativeModule = require('module')
    const vm = require('vm')
    // 自定义模块对象
    const m = {exports: {}}
    // 读取要执行的js文件
    const bundleStr = mfs.readFileSync(bundlePath, 'utf-8')
    // NativeModule.wrap之后会在文件中包装一层function 参数为module,exports,require
    const wrapper = NativeModule.wrap(bundleStr)
    // vm.Script将字符串变为可以执行的js代码
    const script = new vm.Script(wrapper, {
      filename: 'server-entry.js',
      displayErrors: true
    })
    // 给要执行的代码添加nodejs的全局公共变量
    const result = script.runInThisContext()
    // 执行代码, 将自定义模块对象传入
    result.call(m.exports, m.exports, require, m)
    // 这时候我们自定义的模块对象中就有了js文件中导出的变量了
    bundle = m.exports.default
  ```