import Vue from '../src/platform/web/entry-runtime-with-compiler.js'

const vue = new Vue({
  data: {
    foo: 'bar'
  }
}).$mount('#app')

console.log(Vue.prototype)
