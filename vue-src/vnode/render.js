import VNode, {VNodeFlags, ChildrenFlags} from './vnode'

export const Fragment = Symbol()
export const Portal = Symbol()

// 创建vnode
export function h(tag, data = null, children = null) {
  // 确定vnode的类型
  let flags
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target
  } else {
    if (tag !== null && typeof tag === 'object') {
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL
    } else if (typeof tag === 'function') {
      // 如果是类组件的情况
      flags = tag.prototype && tag.prototype.render
        ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
        : VNodeFlags.COMPONENT_FUNCTIONAL
    }
  }

  // 确定子vnode的类型
  let childFlags
  if (Array.isArray(children)) {
    const length = children.length
    if (length === 0) {
      childFlags = ChildrenFlags.NO_CHILDREN
    } else if (length === 1) {
      childFlags = ChildrenFlags.SINGLE_VNODE
      children = children[0]
    } else {
      childFlags = ChildrenFlags.KEYED_VNODES
      children = normalizeVNodes(children)
    }
  } else if (children == null) {
    childFlags = ChildrenFlags.NO_CHILDREN
  } else if (children._isVNode) {
    childFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    childFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children + '')
  }

  // 初始化data中数据
  if (data && data.class) {
    data.class = normalizeClass(data.class)
  }

  return new VNode(tag, data, children, null, flags, childFlags)
}

// 将子节点中不带key的节点添加默认key
function normalizeVNodes(children) {
  const newChildren = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key == null) {
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  return newChildren
}

// 创建文本节点
function createTextVNode(text) {
  return new VNode(null, null, text, null, VNodeFlags.TEXT, ChildrenFlags.NO_CHILDREN)
}

// 渲染函数，将vnode挂载到指定的dom元素上
export function render(vnode, container) {
  const oldVNode = container.vnode
  // 旧节点不存在时
  if (oldVNode == null) {
    if (vnode) {
      mount(vnode, container)
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      patch(oldVNode, vnode, container)
      container.vnode = vnode
    } else {
      container.removeChild(oldVNode.el)
      container.vnode = null
    }
  }
}

// 根据vnode的flags执行不同的挂载方法
function mount(vnode, container) {
  const { flags } = vnode
  if (flags & VNodeFlags.ELEMENT) {
    mountElement(vnode, container)
  } else if (flags & VNodeFlags.COMPONENT) {
    mountComponent(vnode, container)
  } else if (flags & VNodeFlags.TEXT) {
    mountText(vnode, container)
  } else if (flags & VNodeFlags.FRAGMENT) {
    mountFragment(vnode, container)
  } else if (flags & VNodeFlags.PORTAL) {
    mountPortal(vnode, container)
  }
}

// 挂载原生dom元素
function mountElement (vnode, container, isSVG) {
  const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/
  // 判断是否是svg元素
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag)
  vnode.el = el
  const data = vnode.data

  // 将data中数据加入dom中
  if (data) {
    for (const key in data) {
      switch(key) {
        case 'style': {
          for (const styl in data.style) {
            el.style[styl] = data.style[styl]
          }
          break
        }
        case 'class':
          el.className = data[key]
          break
        default:
          if (key[0] === 'o' && key[1] === '1') {
            el.addEventListener(key.slice(2), data[key])
          } else if (domPropsRE.test(key)) {
            el[key] = data[key]
          } else {
            el.setAttribute(key, data[key])
          }
      }
    }
  }

  // 当子节点不为空
  // 当子节点是单个节点时
  // 当子节点是多个节点时，遍历子元素
  const child = vnode.children
  const childFlags = vnode.childrenFlags
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags === ChildrenFlags.SINGLE_VNODE) {
      mount(child, el, isSVG)
    } else if (childFlags === ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < child.length; i++) {
        mount(child[i], el, isSVG)
      }
    }
  }

  container.appendChild(el)
}
function mountComponent () {}
function mountText (vnode, container) {
  const el = document.createTextNode(vnode.children)
  vnode.el = el
  container.appendChild(el)
}
function mountFragment () {}
function mountPortal () {}

// 动态class绑定
function normalizeClass(val) {
  let res = ''
  if (typeof val === 'string') {
    res = val
  } else if (Array.isArray(val)) {
    for (let i = 0; i < val.length; i++) {
      res += normalizeClass(val[i]) + ' '
    } 
  } else if (typeof val === 'object') {
    res = res += Object.keys(val).filter(key => val[key]).join(' ')
  }
  return res.trim()
}
