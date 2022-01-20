# React架构分析

## React三层架构
1. React Schedule 调度器
2. React Reconcile 协调器
3. React Renderer 渲染器

代数效应

React Fiber纤程

递归更新变为异步可中断更新

## render阶段
beginWork -> completeWork

双缓存机制current和workInProgress

当前的React Fiber指向了current，workInProgress指向了内存中构建的fiber树
