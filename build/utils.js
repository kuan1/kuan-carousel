const fs = require('fs')
const path = require('path')

// 获取绝对路径
function resolve(dir) {
  const basePath = process.cwd()
  return path.join(basePath, dir)
}

// 日志
function log(data) {
  if (process.env.NODE_ENV === 'production') return
  const logPath = path.resolve(__dirname, 'log.json')
  try {
    fs.writeFileSync(logPath, JSON.stringify(data, null, 2), 'utf-8')
    console.log('- 已经保存日志')
  } catch (e) {
    console.log('失败', e)
  }
}

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'

console.log('NODE_ENV: ', process.env.NODE_ENV)

// cssLoader
const getCssLoader = (name) => {
  const loaders = [{
      loader: !isProd ? 'style-loader' : MiniCssExtractPlugin.loader
    }, // 将 JS 字符串生成为 style 节点
    {
      loader: 'css-loader'
    }, // 将 CSS 转化成 CommonJS 模块
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [
          require('autoprefixer')({
            'browsers': ['> 1%', 'last 2 versions']
          })
        ],
      }
    },
  ]
  if (name) loaders.push({
    loader: `${name}-loader` // 将 Sass 编译成 CSS
  })

  return loaders
}

module.exports = {
  lessLoader: getCssLoader('less'),
  sassLoader: getCssLoader('sass'),
  cssLoader: getCssLoader(),
  log,
  resolve
}