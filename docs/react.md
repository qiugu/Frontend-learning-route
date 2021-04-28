## 挂载执行流程

render -> legacyRenderSubtreeIntoContainer -> unbatchedUpdates -> updateContainer -> scheduleUpdateOnFiber -> performSyncWorkOnRoot -> renderRootSync -> workLoopSync -> performUnitOfWork -> beginWork -> updateClassComponent -> constructClassInstance -> constructor

## 一些问题

- React的挂载流程和更新流程是什么样的？class组件和function组件有什么不同呢？
- 为什么带 will 的生命周期都是不安全的呢，比如 componentWillMount componentWillUpdate componentWillReceiveProps 都会加上了前缀 UNSAFE。
