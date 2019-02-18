const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

let isDev = process.env.NODE_ENV === 'development'
let config = {}
const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"server"'
  })
]

config = merge(baseConfig, {
  target: 'node',
  entry: path.resolve(__dirname, '../client/server-entry.js'),
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: path.resolve(__dirname, '../server-build')
  },
  externals: Object.keys(require('../package').dependencies),
  devtool: 'source-map',
  plugins: defaultPlugins.concat([
    new VueServerPlugin()
  ])
})
config.resolve = {
  alias: {
    'model': path.join(__dirname, '../client/model/server-model.js')
  }
}
module.exports = config
