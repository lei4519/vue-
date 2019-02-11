const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const isDev = process.env.NODE_ENV === 'development'

let config = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web',
  entry: path.resolve(__dirname, '../client/client-entry.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.resolve(__dirname, '../public'),
    publicPath: 'http://localhost:8000/public/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/, 
        use: 'vue-loader'
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      },
      {test: /\.(gif|jpg|jpeg|png|svg)$/, use: [
        {
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'resources/[path][name].[hash:8].[ext]'
          }
        },
      ]},
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
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
      { test: /\.(js|jsx) $/, exclude: /node_modules/, use: "babel-loader" }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/views')
    },
    extensions: ['.js', '.jsx', '.vue', '.scss']
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin()
  ]
}

module.exports = config
