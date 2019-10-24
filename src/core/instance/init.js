import { mergeOptions } from '../util/index'

let uid = 0
export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this
    vm.uid = uid++

    vm._isVue = true

    if (options && options._isComponent) {

    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

    // 如果选项中包含el挂载的元素，则挂载到Vue实例上
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
    // 初始化的时候。触发created钩子
    callHook(vm, 'created')
  }
}

export function resolveConstructorOptions () {}