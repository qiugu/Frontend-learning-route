# React

## React 生命周期

![lifecycle](./images/react_lifecycle.png)

## React Fiber

1. 把原有的递归更新架构改为可中断更新
2. DOM节点抽象成普通对象，称之为Vituial DOM，React中也可以叫做fiber
3. fiber就是一个时间切片，并且提供了任务优先级的调度

现在的架构分为三层
- Scheduler调度器，负责任务优先级的调度
- Reconciler协调器，找出fiber中变化的部分
- Renderer渲染器，将变化的部分渲染到页面上

## Context API

React Context API 也经历了新旧变化。

旧的 Context 实现是通过递归遍历时生成栈，将 Context 上的数据入栈出栈，所以对应的 Consumer 就可以获取栈上的数据。

随着 React 推出了 shouldComponentUpdate 和 React.memo 可以自定义跳过一些不必要的更新，这就导致某些子 Fiber 不会被遍历到，也就不会有入栈出栈的操作。因此旧的 Context API 和这些优化的 API 产生了冲突。

新的 Context API 用法如下：

```js
const AppContext = React.createContext();

function App() {
    return (
        <AppContext.Provider value={{ name: 'qiugu' }}>
            <Child/>
        </AppContext.Provider>
    )
}

function Child() {
    const { name } = useContext(AppContext);
    return (
        <div>hello {name}</div>
    );
}
```

当 context value 发生变化时，Provider 内部会遍历子 Fiber，找到对应使用 useContext 的子 Fiber，并且为之触发一次 render，这样就可以打破上面提到的 shouldComponentUpdate 和 React.memo 导致的越过子 Fiber 的情况，从而实现子组件的更新。

## React 合成事件

react 17版本以前的事件流程分为以下三个阶段

1. 事件合成

生成合成事件对应的原生事件的映射关系

2. 事件绑定

React 在遍历 fiber 的时候，如果发现注册的是合成事件，会走单独的合成事件逻辑，找到合成事件对应的原生事件，然后在 document 上注册原生事件

3. 事件触发

React 会对事件统一处理，进行批量更新，按照捕获，事件源、冒泡的顺序将事件回调加入事件队列，最后执行事件队列。如果发现阻止冒泡，则会提前退出执行，并且重置事件源，将其放回事件池


17 以后的版本相比于 17以前的版本，有如下改动

- 17 版本以后事件都绑定到 React 挂载的 DOM 元素上，17 以前的事件则是绑定到 **document** 上。
- 17 以后终于支持了原生捕获事件的支持， 对齐了浏览器原生标准。同时 onScroll 事件不再进行事件冒泡。onFocus 和 onBlur 使用原生 focusin， focusout 合成。
- 17 取消事件池复用，也就解决了在setTimeout打印，找不到e.target的问题。

### 参考资料

[一文吃透react事件系统原理](https://juejin.cn/post/6955636911214067720)

## Hooks原理

![hooks](./images/hooks.png)

## diff算法

React 中的 diff 算法实际就是两颗树的diff，current 指针，指向了页面中的树，workInProgress 则指向了内存中更新的树。两颗树进行对比，需要`O^3`的时间复杂度，为了降低这个复杂度，React 做了一些进行 diff 的前置条件。

1. 只对同级的节点进行 diff，如果跨级的话，React 并不会复用节点
2. 不同类型的元素不会复用，只会销毁原来的元素及其子节点，新建新的节点
3. 可以通过 key 属性来暗示哪些元素是可以复用的。

同样根据更新后的节点的类型，diff 主要分为两种类型：

1. 单节点diff

单节点就是更新以后只有一个节点的情况，也会有以下几种情况

- 更新后的节点的类型和旧节点的类型不同，无法复用，删除旧节点，新建更新后的节点
- 更新后的节点类型和旧节点类型相同，key不同，无法复用，删除旧节点，新建新节点
- 更新后的节点类型和key都和旧节点相同，复用旧节点。旧节点如果还有剩余节点，则删除剩余节点及其子节点

![single_diff](./images/react_single_diff.png)

2. 多节点diff

- 节点更新前后，数量相等，可能节点类型、属性发生变化
- 更新后的节点数量比更新前少，说明节点进行了删除
- 更新后的节点数量比更新前多，说明新增了节点
- 节点前后数量一致，类型属性一致，顺序发生了变化，这也是 diff 算法的核心

经过两轮遍历，第一轮找到更新的节点，第二轮则处理不是更新的节点，如位置、新增或者是删除。这里假设子节点有abcd四个节点，字母代表其 key 值，更新后的节点位置为dabc，根据参考位置索引 lastPlacedIndex 以及 新节点在旧节点的索引来决定是否需要移动。

![multi_diff](./images/react_diff_multi.png)

[参考链接](https://react.iamkasong.com/diff/prepare.html)
