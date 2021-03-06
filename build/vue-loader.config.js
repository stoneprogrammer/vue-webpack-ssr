const docsLoader = require.resolve('./docs-loader.js')

module.exports = (isDev) => {
  return {
    preserveWhitespace: true,
    extractCSS: !isDev,
    cssModules: {
      localIdentName: isDev ? '[path][name]-[hash:base64:5]' : '[hash:base64:5]',
      camelCase: true
    },
    // loaders: {
    //   // js: 'coffee-loader'
    //   docs: docsLoader
    // }
    // preLoaders: {
    //   js: '/path/to/custom/loader'
    // },
    // postLoaders: {
    //   html: 'babel-loader'
    // }
  }
}
