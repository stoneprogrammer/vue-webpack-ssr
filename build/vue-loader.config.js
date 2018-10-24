const docsLoader = require.resolve('./docs-loader.js')

module.exports = (isDev) => {
  return {
    preserveWhitespace: true,
    extractCSS: !isDev,
    cssModule: {},
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
