---
theme: hydrogen
highlight: darcula
---

## 学习源码的目的

在学源码之前，我也仔细想过这个问题。从功利的角度来说，学习源码就是为了面试，为了获得更好薪资待遇，这也是无可厚非的事。但是作为我们工作的一大利器，不知道你们是否会遇到一些无法快速解决的问题，是否会有在给新人培训分享时，无法解答他们的问题的尴尬。反正我是有，不了解原理，始终不敢称为掌握，所以如果你想要灵活自如的运用React，那源码就是最好的学习途径之一。

## 一些问题

先从最简单的生命周期的问题来学习源码，学习前，带着一些问题去看，有助于解决一些平时可能想不通的问题，甚至是面试中遇到的面试题，下面是自己开始学习前的一些疑问：

- React 的挂载流程是什么样的？class 组件和 function 组件有什么不同呢？
- React 的声明周期执行顺序。
- 为什么带 will 的生命周期都是不安全的呢，比如 componentWillMount componentWillUpdate componentWillReceiveProps 都会加上了前缀 UNSAFE。
- useEffect 与 useLayout 的区别。

## React 的架构

先从 React 整体架构来看 React 的生命周期过程，React 的初次渲染到页面上的过程可以分为两个阶段：

- render/reconcile阶段
- commit阶段

在 render 阶段会形成 Fiber 树，commit 阶段则是遍历 Fiber 树上的 effectList 链表来建立对应的 DOM 节点，并将其渲染到页面上，这也就是 React 初次挂载的流程。

本篇也是围绕着两个流程，尝试来解决开头提出的问题。源码的版本为17.0.2。

先来祭出一张官方的生命周期图。

![react_lifestyles.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/770f6b0b705e44439c0935f638c28f51~tplv-k3u1fbpfcp-watermark.image)

从这张图可以很清楚的看到 React 生命周期分为了三个阶段，分别是挂载阶段、更新阶段以及卸载阶段。

我们来一一分析。

## 挂载阶段

从上图可以看到 React 在挂载阶段主要包括了四个生命周期，按顺序分别为：

- constructor
- getDerivedStateFromProps
- render
- componentDidMount

先利用vite简单的搭建一个 React 的示例，然后在构造函数中断点调试一下：

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    debugger;
    console.log('father constructor', this);
    this.state = { count: 0 };
  }

  setCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    console.log('father render');
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <button onClick={this.setCount}>
            count is: {this.state.count}
          </button>
        </div>
      </div>
    )
  }
}
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b0d8e256aef4516b1806600b9141d51~tplv-k3u1fbpfcp-watermark.image)

从入口 render 函数到构造函数 App 中，经过了这么多的调用栈。先不去关心这个中间发生了什么，而是将关注点聚焦到构造函数中来。

React 文档中说了 constructor 一般是用来初始化 state 或者是做一些函数绑定工作，是不建议在 constructor 中去 setState的。那么我们就偏偏在 constructor 中 setState 一下。改造一下上面的构造函数。

```js
constructor(props) {
  super(props);
  console.log('father constructor', this);
  this.state = { count: 0 };
  this.setState({
    count: 0
  });
}
```

然后就发现控制台上多了一个 warning

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe5365211b5845c1aac3d9f1850e7d2e~tplv-k3u1fbpfcp-watermark.image)

顺着这个 warning，发现就是因为执行了 setState，很奇怪，setState变成了这样的

```js
Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
    }
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

var ReactNoopUpdateQueue = {
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};
```

setState 为什么直接执行了打印警告的方法呢，这不符合我们的期望啊，于是再次把断点打在了点击事件中，结果发现了另一个 setState

```js
// setState的原型方法是一模一样的
var classComponentUpdater = {
  enqueueSetState: function (inst, payload, callback) {
    var fiber = get(inst);
    var eventTime = requestEventTime();
    var lane = requestUpdateLane(fiber);
    var update = createUpdate(eventTime, lane);
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback, 'setState');
      }

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
};
```

这才符合我们对 setState 的期望嘛，如果是这样的话，那就解释了为什么在 constructor 中执行 setState 不起作用的原因了。

不过为什么两者执行的方法不一样呢。继续下去才发现关键就在上面的 constructClassInstance 方法中，这个方法执行除了执行了构造方法外，还执行了一些其他的东西

```js
// 这里省略了一些暂时不需要关注的代码
var isLegacyContextConsumer = false;
  var unmaskedContext = emptyContextObject;
  var context = emptyContextObject;
  var contextType = ctor.contextType;

  // 如果使用严格模式，也就是StrictMode，则会进入这里
  // 这里react说是实例化两次以帮助检测副作用，暂时没有深入了解
  if (
      debugRenderPhaseSideEffectsForStrictMode &&
      workInProgress.mode & StrictMode
  ) {
    disableLogs();
    try {
      new ctor(props, context);
    } finally {
      reenableLogs();
    }
  }

  // 执行构造函数的地方
  var instance = new ctor(props, context);
  // 获取fiber树的state
  var state = workInProgress.memoizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
  // 这里就是区分setState两种形态的方法之一
  adoptClassInstance(workInProgress, instance);

  return instance;
```

```js
function adoptClassInstance(workInProgress: Fiber, instance: any): void {
  // 这里就是把setState的方法赋给了实例的updater
  instance.updater = classComponentUpdater;
  // fiber树关联实例
  workInProgress.stateNode = instance;
  // 实例需要访问光纤，以便调度更新
  // 实际就是instance._reactInternals = workInProgress
  setInstance(instance, workInProgress);
}
```

到这里就很清晰了，只有执行了 constructor 方法以后，才能将真正的 setState 的方法放到实例上去。

好了，看完了构造函数，继续走到下一个方法 getDerivedStateFromProps 中。这个方法是在哪里调用的呢。回到上面执行 constructClassInstance 方法的地方，也就是 updateClassComponent 方法中，来看看这里是怎么做的

```js
function updateClassComponent(
  current, // 当前显示在页面上的fiber树，初次挂载的时候，current为null
  workInProgress, // 内存中构建的fiber树
  Component, // 这里就是我们的根应用，也就是App
  nextProps, // props属性，根应用没有设置props，为空
  renderLanes, // 调用优先级相关，暂不考虑
) {
  // 这里去掉了一些关于context的逻辑

  // 这个instance为null
  // 通过上面我们知道，只有执行了构造函数以后，才会把实例赋值给stateNode
  const instance = workInProgress.stateNode;
  let shouldUpdate;
  if (instance === null) {
    // 猜测是并发模式下调用的，未找到此项入口
    if (current !== null) {
      current.alternate = null;
      workInProgress.alternate = null;
      workInProgress.flags |= Placement;
    }
    // 在最初的过程中，需要构造实例
    constructClassInstance(workInProgress, Component, nextProps);
    // 这里就是getDerivedStateFromProps的入口方法了
    mountClassInstance(workInProgress, Component, nextProps, renderLanes);
    shouldUpdate = true;
  } else if (current === null) {
    // In a resume, we'll already have an instance we can reuse.
    shouldUpdate = resumeMountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderLanes,
    );
  } else {
    // setState更新的时候走这里
    shouldUpdate = updateClassInstance(
      current,
      workInProgress,
      Component,
      nextProps,
      renderLanes,
    );
  }
  // 完成当前fiber节点，返回下一个工作单元
  const nextUnitOfWork = finishClassComponent(
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderLanes,
  );
  return nextUnitOfWork;
}
```

走到这里的时候，就需要将前面调试的方法串联起来去看，不然可能不会明白为什么 React 要这么去做，下面画了一个简单的流程图：

![react-render-process.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18f7cf0181524373a6183f319514b969~tplv-k3u1fbpfcp-watermark.image)

我们来以一段简单易懂的话来试图描述这个阶段所做的工作：

**首先 React 使用了双缓存机制，显示在页面上的节点指针为 current，在内存中构建的节点为 workingInProgress 指针。初次挂载时，current 指针是为空的，所以 React 所做的工作就是根据 JSX 创建的节点树进行深度优先遍历，创建Fiber树，对比 current 上的旧的Fiber树，但首次创建 current 是空的，因此直接将属性添加到新的 Fiber 树上即可。构建完整颗 Fiber 树以后，则 render 阶段结束，开始进入 commit 阶段。**

这里只是简单的描述了 render 阶段执行的流程，里面还有很多细节，不过不是今天关注的重点，有兴趣的可以去看看这篇[文章](https://react.iamkasong.com/process/reconciler.html#%E9%80%92-%E9%98%B6%E6%AE%B5)。

这里的流程是 React 的 legacy 模式，而经常提到的可中断更新实际是 React 还正式发布的 concurrent 模式，关于 React 模式，文档中也提到了相关的概念，这里就直接拿过来作为参考：

> - legacy 模式： ReactDOM.render(\<App />, rootNode)。这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。
> - blocking 模式： ReactDOM.createBlockingRoot(rootNode).render(\<App />)。目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。
> - concurrent 模式： ReactDOM.createRoot(rootNode).render(\<App />)。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。这个模式开启了所有的新功能。

好了，回到要讲的生命周期上来。这里已经找到了 getDerivedStateFromProps 的入口函数，接着来看看这个入口函数做了什么：

```js
function mountClassInstance(
  workInProgress,
  ctor,
  newProps,
  renderLanes,
): void {
  // 这里检查class类是否定义了render方法，getInitialState、getDefaultProps、propTypes、contextType格式以及一些生命周期方法的检查工作
  checkClassInstance(workInProgress, ctor, newProps);

  const instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;

  // 初始化了updateQueue，这是一个链表，所有的更新的内容都会放在这里
  initializeUpdateQueue(workInProgress);

  // 这里做了一个警告，就是不要直接把props赋值给state
  if (instance.state === newProps) {
    const componentName = getComponentName(ctor) || 'Component';
    if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
      didWarnAboutDirectlyAssigningPropsToState.add(componentName);
      console.error(
        '%s: It is not recommended to assign props directly to state ' +
          "because updates to props won't be reflected in state. " +
          'In most cases, it is better to use props directly.',
        componentName,
      );
    }
  }

  // 这里做了一些不安全的生命周期和context的警告，不是重点省略了

  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  instance.state = workInProgress.memoizedState;

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  // 这里执行了getDerivedStateFromProps生命周期函数
  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps,
    );
    instance.state = workInProgress.memoizedState;
  }

  // 这里如果有新的生命周期方法，也就是getDerivedStateFromProps和getSnapshotBeforeUpdate，
  // 那么componentWillMount就不会调用，否则的话，就会被调用
  if (
    typeof ctor.getDerivedStateFromProps !== 'function' &&
    typeof instance.getSnapshotBeforeUpdate !== 'function' &&
    (typeof instance.UNSAFE_componentWillMount === 'function' ||
      typeof instance.componentWillMount === 'function')
  ) {
    callComponentWillMount(workInProgress, instance);
    // If we had additional state updates during this life-cycle, let's
    // process them now.
    processUpdateQueue(workInProgress, newProps, instance, renderLanes);
    instance.state = workInProgress.memoizedState;
  }
}
```

最后这里可以看到，当存在新的生命周期 API 时，那些带 will 的生命周期都不会被调用，稍后再来看这里的 will 生命周期，先来看看调用 getDerivedStateFromProps 的地方：

```js
function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
  var prevState = workInProgress.memoizedState;

  var partialState = getDerivedStateFromProps(nextProps, prevState);

  {
    // 如果getDerivedStateFromProps没有返回值则会警告
    warnOnUndefinedDerivedState(ctor, partialState);
  }

  // 这里将getDerivedStateFromProps返回的对象和上次的state进行了合并
  var memoizedState = partialState === null || partialState === undefined ? prevState : _assign({}, prevState, partialState);
  workInProgress.memoizedState = memoizedState;
}
```

这个逻辑很好理解，就是执行了 getDerivedStateFromProps 的生命周期方法后，将其返回值和上次的 state 进行了合并。注意这个 applyDerivedStateFromProps 方法会在更新阶段再次被调用。而 getDerivedStateFromProps 的作用官方文档也给出了其唯一的作用：**就是在 props 改变时更新 state**。这里会在更新阶段再次来分析。

通过上面的代码，可以知道 getDerivedStateFromProps 和 componentWillMount的方法是不会同时调用的。注释掉 getDerivedStateFromProps 的方法，添加 componentWillMount 方法再来看看其执行流程：

```js
function callComponentWillMount(workInProgress, instance) {
  var oldState = instance.state;

  // 调用willMount的生命周期方法
  if (typeof instance.componentWillMount === 'function') {
    instance.componentWillMount();
  }

  if (typeof instance.UNSAFE_componentWillMount === 'function') {
    instance.UNSAFE_componentWillMount();
  }

  // 这里如果前后state不等，说明在willMount中给state重新赋值了，导致state引用改变了
  if (oldState !== instance.state) {
    {
      error('%s.componentWillMount(): Assigning directly to this.state is ' + "deprecated (except inside a component's " + 'constructor). Use setState instead.', getComponentName(workInProgress.type) || 'Component');
    }
    // 直接赋值的话，react会把赋值的语句变成了setState调用
    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}
```

官方文档上面有这么一句话

> componentWillMount 在 render() 之前调用，因此在此方法中同步调用 setState() 不会触发额外渲染。

意思是在 render 阶段的更新是不会触发实例的 render，这是因为进入 setState 更新方法的时候，会去判断当前的树和内存中的树是一个引用，说明当前阶段是 render 阶段，因此不会去执行 render 方法。

执行完了 getDerivedStateFromProps 或者是 componentWillMount 之后，就到了 render 方法的调用了。这里需要回到上面的 updateClassComponent 方法中有一个 finishClassComponent 方法，就是调用 render 方法的地方。来看看这个方法：

```js
function finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes) {
  // 更新ref
  markRef(current, workInProgress);
  var didCaptureError = (workInProgress.flags & DidCapture) !== NoFlags;
  
  // 这里shouldComponentUpdate如果返回的是false的话，则不会执行render，而是复用上次的fiber
  if (!shouldUpdate && !didCaptureError) {
    // Context providers should defer to sCU for rendering
    if (hasContext) {
      invalidateContextProvider(workInProgress, Component, false);
    }

    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  var instance = workInProgress.stateNode; // Rerender

  ReactCurrentOwner$1.current = workInProgress;
  var nextChildren;

  if (didCaptureError && typeof Component.getDerivedStateFromError !== 'function') {
    // 如果捕获到错误，但未定义getDerivedStateFromError，则卸载所有的子元素。
    // componentDidCatch将安排更新以重新呈现回退。这是暂时的，直到我们将迁移到新的API。
    // TODO: Warn in a future release.
    nextChildren = null;

    {
      stopProfilerTimerIfRunning();
    }
  } else {
    {
      setIsRendering(true);
      nextChildren = instance.render();

      // 其实是调用了两次render，react解释是为了侦测副作用，而且这里执行的render的log是不会被打印出来的
      if ( workInProgress.mode & StrictMode) {
        disableLogs();

        try {
          instance.render();
        } finally {
          reenableLogs();
        }
      }

      setIsRendering(false);
    }
  }

  if (current !== null && didCaptureError) {
    // 如果正在从错误中恢复，可以在不重用任何现有子元素的情况下进行协调。
    // 从概念上讲，普通子元素和在错误中显示的子元素是两个不同的集合，
    // 因此即使它们的标识匹配，也不应该重用普通子元素。
    forceUnmountCurrentAndReconcile(current, workInProgress, nextChildren, renderLanes);
  } else {
    // 将render返回的react元素进行协调
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  // fiber记住实例上的state的值，作为状态缓存
  workInProgress.memoizedState = instance.state; // The context might have changed so we need to recalculate it.

  // 返回当前fiber的子元素
  return workInProgress.child;
}
```

通过上面的流程图可以知道，React 挂载的过程实际就是一个自顶向下不断遍历的过程，在 legacy 模式下这种递归更新是无法打断的，在 render 方法中做一些计算工作会导致更新的速度变慢，浏览器的卡顿的情况更加明显。因此才说要保持 render 方法的纯净和简洁。

执行完了 render 方法以后，一直到 commitRoot 方法，则开始进入了 commit 阶段。


![react-commit-process.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49f0c41808fe45da85c7c1d4a6ee73eb~tplv-k3u1fbpfcp-watermark.image)

```js
function commitLifeCycles(finishedRoot, current, finishedWork, committedLanes) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block:
      {
        // At this point layout effects have already been destroyed (during mutation phase).
        // This is done to prevent sibling component effects from interfering with each other,
        // e.g. a destroy function in one component should never override a ref set
        // by a create function in another component during the same commit.
        {
          commitHookEffectListMount(Layout | HasEffect, finishedWork);
        }

        schedulePassiveEffects(finishedWork);
        return;
      }

    case ClassComponent:
      {
        var instance = finishedWork.stateNode;

        if (finishedWork.flags & Update) {
          if (current === null) {
            // We could update instance props and state here,
            // but instead we rely on them being set during last render.
            // TODO: revisit this when we implement resuming.
            {
              if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
                if (instance.props !== finishedWork.memoizedProps) {
                  error('Expected %s props to match memoized props before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
                }

                if (instance.state !== finishedWork.memoizedState) {
                  error('Expected %s state to match memoized state before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
                }
              }
            }

            {
              instance.componentDidMount();
            }
          } else {
            var prevProps = finishedWork.elementType === finishedWork.type ? current.memoizedProps : resolveDefaultProps(finishedWork.type, current.memoizedProps);
            var prevState = current.memoizedState; // We could update instance props and state here,
            // but instead we rely on them being set during last render.
            // TODO: revisit this when we implement resuming.

            {
              if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
                if (instance.props !== finishedWork.memoizedProps) {
                  error('Expected %s props to match memoized props before ' + 'componentDidUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
                }

                if (instance.state !== finishedWork.memoizedState) {
                  error('Expected %s state to match memoized state before ' + 'componentDidUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
                }
              }
            }

            {
              instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
            }
          }
        } // TODO: I think this is now always non-null by the time it reaches the
        // commit phase. Consider removing the type check.


        var updateQueue = finishedWork.updateQueue;

        if (updateQueue !== null) {
          {
            if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
              if (instance.props !== finishedWork.memoizedProps) {
                error('Expected %s props to match memoized props before ' + 'processing the update queue. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
              }

              if (instance.state !== finishedWork.memoizedState) {
                error('Expected %s state to match memoized state before ' + 'processing the update queue. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentName(finishedWork.type) || 'instance');
              }
            }
          } // We could update instance props and state here,
          // but instead we rely on them being set during last render.
          // TODO: revisit this when we implement resuming.


          commitUpdateQueue(finishedWork, updateQueue, instance);
        }

        return;
      }

    case HostRoot:
      {
        // TODO: I think this is now always non-null by the time it reaches the
        // commit phase. Consider removing the type check.
        var _updateQueue = finishedWork.updateQueue;

        if (_updateQueue !== null) {
          var _instance = null;

          if (finishedWork.child !== null) {
            switch (finishedWork.child.tag) {
              case HostComponent:
                _instance = getPublicInstance(finishedWork.child.stateNode);
                break;

              case ClassComponent:
                _instance = finishedWork.child.stateNode;
                break;
            }
          }

          commitUpdateQueue(finishedWork, _updateQueue, _instance);
        }

        return;
      }

    case HostComponent:
      {
        var _instance2 = finishedWork.stateNode; // Renderers may schedule work to be done after host components are mounted
        // (eg DOM renderer may schedule auto-focus for inputs and form controls).
        // These effects should only be committed when components are first mounted,
        // aka when there is no current/alternate.

        if (current === null && finishedWork.flags & Update) {
          var type = finishedWork.type;
          var props = finishedWork.memoizedProps;
          commitMount(_instance2, type, props);
        }

        return;
      }

    case HostText:
      {
        // We have no life-cycles associated with text.
        return;
      }

    case HostPortal:
      {
        // We have no life-cycles associated with portals.
        return;
      }

    case Profiler:
      {
        {
          var _finishedWork$memoize2 = finishedWork.memoizedProps,
              onCommit = _finishedWork$memoize2.onCommit,
              onRender = _finishedWork$memoize2.onRender;
          var effectDuration = finishedWork.stateNode.effectDuration;
          var commitTime = getCommitTime();

          if (typeof onRender === 'function') {
            {
              onRender(finishedWork.memoizedProps.id, current === null ? 'mount' : 'update', finishedWork.actualDuration, finishedWork.treeBaseDuration, finishedWork.actualStartTime, commitTime, finishedRoot.memoizedInteractions);
            }
          }
        }

        return;
      }

    case SuspenseComponent:
      {
        commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
        return;
      }

    case SuspenseListComponent:
    case IncompleteClassComponent:
    case FundamentalComponent:
    case ScopeComponent:
    case OffscreenComponent:
    case LegacyHiddenComponent:
      return;
  }

  {
    {
      throw Error( "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue." );
    }
  }
}
```

## 更新阶段

```js
function updateClassInstance(
  current: Fiber,
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderLanes: Lanes,
): boolean {
  const instance = workInProgress.stateNode;

  cloneUpdateQueue(current, workInProgress);

  const unresolvedOldProps = workInProgress.memoizedProps;
  const oldProps =
    workInProgress.type === workInProgress.elementType
      ? unresolvedOldProps
      : resolveDefaultProps(workInProgress.type, unresolvedOldProps);
  instance.props = oldProps;
  const unresolvedNewProps = workInProgress.pendingProps;

  const oldContext = instance.context;
  const contextType = ctor.contextType;
  let nextContext = emptyContextObject;
  if (typeof contextType === 'object' && contextType !== null) {
    nextContext = readContext(contextType);
  } else if (!disableLegacyContext) {
    const nextUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    nextContext = getMaskedContext(workInProgress, nextUnmaskedContext);
  }

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles =
    typeof getDerivedStateFromProps === 'function' ||
    typeof instance.getSnapshotBeforeUpdate === 'function';

  // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.

  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.
  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === 'function' ||
      typeof instance.componentWillReceiveProps === 'function')
  ) {
    if (
      unresolvedOldProps !== unresolvedNewProps ||
      oldContext !== nextContext
    ) {
      callComponentWillReceiveProps(
        workInProgress,
        instance,
        newProps,
        nextContext,
      );
    }
  }

  resetHasForceUpdateBeforeProcessing();

  const oldState = workInProgress.memoizedState;
  let newState = (instance.state = oldState);
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  newState = workInProgress.memoizedState;

  if (
    unresolvedOldProps === unresolvedNewProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing()
  ) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Update;
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Snapshot;
      }
    }
    return false;
  }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps,
    );
    newState = workInProgress.memoizedState;
  }

  const shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextContext,
    );

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillUpdate === 'function' ||
        typeof instance.componentWillUpdate === 'function')
    ) {
      if (typeof instance.componentWillUpdate === 'function') {
        instance.componentWillUpdate(newProps, newState, nextContext);
      }
      if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
        instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
      }
    }
    if (typeof instance.componentDidUpdate === 'function') {
      workInProgress.flags |= Update;
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      workInProgress.flags |= Snapshot;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Update;
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Snapshot;
      }
    }

    // If shouldComponentUpdate returned false, we should still update the
    // memoized props/state to indicate that this work can be reused.
    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  }

  // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.
  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;

  return shouldUpdate;
}
```

```js
function checkShouldComponentUpdate(
  workInProgress,
  ctor,
  oldProps,
  newProps,
  oldState,
  newState,
  nextContext,
) {
  const instance = workInProgress.stateNode;
  if (typeof instance.shouldComponentUpdate === 'function') {
    if (__DEV__) {
      if (
        debugRenderPhaseSideEffectsForStrictMode &&
        workInProgress.mode & StrictMode
      ) {
        disableLogs();
        try {
          // Invoke the function an extra time to help detect side-effects.
          instance.shouldComponentUpdate(newProps, newState, nextContext);
        } finally {
          reenableLogs();
        }
      }
    }
    const shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextContext,
    );

    if (__DEV__) {
      if (shouldUpdate === undefined) {
        console.error(
          '%s.shouldComponentUpdate(): Returned undefined instead of a ' +
            'boolean value. Make sure to return true or false.',
          getComponentName(ctor) || 'Component',
        );
      }
    }

    return shouldUpdate;
  }

  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }

  return true;
}
```

```js
function commitBeforeMutationLifeCycles(
  current: Fiber | null,
  finishedWork: Fiber,
): void {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      return;
    }
    case ClassComponent: {
      if (finishedWork.flags & Snapshot) {
        if (current !== null) {
          const prevProps = current.memoizedProps;
          const prevState = current.memoizedState;
          const instance = finishedWork.stateNode;
          // We could update instance props and state here,
          // but instead we rely on them being set during last render.
          // TODO: revisit this when we implement resuming.
          if (__DEV__) {
            if (
              finishedWork.type === finishedWork.elementType &&
              !didWarnAboutReassigningProps
            ) {
              if (instance.props !== finishedWork.memoizedProps) {
                console.error(
                  'Expected %s props to match memoized props before ' +
                    'getSnapshotBeforeUpdate. ' +
                    'This might either be because of a bug in React, or because ' +
                    'a component reassigns its own `this.props`. ' +
                    'Please file an issue.',
                  getComponentName(finishedWork.type) || 'instance',
                );
              }
              if (instance.state !== finishedWork.memoizedState) {
                console.error(
                  'Expected %s state to match memoized state before ' +
                    'getSnapshotBeforeUpdate. ' +
                    'This might either be because of a bug in React, or because ' +
                    'a component reassigns its own `this.state`. ' +
                    'Please file an issue.',
                  getComponentName(finishedWork.type) || 'instance',
                );
              }
            }
          }
          const snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState,
          );
          if (__DEV__) {
            const didWarnSet = ((didWarnAboutUndefinedSnapshotBeforeUpdate: any): Set<mixed>);
            if (snapshot === undefined && !didWarnSet.has(finishedWork.type)) {
              didWarnSet.add(finishedWork.type);
              console.error(
                '%s.getSnapshotBeforeUpdate(): A snapshot value (or null) ' +
                  'must be returned. You have returned undefined.',
                getComponentName(finishedWork.type),
              );
            }
          }
          instance.__reactInternalSnapshotBeforeUpdate = snapshot;
        }
      }
      return;
    }
    case HostRoot: {
      if (supportsMutation) {
        if (finishedWork.flags & Snapshot) {
          const root = finishedWork.stateNode;
          clearContainer(root.containerInfo);
        }
      }
      return;
    }
    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return;
  }
}
```

## 卸载阶段

```js
const callComponentWillUnmountWithTimer = function(current, instance) {
  instance.props = current.memoizedProps;
  instance.state = current.memoizedState;
  if (
    enableProfilerTimer &&
    enableProfilerCommitHooks &&
    current.mode & ProfileMode
  ) {
    try {
      startLayoutEffectTimer();
      instance.componentWillUnmount();
    } finally {
      recordLayoutEffectDuration(current);
    }
  } else {
    instance.componentWillUnmount();
  }
};
```
