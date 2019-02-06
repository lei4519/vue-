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
    plugins: defaultPlugins,
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

module.exports = config
