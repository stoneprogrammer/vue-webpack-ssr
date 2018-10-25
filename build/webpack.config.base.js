const path = require('path')
const vueLoaderOptions = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web', // webpack编译的是web平台
  entry: path.join(__dirname, '../client/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(vue|js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderOptions(isDev)
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(gif|jpg|jpeg|svg)$/,
        use: [
          {
            loader: 'url-loader', // 作用：把图片转换成64位代码, 直接写在JS内容里面，不用再生成一个新的文件
            options: {
              limit: 1024, // 限制图片大小
              name: 'resources/[path][name].[ext]' // 指定输出的文件名字
            }
          }
        ]
      }
    ]
  }
}

module.exports = config
