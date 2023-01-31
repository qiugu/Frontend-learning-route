import config from '../config'
import { initUse } from './use'

export function initGlobalAPI (Vue) {
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      console.warn('Do not replace the Vue.config object, set individual fields instead.')
    }
  }
  // Vue构造函数上定义config属性
  Object.defineProperty(Vue, 'config', configDef)

  // use方法
  initUse(Vue)
}