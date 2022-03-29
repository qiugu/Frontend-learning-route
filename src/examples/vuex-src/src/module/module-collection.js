import Module from './module'
import { forEachValue } from '../util'

export default class ModuleCollection {
  constructor (rawRootModule) {
    // 注册根模块，也就是new Vuex.Store()中传入的options
    this.register([], rawRootModule, false)
  }

  /**
   * 注册模块的方法，如果是注册根模块，路径为[]，嵌套模块路径存储在path中
   * @param {array} path 模块的路径，如果有子路径则加入path数组中 
   * @param {object} rawModule Vuex.Store中的options
   * @param {boolean} runtime 
   */
  register (path, rawModule, runtime = true) {
    const newModule = new Module(rawModule, runtime)

    if (path.length === 0) {
      this.root = newModule
    } else {
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }

    // 如果有嵌套模块，递归注册模块
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }

  // 卸载模块
  unregister (path) {
    const parent = this.get(path.slice(0, -1))
    const key = path[path.length - 1]
    // 如果模块是Vuex.Store中注册的模块，无法卸载
    if (!parent.getChild(key).runtime) return

    parent.removeChild(key)
  }

  // 获取路径下的模块
  get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  // 获取路径下的模块的命名空间
  getNamespace (path) {
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }

  // 模块热重载功能
  update (rawRootModule) {
    update([], this.root, rawRootModule)
  }
}

function update (path, targetModule, newModule) {
  targetModule.update(newModule)

  // 如果有子模块，递归更新子模块
  if (newModule.modules) {
    for (const key in newModule.modules) {
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      )
    }
  }
}