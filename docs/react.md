# React

## Component & PureComponent

Component 就是 React 组件的基类，PureComponent 也是一样的，不同的地方在于 PureComponent 会对 state 和 `props` 做一个浅比较，需要注意的是，子组件使用 PureComponent，并且从父组件传递 props 时，即使 props 并没有改变，也会发生子组件重新 render 的情况。

```jsx
class Father extends Component {

  state = {
    count: 0
  }

  render () {
    return (
      <div>
        <h1>父组件</h1>
        <Child count={count}/>
      </div>
    )
  }
}

// 这里子组件会不会重新渲染？
class Child extends PureComponent {
  render () {
    return (
      <div>我是子组件-我是从父组件带过来的props：{this.props.count}</div>
    )
  }
}
```

答案就是子组件也会重新 render，原因就在于每次传给子组件的 props 都是一个新的引用，浅比较的结果都不想等，所以会重新 render，如果想要取消这种 render，改用 Component 以后，使用 shouldComponentUpdate 手动比较具体的 props 值是否相等来决定 render。

## diff算法



## 性能优化

1. 优化加载性能

- 根元素添加 loading，使用prerender-spa-plugin，都是为了减少白屏时间
- 利用缓存、动态polyfill、代码分割、tree-shaking
- 看需要是否需要把代码编译到ES5，不需要的话，直接使用ES6+的代码，减少编译时间和代码体积
- 使用懒加载和骨架屏
