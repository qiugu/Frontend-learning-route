export function callHook (vm, hook) {
  
}

export function mountComponent (vm, el, hydrating = false) {
  vm.$el = el
  if (!vm.$options.render) {}
  callHook(vm, 'beforeMount')
}