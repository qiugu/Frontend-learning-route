import Vue from '../../../core/index'
import { query, inBrowser } from '../util/index'
import { mountComponent } from '../../../core/instance/lifecycle'

Vue.prototype.$mount = function(el) {
  el = el && inBrowser ? query(el): undefined
  return mountComponent(this, el)
}

// 调试工具的全局钩子，略

export default Vue
