import Vue from 'platform/web/entry-runtime-with-compiler'
// import App from './App'

const vue = new Vue({
  // render: h => h(App) 
  data: {
    foo: 'bar'
  },
  template: `<div>hello Vue</div>`
})

console.log(vue)
