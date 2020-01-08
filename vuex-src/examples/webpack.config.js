const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    app: ['webpack-hot-middleware/client', path.join(__dirname, 'main.js')]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '__build__'),
    publicPath: '/__build__/'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.vue$/, use: 'vue-loader' }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}