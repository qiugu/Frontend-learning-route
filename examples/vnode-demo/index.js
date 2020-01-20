import { h, render } from '../../vue-src/vnode/render'
const isActive = 'is-active'
const app = h('div',{
  style: {
    width: '200px',
    height: '200px',
    background: 'red'
  },
  class: ['container', {
    'is-active': true,
    'is-focus': true
  }]
},'hello VNode')
console.log(app)
render(app, document.querySelector('#app'))
