import { h, render, Fragment, Portal } from '../../vue-src/vnode/render'

class Component {
  render () {
    return h('div', {
      style: {
        background: 'yellow'
      }
    },
    [
      h('p', null, '我是子元素1'),
      h('p', null, '我是子元素2')
    ])
  }
}

const app = h(Component,{},[h('span',null,'我是子标签1'),h('span',null,'我是子标签2')])
console.log(app)
render(app, document.querySelector('#app'))
