const Router = require('koa-router')
const path = require('path')
const axios = require('axios')
const fs = require('fs')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server.render')
// 服务端渲染webpack配置项
const serverConfig = require('../../build/webpack.config.server')
// 使用服务端渲染配置参数执行webpack 得到一个 webpack Compiler 实例
const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFs()
//默认情况下，webpack 使用普通文件系统来读取文件并将文件写入磁盘。但是，还可以使用不同类型的文件系统（内存(memory), webDAV 等）来更改输入或输出行为。为了实现这一点，可以改变 inputFileSystem 或 outputFileSystem。例如，可以使用 memory-fs 替换默认的 outputFileSystem，以将文件写入到内存中，而不是写入到磁盘
serverCompiler.outputFileSystem = mfs
// 存放运行在服务端的vue代码
let bundle
//调用 watch 方法会触发 webpack 执行器，之后会监听变更（很像 CLI 命令: webpack --watch），一旦 webpack 检测到文件变更，就会重新执行编译。该方法返回一个 Watching 实例
serverCompiler.watch({}, (err, stats) => {
  // err 致命的 wepback 错误（配置出错等）
  // stats.hasErrors() 编译错误（缺失的 module，语法错误等）
  // stats.hasWarnings() 编译警告
  // if (err) throw err
  // stats = stats.toJson()
  // stats.erros.forEach(err => console.error(err))
  // stats.hasWarnings.forEach(warn => console.warn(warn))
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }
  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error(info.errors);
  }
  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
  // vue服务端代码打包后的文件路径
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated')
})

// 执行ssr的中间件
const handleSSr = async (ctx) => {
  if (!bundle) {
    ctx.body = '你等一会, 别着急...'
    return
  }

  const clientManifestResp = await axios.get('http://localhost:8000/public/vue-ssr-client-manifest.json')
  const clientManifest = clientManifestResp.data
  // 读取html模板
  const template = fs.readFileSync(path.resolve(__dirname, '../server.template.ejs'), 'utf-8')
  // 执行bundle拿到html模板
  const renderer = VueServerRenderer.createBundleRenderer(bundle, {
    // 关闭vue自动注入
    inject: false,
    clientManifest
  })
  await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSr)

module.exports = router
