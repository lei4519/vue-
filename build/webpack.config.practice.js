const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

let isDev = process.env.NODE_ENV === 'development'
let config = {}
const devServer = {
  port: 3000,
  host: 'localhost',
  overlay: {
    errors: true
  },
  open: true,
  hot: true
}
const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV:  '"development"'
    }
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './template.html')
  })
]

config = merge(baseConfig, {
  entry: path.resolve(__dirname, '../practice/index.js'),
  devServer,
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      },
    ]
  },
  resolve: {
    alias: {
      'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.esm.js')
    }
  },
  plugins: defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ])
})

module.exports = config
