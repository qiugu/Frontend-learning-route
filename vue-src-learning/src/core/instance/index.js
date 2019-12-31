import { initMixin } from './init'
import { stateMixin } from './state'
import { eventsMixin } from './events'

function Vue (options) {
  // 判断当前的环境，并且上下文this如果不是Vue的子对象，则发出警告
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    console.warn('Vue is a constructor')
  }
  // 初始化传入的Vue的选项对象
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)

export default Vue
