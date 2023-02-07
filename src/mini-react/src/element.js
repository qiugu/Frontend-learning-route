function FiberNode(tag, props, key) {
  this.tag = tag;
  this.props = props;
  this.key = key;

  // 父fiber节点
  this.return = null;
  // 第一个子fiber节点
  this.child = null;
  // 兄弟fiber节点
  this.sibling = null;
  // 真实节点的引用
  this.stateNode = null;
  // DOM节点的引用
  this.ref = null;

  // 冻结该对象，防止用户修改对象
  Object.preventExtensions(this);
}

function ReactElement(type, props, ...children) {
  const element = {
    // 唯一标识react元素的地方
    $$type: Symbol('REACT_ELEMENT_TYPE'),
    type,
    props: {
      ...props,
      children
    }
  }

  // 冻结对象
  Object.freeze(element.props);
  Object.freeze(element);

  return element;
}

export {
  FiberNode,
  ReactElement
}
