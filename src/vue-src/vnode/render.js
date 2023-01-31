import VNode, {VNodeFlags, ChildrenFlags} from './vnode'
import { patch } from './patch'

export const Fragment = Symbol()
export const Portal = Symbol()
export const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/

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
export function mount(vnode, container) {
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
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(child, el, isSVG)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < child.length; i++) {
        mount(child[i], el, isSVG)
      }
    }
  }

  container.appendChild(el)
}

// 挂载组件
function mountComponent (vnode, container, isSVG) {
  const { flags } = vnode
  if (flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else if (flags & VNodeFlags.COMPONENT_FUNCTIONAL) {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

// 挂载文本节点
function mountText (vnode, container) {
  const el = document.createTextNode(vnode.children)
  vnode.el = el
  container.appendChild(el)
}

// 挂载fragment
function mountFragment (vnode, container, isSVG) {
  const child = vnode.children
  const childFlags = vnode.childrenFlags
  // 根据子元素的标识符，执行相应的挂载
  // 如果是单个子元素，将vnode的el引用设置为子元素的el
  // 如果是没有子元素，则创建文本节点，将vnode引用指向文本节点
  // 多个子元素的情况下，vnode的引用指向子元素的第一个元素
  switch(childFlags) {
    case ChildrenFlags.SINGLE_VNODE: {
      mount(child, container, isSVG)
      vnode.el = child.el
      break
    }
    case ChildrenFlags.NO_CHILDREN: {
      const text = createTextVNode('')
      mountText(text, container)
      vnode.el = text.el
      break
    }
    default: {
      for (let i = 0; i < child.length; i++) {
        mount(child[i], container, isSVG) 
      }
      vnode.el = child[0].el
    }
  }
}

// 挂载Portal
function mountPortal (vnode, container) {
  const { tag, children, childrenFlags } = vnode
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag

  if (!target) throw new Error('mount element is not exist')

  if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
    mount(children, target)
  } else if (childrenFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      mount(children[i], target)
    }
  }

  const text = createTextVNode('')
  mountText(text, container, null)
  vnode.el = text.el
}

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

// 挂载有状态组件，tag指向组件
function mountStatefulComponent(vnode, container, isSVG) {
  const { children, childrenFlags } = vnode
  // 创建组件实例
  const instance = vnode.children = new vnode.tag()
  instance.$props = vnode.data
  
  instance._update = function() {
    // 判断实例是否已经挂载了，如果是已经挂载则比较新旧节点
    if (instance._mounted) {
      const prevVNode = instance.$vnode
      const nextVNode = (instance.$vnode = instance.render())
      patch(prevVNode, nextVNode, prevVNode.el.parentNode)
      instance.$el = vnode.el = instance.$vnode.el
    } else {
      // 调用组件实例上的render方法生成vnode
      instance.$vnode = instance.render()
      // 挂载vnode
      mount(instance.$vnode, container, isSVG)
      // 已经挂载了实例，则将_mounted置为true
      instance._mounted = true
      // el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
      instance.$el = vnode.el = instance.$vnode.el
      // 调用mounted钩子
      instance.mounted && instance.mounted()
    }
  }

  instance._update()

  // 如果挂载的组件中含有子元素
  if (children) {
    if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(children, instance.$el, isSVG)
    } else if (childrenFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], instance.$el, isSVG)
      }
    } 
  }
}

// 挂载函数式组件
function mountFunctionalComponent(vnode, container, isSVG) {
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () => {
      // 判断节点是初次挂载还是更新节点
      // 节点的旧节点存在，表示之前已经挂载了，现在就是更新节点
      if (vnode.handle.prev) {
        const prevVNode = vnode.handle.prev
        const nextVNode = vnode.handle.next
        const prevTree = prevVNode.children
        const props = nextVNode.data
        const nextTree = nextVNode.children = nextVNode.tag(props)
        patch(prevTree, nextTree, vnode.handle.container)
      } else {
        // 函数式组件没有实例，直接将props传入函数中即可
        const props = vnode.data
        // 函数式组件直接执行对应的函数方法即可
        const $vnode = vnode.children = vnode.tag(props)
        mount($vnode, container, isSVG)
        vnode.el = $vnode.el
      }
    }
  }

  vnode.handle.update()
}
