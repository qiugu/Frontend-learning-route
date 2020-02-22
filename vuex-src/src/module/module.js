import { forEachValue } from "../util"

export default class Module {
  constructor (rawModule, runtime) {
    // 表示是否Vuex.Store中注册的初始模块，默认初始模块runtime为false
    this.runtime = runtime
    // 保存子模块, 也就是modules属性中的模块
    this._children = Object.create(null)
    // 保存vuex中的配置项
    this._rawModule = rawModule
    // 保存配置项中的state
    const rawState = rawModule.state
    // 判断state的类型是不是function
    this.state = (typeof rawState === 'function' ? rawState(): rawState) || {}
  }

  // 判断配置中是否有namespaced属性
  get namespaced () {
    return !!this._rawModule.namespaced
  }

  // 添加子模块
  addChild (key, module) {
    this._children[key] = module
  }

  // 移除子模块
  removeChild (key) {
    delete this._children[key]
  }

  // 获取对应key的子模块
  getChild (key) {
    return this._children[key]
  }

  // 更新模块
  update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }

  // 遍历子模块，将key、value传入fn中执行
  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  // 遍历初始模块中的getters、actions、mutations，将其传入fn中执行
  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}