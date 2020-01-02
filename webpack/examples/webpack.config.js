const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const DonePlugin = require('./plugins/DonePlugin.js')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname,'loaders','style-loader.js'),
          path.resolve(__dirname,'loaders','less-loader.js')
        ]
      }
    ]
  },
  plugins: [
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    // }),
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   filename: 'index.html'
    // }),
    new DonePlugin()
  ]
}