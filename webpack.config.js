const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin') // 作用：把非javascript的文件单独打包成一个静态资源文件, 单独做浏览器缓存
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web', // webpack编译的是web平台
  entry: './src/index.js',
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      // {
      //   test: /\.css$/,   没有用到.css文件，所以去掉
      //   use: [
      //     'style-loader', // 这个的功能是定屋html文件里面
      //     'css-loader'
      //   ]
      // },
      // {
      //   test: /\.styl/, 分环境配置.styl文件的处理
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         sourceMap: true //我们使用stylus-loader它会自动生成sourceMap, postcss-loader也会自动生成sourceMap, 当前面有处理器生成了sourceMap,它可以直接使用前面的。这样的好处就是编译的效率更快。
      //       }
      //     },
      //     'stylus-loader' // 专门用来处理.styl文件的，处理完是什么东西？是CSS内容
      //   ]
      // },
      {
        test: /\.(gif|jpg|jpeg|svg)$/,
        use: [
          {
            loader: 'url-loader', // 作用：把图片转换成64位代码, 直接写在JS内容里面，不用再生成一个新的文件
            options: {
              limit: 1024, // 限制图片大小
              name: '[name].[ext]' // 指定输出的文件名字
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // 在webpack编译过程中以及我们在页面上写的JS代码去判断环境，都可以去调用process.env.NODE_ENV进行判断,就是在这里定义了，我们在写JS代码是可以用到的，
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin()
  ]
}

if (isDev) {
  // 开发环境
  config.module.rules.push({
    // 开发环境使用css的文件是.styl
    test: /\.styl/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true //我们使用stylus-loader它会自动生成sourceMap, postcss-loader也会自动生成sourceMap, 当前面有处理器生成了sourceMap,它可以直接使用前面的。这样的好处就是编译的效率更快。
        }
      },
      'stylus-loader' // 专门用来处理.styl文件的，处理完是什么东西？是CSS内容
    ]
  })
  config.devtool = '#cheap-module-eval-source-map' // 定位代码错误位置
  config.devServer = {
    port: 8000, // 端口号
    host: '0.0.0.0', // 可以监听很多(可以通过)localhost 127.0.0.1来进行访问, 同时也可能通过本机的内网IP来进行访问,如果直接设置成localhost，通过IP是访问不了的，通过IP访问有什么好处了，可能在别人的电脑，访问我这台电脑，调试手机页面的时候，可以通过手机来连接我们的电脑，
    overlay: {
      // 在进行编译的过程中，如果有任何的错误，我们都让它显示到我们的网页上面，
      errors: true
    },
    // historyFallbakc: {
    //   // 映射到入口文件
    // },
    hot: true, // 改了一个组件的代码，只渲染当前组件，不会让整个页面重新加载
    open: true // 作用启动npm run dev的时候自动打开浏览器
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  // 生产环境
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
    test: /\.styl/,
    use: ExtractPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'stylus-loader'
      ]
    })
  })
  config.plugins.push(
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, './')
    }),
    new ExtractPlugin('styles.[contentHash:8].css'),
    new webpack.optimize.CommonsChunkPlugin({
      // 将 vue框架打包成一个单凭的文件
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // 把webpack相关的代码单独打包到一个文件里面，指定一个name在entry里面没有使用过的名字，一般来说会使用runtime, 就是把webpack生成在app.136b229a.js里面的webpack里面相关的代码，单独的打包到一个文件里面去，这么打包会有一个什么好处呢？在有新的模块加入的时候，webpack是会给每一个模块，加一个ID上去，然后有新的模块加入的时候，它插入的顺序会在中间，后面每一个模块的ID都会发生变化，发生变化之后，就会导致打包出来的内容，它的hash会产生一定的变化，那么hash想要浏览器长缓存这个作用就失去了效果，那么我们使用这种方法就可以规避这个问题？注意vendor一定要放在runtime前面
      name: 'runtime'
    })
  )
}

module.exports = config
