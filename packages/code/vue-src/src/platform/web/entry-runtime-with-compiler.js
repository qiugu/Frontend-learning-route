import Vue from './runtime/index'
import { query } from './util/index'

const idToTemplate = id => {
  const el = query(id)
  return el && el.innerHTML
}

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el, hydrating) {
  el = el && query(el)
  // 判断挂载的元素是不是document.body 或者是document.documentElement
  // 如果是的话，发出警报，直接返回Vue.prototype
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && console.warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        template = idToTemplate(template)

        if (process.env.NODE_ENV !== 'production' && !template) {
          console.warn(
            `Template element not found or is empty: ${options.template}`,
            this
          )
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }

    if (template) {
      // 这里是将template模板编译成渲染函数的方法
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * 获取元素的outerHTML，同时在IE中处理svg元素
 * @param {Elment} el 
 */
function getOuterHTML (el) {
  // 如果outerHTML属性存在，则返回属性值
  // outerHTML属性表示包含元素标签内容的序列化的片段
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

// Vue.compile = compileFunction

export default Vue