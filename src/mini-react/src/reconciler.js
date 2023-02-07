import { 
  ELEMENT_TEXT, 
  TAG_HOST, 
  TAG_ROOT, 
  TAG_TEXT,
  UPDATE,
  PLACEMENT,
  DELETION
} from "./constant.js";

// 下一个工作单元
var nextUnitOfWork = null;
// 内存中的根fiber
var workInProgressRoot = null;
// 指向当前显示在页面上的fiber树
var current = null;
// 保存删除的节点
var deletions = null;
var workInProgressFiber = null;
var hookIndex = null;

const isProperty = key => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);
const isEvent = key => key.startsWith('on');

function render(element, container) {
  workInProgressRoot = {
    stateNode: container,
    props: {
      children: [element]
    },
    // 内存中的fiber树和页面显示的fiber树之间的连接
    alternate: current
  };
  deletions = [];
  nextUnitOfWork = workInProgressRoot;
}

function createTextElement(text) {
  return {
    type: ELEMENT_TEXT,
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === 'object') return child;
        else {
          return createTextElement(child);
        }
      })
    }
  };
}

/**
 * 从根节点开始渲染
 */
function scheduleRoot(rootFiber) {
  workInProgressRoot = rootFiber;
  nextUnitOfWork = rootFiber;
}

function workLoop(deadline) {
  // 是否要让出控制权
  var shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 没有下一个工作单元了，并且存在根fiber，说明render阶段结束了，开始进入commit阶段
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

/**
 * 完成当前节点的工作，返回下一个fiber节点
 * @param {*} fiber 
 * @returns 
 */
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 遍历完子fiber以后，继续寻找下一个工作单元
  // 首先查找是否有子节点
  // 深度优先遍历
  if (fiber.child) {
    return fiber.child;
  }
  var nextFiber = fiber;
  while(nextFiber) {
    // 判断是否有兄弟节点
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    // 都没有的话，则指向父节点，继续判断
    nextFiber = nextFiber.return;
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

/**
 * 原生HTML更新
 * @param {*} fiber 
 */
function updateHostComponent(fiber) {
  if (fiber.stateNode === null) {
    fiber.stateNode = createDOM(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

/**
 * function组件更新
 * @param {*} fiber 
 */
function updateFunctionComponent(fiber) {
  workInProgressFiber = fiber;
  hookIndex = 0;
  workInProgressFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function createDOM(fiber) {
  const dom = fiber.type === ELEMENT_TEXT
    ? document.createTextNode('')
    : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name];
    })

  return dom;
}

function updateDOM(dom, prevProps, nextProps) {
  // 如果事件监听被移除或者改变了
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 添加新的事件监听方法
  console.log(nextProps)
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone)
    .forEach(name => {
      dom[name] = ''
    });
  
  // 设置新的属性或者是更改的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });
}

function completeUnitOfWork() {}

function reconcileChildren(currentFiber, elements) {
  var index = 0;
  // 上次提交的fiber节点
  var oldFiber = currentFiber.alternate && currentFiber.alternate.child;
  var prevSibling = null;

  // 遍历子fiber
  while(index < elements.length || oldFiber != null) {
    const element = elements[index];
    var newFiber = null;

    // 表示新旧fiber类型相同，则复用节点，更新属性
    const sameType = oldFiber && element && oldFiber.type === element.type;
    if (sameType) {
      // 类型相同，新旧节点都存在，复用旧节点的dom元素和类型，使用新节点的props，打上update的副作用标签
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        stateNode: oldFiber.stateNode,
        return: currentFiber,
        alternate: oldFiber,
        effectTag: UPDATE
      };
    }
    // 如果存在新节点，类型不同或者是不存在对应旧节点，创建新节点
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        stateNode: null,
        return: currentFiber,
        alternate: null,
        effectTag: PLACEMENT
      };
    }

    // 如果旧节点存在，新节点不存在或者是类型不同，删除旧节点
    if (oldFiber && !sameType) {
      oldFiber.effectTag = DELETION;
      // ?
      deletions.push(oldFiber);
    }

    // 比较element和oldFIber
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 如果是第一个子fiber，则将其设置为fiber的child属性
    // 否则的话是fiber的sibling属性
    if (index === 0) {
      currentFiber.child = newFiber;
    } else {
      // 不是第一个子fiber，那么上一次记录的prev fiber的兄弟节点是当前newFiber
      prevSibling.sibling = newFiber;
    }

    // 将当前子fiber设置为上一个兄弟fiber
    prevSibling = newFiber;
    index++;
  }
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(workInProgressRoot.child);
  // 提交完以后，将当前页面显示的fiber树保存早currrent指针中
  current = workInProgressRoot;
  // 清空内存中的fiber树
  workInProgressRoot = null;
}

function commitWork(fiber) {
  console.log(fiber);
  if (!fiber) return;

  // 这里查找当前节点的父节点上的dom节点，如果不存在的话，一直向上遍历查找
  var domParentFiber = fiber.return;
  while(domParentFiber.stateNode == null) {
    domParentFiber = domParentFiber.return;
  }
  const domParent = domParentFiber.stateNode;

  if (fiber.effectTag === PLACEMENT && fiber.stateNode != null) {
    domParent.appendChild(fiber.stateNode);
  } else if (fiber.effectTag === UPDATE && fiber.stateNode !== null) {
    updateDOM(
      fiber.stateNode,
      fiber.alternate.props,
      fiber.props
    );
  } else if (fiber.effectTag === DELETION) {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.stateNode) {
    domParent.removeChild(fiber.stateNode);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function useState(initial) {
  const oldHook = workInProgressFiber.alternate && 
    workInProgressFiber.alternate.hooks && 
    workInProgressFiber.alternate.hooks[hookIndex];
  
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  const setState = action => {
    hook.queue.push(action);
    workInProgressRoot = {
      stateNode: current.stateNode,
      props: current.props,
      alternate: current
    };
    nextUnitOfWork = workInProgressRoot;
    deletions = [];
  };

  workInProgressFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

export {
  render,
  useState,
  createElement
}
