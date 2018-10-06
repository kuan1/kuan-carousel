const webpack = require('webpack')
const buildConfig = require('./build/webpack.config.demo')

// 开始编译
webpack(buildConfig, (err, stats) => {
  const message = `${stats.toString({colors: true})} \n`
  if (err || stats.hasErrors()) {
    console.log(err || message)
    if (onFail) {
      onFail({
        err,
        stats
      });
    }
    process.exit(1);
  }
  console.log(message)
});