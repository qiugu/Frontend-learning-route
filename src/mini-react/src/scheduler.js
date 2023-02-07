import { ELEMENT_TEXT, TAG_HOST, TAG_ROOT, TAG_TEXT } from "./constant.js";

/**
 * 从根节点开始渲染
 */
// 下一个工作单元
var nextUnitOfWork = null;
// 内存中的根fiber
var workInProgressRoot = null;
function scheduleRoot(rootFiber) {
  workInProgressRoot = rootFiber;
  nextUnitOfWork = rootFiber;
}

function workLoop(deadline) {
  // 是否要让出控制权
  var shouldYield = false;
  while (nextUnitOfWork !== null && !shouldYield) {
    nextUnitOfWork = performUnitOfWork();
    shouldYield = deadline.timeRemaining() < 1;
  }
  console.log('render阶段结束');
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(currentFiber) {
  beginWork(currentFiber);
  if (currentFiber.child) {
    return currentFiber.child;
  }

  while (currentFiber !== null) {
    // 没有子节点的话，完成当前节点
    completeUnitOfWork(currentFiber);
    // 如果有兄弟节点，则返回兄弟节点
    if (currentFiber.sibling) {
      return currentFiber.sibling;
    }
    // 都完成以后，返回父节点
    currentFiber = currentFiber.return;
  }
}

function beginWork(currentFiber) {
  switch (currentFiber.tag) {
    case TAG_ROOT:
      updateHostRoot(currentFiber);
      break;
    case TAG_TEXT:
      updateHostText(currentFiber);
      break;
    case TAG_HOST:
      updateHost(currentFiber);
      break;
  }
}

function updateHostText() { }

function updateHost(currentFiber) {
  if (currentFiber.stateNode === null) {
    createDOM(currentFiber);
  }
}

function createDOM() {
  const dom = element.type === ELEMENT_TEXT
    ? document.createTextNode('')
    : document.createElement(element.type);

  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    })

  element.props.children.forEach(child => render(child, dom));

  container.appendChild(dom);
}

function updateDOM() { }

function completeUnitOfWork() { }

function updateHostRoot(currentFiber) {
  var newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber, newChildren);
}

function reconcileChildren(currentFiber, newChildren) {
  var newChildrenIndex = 0;
  var prevSibling;
  while (newChildrenIndex < newChildren.length) {
    var newChild = newChildren[newChildrenIndex];
    var tag;
    if (newChild.type === ELEMENT_TEXT) {
      tag = TAG_TEXT;
    } else if (typeof newChild.type === 'string') {
      tag = TAG_HOST;
    }
    var newFiber = {
      tag,
      type: newChild.type,
      props: newChild.props,
      stateNode: null,
      return: currentFiber,
      nextEffect: null
    }
    newChildrenIndex++;
  }
}

export {
  scheduleRoot
}
