module.exports = class DonePlugin {
  apply (compiler) {
    compiler.hooks.emit.tap('DonePlugin', () => {
      console.log('编译完成~~~~~')
    })
  }
}