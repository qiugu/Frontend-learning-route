const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'docs')
  },
  resolve: {
    extensions: ['.ts','.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?x$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '前端修行录',
      filename: path.resolve(__dirname, 'docs/index.html'),
      template: path.resolve(__dirname, 'public/index.html'),
      favicon: path.resolve(__dirname, 'public/favicon.svg'),
      inject: 'body',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0, minimum-scale=1.0',
        keywords: 'Frontend interviews 前端 前端修行 学习路线 面试 笔记',
        description: '前端修行路是一个包含前端学习路线，面试知识点合辑，构建自己的前端体系的站点'
      }
    })
  ]
}
