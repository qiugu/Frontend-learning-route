import ModuleCollection from "./module/module-collection"
import { isPromise, forEachValue, partial, assert, isObject } from "./util"

let Vue

export class Store {
  constructor (options = {}) {
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      // 执行install方法，防止重复安装Vuex
      install(window.Vue)
    }

    const {
      plugins = [],
      strict = false
    } = options

    this._committing = false
    // 存储将模块中的所有actions封装一层的对象
    this._actions = Object.create(null)
    // 收集actions变化的回调函数的数组
    this._actionSubscribers = []
    // 存储将模块中的所有mutations封装一层的对象
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    // 存储模块的对象，是ModuleCollection的实例
    this._modules = new ModuleCollection(options)
    // 模块的命名空间映射对象，key为namespace，value为模块对象
    this._modulesNamespaceMap = Object.create(null)
    // 收集mutations变化的回调方法数组
    this._subscribers = []
    this._watcherVM = new Vue()
    // 缓存带命名空间前缀属性的getters的对象
    this._makeLocalGettersCache = Object.create(null)

    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // 是否严格模式
    this.strict = strict
    // 获取初始化选项中的state
    const state = this._modules.root.state
    // 安装模块
    installModule(this, state, [], this._modules.root)
    resetStoreVM(this, state)

    // 执行插件方法
    plugins.forEach(plugin => plugin(this))
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `use store.replaceState() to explicit replace store state.`)
    }
  }

  dispatch (_type, _payload) {
    const {type, payload, options} = unifyObjectStyle(_type, _payload, _options)

    const action = { type, payload }
    const entry = this._actions[type]

    try {
      this._actionSubscribers
        .slice()
        .filter(sub => sub.before)
        .forEach(sub => sub.before(action, state))
    } catch (err) {
      console.error(err)
    }

    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    return result.then(res => {
      try {
        this._actionSubscribers
          .filter(sub => sub.after)
          .forEach(sub => sub.after(action, this.state))
      } catch (err) {
        console.error(err)
      }
      return res
    })
  }

  commit (_type, _payload, _options) {
    const {type, payload, options} = unifyObjectStyle(_type, _payload, _options)
    const mutation = { type, payload }
    const entry = this._mutations[type]

    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })

    // 通知订阅者调用回调
    this._subscribers
      .slice()  // 浅复制，以防止在订阅者同步调用取消订阅时迭代器失效
      .forEach(sub => sub(mutation, this.state))
  }

  // 订阅mutations方法
  subscribe (fn) {
    return genericSubscribe(fn, this._subscribers)
  }

  // 订阅actions方法
  subscribeAction (fn) {
    // fn如果是一个方法的话，则转变成一个对象形式
    const subs = typeof fn === 'function' ? { before: fn } : fn
    return genericSubscribe(subs, this._actionSubscribers)
  }

  _withCommit (fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }
}

/**
 * 将订阅方法加入订阅数组中，返回一个函数，执行该函数，将订阅的函数从订阅数组中删除，即取消订阅
 * @param {function} fn 订阅的回调方法 
 * @param {array} subs 订阅方法的数组
 */
function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn)
  }
  return () => {
    const i = subs.indexOf(fn)
    if (i > -1) {
      subs.slice(i, 1)
    }
  }
}

/**
 * 将mutations、actions、getters放入数组中
 * @param {Store} store Store的实例
 * @param {object} rootState Store中的根模块的state
 * @param {array} path 模块名称，如果是根模块，则path为[]
 * @param {Module} module Module的实例，保存每个模块的对象
 * @param {boolean} hot 是否热重载
 */
function installModule (store, rootState, path, module, hot) {
  // 是否为根模块，即路径为[]
  const isRoot = !path.length
  // 获取模块的命名空间
  const namespace = store._modules.getNamespace(path)

  // 如果模块存在namespaced选项，则将模块存入_modulesNamespaceMap中
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  // 非根模块并且非热重载的情况下
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    // 在Vue实例上添加响应式对象
    /* 形如state = {
    *     count: 0,
    *     app: {
    *       id: '213214ddasdasdasd',
    *       main: {
    *         other: 'aaa'
    *       }
    *     }
    *   }
    */
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state)
    })
  }

  // 创建每个模块的本地上下文环境
  const local = module.context = makeLocalContext(store, namespace, path)

  // 遍历模块中的mutations、actions、getters，并进行注册
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  // 如果有子模块，递归安装子模块
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}

function resetStoreVM (store, state, hot) {
  const oldVm = store._vm
  store.getters = {}
  store._makeLocalGettersCache = Object.create(null)
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = partial(fn, store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true
    })
  })

  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  if (store.strict) {
    // 略
  }

  if (oldVm) {
    if (hot) {
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}

/**
 * 将子模块嵌套到state属性中
 * const state = {
 *    count: 0
 * }
 * path = ['app','main']
 * return state[app][main]
 */
function getNestedState (state, path) {
  return path.reduce((state, key) => state[key], state)
}

function makeLocalContext (store, namespace, path) {
  // 保存命名空间是否存在
  const noNamespace = namespace === ''

  // 保存当前module上保存的上下文属性
  const local = {
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
      }
 
      return store.dispatch(type, payload)
    },
    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args
      if (!options || !options.root) {
        type = namespace + type
      }

      store.commit(type, payload, options)
    }
  }

  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}

// 对带有命名空间的模块的getters进行处理
// 生成将命名空间去掉的对象
function makeLocalGetters (store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    const gettersProxy = {}
    const splitPos = namespace.length
    Object.keys(store.getters).forEach(type => {
      if (type.slice(0, splitPos) !== namespace) return

      const localType = type.slice(splitPos)

      Object.defineProperty(gettersProxy, localType, {
        get: () => store.getters[type],
        enumerable: true
      })

      store._makeLocalGettersCache[namespace] = gettersProxy 
    })
  }

  return store._makeLocalGettersCache[namespace]
}

// 将mutations的方法封装一层存入_mutations中，commit调用的时候调用此封装方法wrappedMutationHandler
function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}

// 同上注册调用actions的封装方法，存入_actions中
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit, 
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload)

    // 如果actions调用的返回值不是Promise，则包装为Promise
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    return
  }

  // 该类型的type不存在的时候，赋给它一个新的封装方法
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state,
      local.getters,
      store.state,
      store.getters
    )
  }
}

function unifyObjectStyle (type, payload, options) {
  // 如果是type是对象类型
  /**
   * store.commit({
   *  type: 'increment',
   *  payload: '10'
   * })
   */
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }

  return { type, payload, options }
}

export function install (_Vue) {
  // 将vuex全局注入组件及其子组件中
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      const options = this.$options
      // 全局混入，当前组件有store属性，则定义$store访问
      // 否则去parent父组件选项中访问$store属性
      // 子组件始终获取顶层属性中的store属性，并且可以使用this.store访问
      if (options.store) {
        this.$store = typeof options.store === 'function'
          ? options.store()
          : options.store
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    }
  })
}
