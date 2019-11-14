import { createEmptyVNode } from '../vdom/vnode.js'

export function callHook (vm, hook) {
  
}

export function mountComponent (vm, el, hydrating = false) {
  vm.$el = el
  // 如果vue实例选项中的render方法不存在，则指定render方法为创建一个空的虚拟dom
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode

    if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
      vm.$options.el || el) {
        console.warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
    } else {
      console.warn(
        'Failed to mount component: template or render function not defined.',
        vm
      )
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent

  if (process.env.NODE_ENV !== 'production') {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const vnode = vm._render()
      vm._update(vnode, hydrating)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  return vm
}