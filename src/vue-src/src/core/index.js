import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'

// 初始化全局api
initGlobalAPI(Vue)

Vue.version = '__VERSION__'

export default Vue