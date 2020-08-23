export function initEvents (vm) {
  vm._events = Object.create(null)
  vm._hasHookEvents = false
}

export function eventsMixin (Vue) {}