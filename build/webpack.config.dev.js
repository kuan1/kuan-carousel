process.env.NODE_ENV = 'development'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config')
const {
  resolve
} = require('./utils')

const entry = resolve('src/demo')

// dev config
const devConfig = {
  mode: 'development',
  entry,
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyJS: true,
        minifyCSS: true
      },
      chunksSortMode: 'dependency'
    }),
  ]
}

module.exports = merge(baseConfig, devConfig)