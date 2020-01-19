export const VNodeFlags = {
  // html标签
  ELEMENT_HTML: 1,
  // svg标签
  ELEMENT_SVG: 1 << 1,
  // 普通有状态的组件
  COMPONENT_STATEFUL_NORMAL: 1 << 2,
  // 需要keep-alive的有状态组件
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
  // 已经被keep-alive的有状态组件
  COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
  // 函数式组件
  COMPONENT_FUNCTIONAL: 1 << 5,
  // 纯文本
  TEXT: 1 << 6,
  // Fragment
  FRAGMENT: 1 << 7,
  // Portal
  PORTAL: 1 << 8,
  // // html元素类型
  // ELEMENT: VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG,
  // // 有状态组件
  // COMPONENT_STATEFUL: VNodeFlags.COMPONENT_STATEFUL_NORMAL | VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE | VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE,
  // // 组件类型
  // COMPONENT: VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL
}

export const ChildrenFlags = {
  // 未知的子节点
  UNKNOWN_CHILDREN: 0,
  // 没有子节点
  NO_CHILDREN: 1,
  // 只有一个子节点
  SINGLE_VNODE: 1 << 1,
  // 包含key属性的多个子节点
  KEYED_VNODES: 1 << 2,
  // 没有key属性的多个子节点
  NONE_KEYED_VNODES: 1 << 3,
  // 多节点类型
  // MULTIPLE_VNODES: ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES
}

export default class VNode {
  constructor (tag, data, children, el, flags = undefined, childrenFlags = undefined) {
    this._isNode = true
    this.tag = tag
    this.data = data
    this.children = children
    this.el = el,
    this.flags = flags
    this.childrenFlags = childrenFlags
  }
}