import { mergeOptions } from '../util/index'
import { callHook, initLifecycle } from './lifecycle'
import { initEvents } from './events'

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
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    // 解析事件，渲染方法后调用钩子
    callHook(vm, 'beforeCreated')
    // 解析注入和options选项method、data选项后。触发created钩子
    callHook(vm, 'created')
    // 如果选项中包含el挂载的元素，则挂载到Vue实例上
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function resolveConstructorOptions () {}