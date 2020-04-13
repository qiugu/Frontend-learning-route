import {VNodeFlags, VNode, ChildrenFlags} from './vnode'
import { mount, domPropsRE } from './render'

/**
 * 对两个节点进行比较
 * @param {VNode} prevVNode 旧的节点
 * @param {VNode} nextVNode 新节点
 * @param {HTMLElement} container 挂载的dom元素
 */
export function patch(prevVNode, nextVNode, container) {
  const nextFlags = nextVNode.flags
  const prevFlags = prevVNode.flags

  // 只有当两个vnode相同时，才会进行比较，如果不同的话，则是进行替换操作
  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode, container)
  }
}

/**
 * 替换节点
 * @param {VNode} prevVNode 旧节点
 * @param {VNode} nextVNode 新节点
 * @param {HTMLElement} container 挂载dom元素
 */
function replaceVNode(prevVNode, nextVNode, container) {
  container.removeChild(prevVNode.el)
  mount(nextVNode, container)
}

/**
 * 更新元素节点
 * @param {VNode} prevVNode 旧节点
 * @param {VNode} nextVNode 新节点
 * @param {HTMLElement} container 挂载dom元素
 */
function patchElement(prevVNode, nextVNode, container) {
  // 节点标签相同，则替换节点
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  const el = (nextVNode.el = prevVNode.el)
  const prevData = prevVNode.data
  const nextData = nextVNode.data

  if (nextData) {
    for(let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    }
  }

  if (prevData) {
    for(let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue && !nextData.hasOwnProperty(key)) {
        patchData(el, key, prevValue, null)
      }
    }
  }

  // 更新vnode中的子节点
  patchChildren(
    prevValue.childFlags,
    nextValue.childFlags,
    prevVNode.children,
    nextValue.children,
    el
  )
}

function patchComponent() {}

/**
 * 对比文本节点
 * @param {VNode} prevVNode 
 * @param {VNode} nextVNode 
 */
function patchText(prevVNode, nextVNode) {
  const el = (nextVNode.el = prevVNode.el)
  if (nextVNode.children != prevVNode.children) {
    el.nodeValue = nextVNode.children
  }
}

function patchFragment() {}

function patchPortal() {}

/**
 * 对比新旧节点上的数据
 * @param {HTMLElement} el 挂载的dom元素 
 * @param {string} key dom元素上的属性，包括styles、props、classes、事件监听
 * @param {any} prevValue 旧节点上的数据 
 * @param {any} nextValue 新节点上的数据
 */
function patchData(el, key, prevValue, nextValue) {
  switch(key) {
    case 'style':
      for(let k in nextValue) {
        el.style[k] = nextValue[k]
      }
      for(let k in prevValue) {
        if (!nextValue.hasOwnProperty(k)) {
          el.style[k] = ''
        }
      }
      break;
    case 'class':
      el.className = nextValue
      break
    default:
      // 挂载事件
      if (key.slice(0, 2) === 'on') {
        // 移除旧节点上的事件回调
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue);
        }

        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue)
        }
      } else if (domPropsRE.test(key)) {
        el[key] = nextValue
      } else {
        el.setAttribute(key, nextValue)
      }
  }
}

/**
 * 对比子节点的不同
 * @param {ChildrenFlags} prevChildFlags 旧节点的子节点的类型
 * @param {ChildrenFlags} nextChildFlags 新节点的子节点的类型
 * @param {VNode[]} prevChildren 旧节点的子节点
 * @param {VNode[]} nextChildren 新节点的子节点
 * @param {HTMLElement} container 挂载的dom元素
 */
function patchChildren(prevChildFlags, nextChildFlags, prevChildren, nextChildren, container) {
  switch(prevChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      if (nextChildFlags === ChildrenFlags.SINGLE_VNODE) {
        // 如果新旧子节点都是单节点，那么直接递归对比两个子节点
        patch(prevChildren, nextChildren, container)
      }
      else if (nextChildFlags === ChildrenFlags.NO_CHILDREN) {
        // 新节点没有子节点的话，则移除旧节点的子节点即可
        container.removeChild(prevChildren.el);
      }
      else {
        container.removeChild(prevChildren.el);
        for(let i = 0; i < nextChildren.length; i++) {
          mount(nextChildren[i], container)
        }
      }
      break
    case ChildrenFlags.NO_CHILDREN:
      if (nextChildFlags === ChildrenFlags.SINGLE_VNODE) {
        mount(nextChildren, container)
      }
      // 新旧节点都没有子节点，那么什么都不做
      else if (nextChildFlags === ChildrenFlags.NO_CHILDREN) break
      else {
        for(let i = 0; i < nextChildren.length; i++) {
          mount(nextChildren[i], container)
        }
      }
      break
    default:
      if (nextChildFlags === ChildrenFlags.SINGLE_VNODE) {
        for(let i = 0; i < prevChildren.length; i++) {
          container.removeChild(prevChildren[i].el)
        }
        mount(nextChildren, container)
      }
      else if (nextChildFlags === ChildrenFlags.NO_CHILDREN) {
        for(let i = 0; i < prevChildren.length; i++) {
          container.removeChild(prevChildren[i].el)
        }
      }
      else {
        // 旧节点有多个子节点，新节点也有多个子节点，简化版核心diff
        for(let i = 0; i < prevChildren.length; i++) {
          container.removeChild(prevChildren[i].el)
        }
        for(let i = 0; i < nextChildren.length; i++) {
          mount(nextChildren[i], container)
        }
      } 
  }
}
