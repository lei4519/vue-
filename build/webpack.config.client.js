const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const VueClientPlugin = require('vue-server-renderer/client-plugin')

let isDev = process.env.NODE_ENV === 'development'

let config = {}
const devServer = {
  port: 8000,
  host: 'localhost',
  overlay: {
    errors: true
  },
  historyApiFallback: {
    index: '/index.html'
  },
  proxy: {
    '/api': 'http://localhost:3333',
    '/user': 'http://localhost:3333'
  },
  open: true,
  hot: true
}
const defaultPlugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template.html')
    }),
    new VueClientPlugin()
]

if (isDev) {
  config = merge(baseConfig, {
    devServer,
    output: {
      filename: 'bundle.[hash:8].js',
      path: path.resolve(__dirname, '../public'),
      publicPath: '/'
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/client-entry.js')
    },
    output: {
      filename: '[name].[chunkhash:8].js',
      publicPath: '/public/'
    },
    plugins: defaultPlugins.concat([
      new webpack.NamedChunksPlugin()
      ]),
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          },
        },
        chunks: 'all'
      },
      runtimeChunk: true
    }
  })
}
config.resolve = {
  alias: {
    'model': path.join(__dirname, '../client/model/client-model.js')
  }
}
module.exports = config
