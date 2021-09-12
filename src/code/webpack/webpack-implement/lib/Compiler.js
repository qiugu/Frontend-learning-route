const path = require('path')
const fs = require('fs')
const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const generator = require('@babel/generator').default
const {
  SyncHook
} = require('tapable')
const ejs = require('ejs')

module.exports = class Compiler {
  constructor (config) {
    this.config = config
    this.entryId = null
    this.modules = {}
    this.assets = {}
    this.entry = config.entry
    this.root = process.cwd()
    this.hooks = {
      entryOptions: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }

    const plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this)
      })
    }
    this.hooks.afterPlugins.call()
  }

  getSource (path) {
    let content = fs.readFileSync(path, 'utf8')
    const rules = this.config.module.rules
    rules.forEach(rule => {
      const { test, use } = rule
      let last = use.length - 1
      if (test.test(path)) {
        const normalLoader = () => {
          const loader = require(use[last--])
          content = loader(content)
          if (last >= 0) {
            normalLoader()
          }
        }
        normalLoader()
      }
    })
    return content
  }

  // parse source code
  parse (source, parentPath) {
    let ast = babelParser.parse(source)
    let dependencies = []
    traverse(ast, {
      CallExpression (p) {
        const node = p.node
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduleName = node.arguments[0].value
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')
          moduleName = `./${path.join(parentPath, moduleName)}`
          dependencies.push(moduleName)
          node.arguments = [types.stringLiteral(moduleName)]
        }
      }
    })
    const sourceCode = generator(ast).code
    return { sourceCode, dependencies }
  }

  buildModule (modulePath, isEntry) {
    // get module content
    const source = this.getSource(modulePath)
    // get module name
    const moduleName = `./${path.relative(this.root, modulePath)}`
    if (isEntry) {
      this.entryId = moduleName
    }
    const {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName))
    this.modules[moduleName] = sourceCode
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false)
    })
  }

  // parse code to template
  emitFile () {
    const main = path.join(this.config.output.path, this.config.output.filename || 'bundle.js')
    const templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    const code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules })
    this.assets[main] = code
    fs.writeFileSync(main, code)
  }

  run () {
    this.hooks.run.call()
    this.hooks.compile.call()
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompile.call()
    this.emitFile()
    this.hooks.emit.call()
    this.hooks.done.call()
  }
}