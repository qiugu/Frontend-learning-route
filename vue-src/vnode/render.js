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

export function render(vnode, container) {
  const oldVnode = container.vnode
}
