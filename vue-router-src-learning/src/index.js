import History from './history'

export default class VueRouter {
  constructor ({ routes }) {
    this.routes = routes
    this.history = new History()
    this.history.listen(path => {
      console.log(path)
      this.path = path
      this.vm.$forceUpdate()
    })
  }

  init (vm) {
    this.vm = vm
  }
}

VueRouter.install = function (Vue) {

  Vue.mixin({
    beforeCreated () {
      if (this.$options.router) {
        this.$options.router.init(this)
      }
    }
  })

  Vue.component('router-view', {
    functional: true,
    render (h) {
      return h(div, {class: 'aaa'})
    }
  })
}
