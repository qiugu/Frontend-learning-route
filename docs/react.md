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

> [React技术揭秘](https://react.iamkasong.com/preparation/newConstructure.html#react16%E6%9E%B6%E6%9E%84)

## Hooks原理

![hooks](./images/hooks.png)

## diff算法

## 性能优化

1. 优化加载性能

- 根元素添加 loading，使用prerender-spa-plugin，都是为了减少白屏时间
- 利用缓存、动态polyfill、代码分割、tree-shaking
- 看需要是否需要把代码编译到ES5，不需要的话，直接使用ES6+的代码，减少编译时间和代码体积
- 使用懒加载和骨架屏
