module.exports = function (source, map) {
  this.callback(
    null,
    'module.exports = function (Content) {Content.options.__docs = ' +
    JSON.stringify(source) +
    '}',
    map
  )
}
