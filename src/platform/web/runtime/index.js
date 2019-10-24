import Vue from '../../../core/index'
import { query } from '../util/index'
import { mountComponent } from '../../../core/instance/lifecycle'

const inBrowser = typeof window !== 'undefined'
Vue.prototype.$mount = function(el) {
  el = el && inBrowser ? query(el): undefined
  return mountComponent(this, el)
}