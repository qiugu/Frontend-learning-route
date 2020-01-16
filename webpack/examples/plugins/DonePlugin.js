module.exports = class DonePlugin {
  apply (compiler) {
    compiler.hooks.emit.tap('DonePlugin', (compilation) => {
      console.log(compilation.assets['main.js'].source())
      console.log('编译完成~~~~~')
    })
  }
}