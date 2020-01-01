const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    vue: ['vue']
  },
  output: {
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      // 配置导出的库的名字，需要和上面的library配置的名字相同
      name: '[name]', 
      // 生成一个目录json文件，用来告诉我们引用的文件的路径位置
      path: path.resolve(__dirname, 'dist', 'manifest.json') 
    })
  ]
}