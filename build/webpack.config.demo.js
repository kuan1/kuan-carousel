process.env.NODE_ENV = 'production'

const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./webpack.config')

const {
  resolve
} = require('./utils')

const libName = 'kuan-carousel'
const distPath = resolve('demo')

// build config
module.exports = merge(baseConfig, {
  mode: 'production',
  entry: resolve('test'),
  output: {
    path: distPath
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new UglifyJsPlugin()
    ]
  },
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
    new MiniCssExtractPlugin({
      filename: `${libName}.css`,
    }),
    new CleanWebpackPlugin([distPath], {
      root: process.cwd()
    }),
  ]
})