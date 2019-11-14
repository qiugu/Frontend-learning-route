# vue-src-learning
## 记录学习Vue源码的过程，加上自己的一些理解，简化Vue源码中的代码，用最简单易懂的方式学习Vue的源码

### 源码学习步骤
* `entry-runtime-with-compiler`为入口文件，只有调用$mount方法时，执行判断挂载的节点，当不存在render函数时，解析template模板等工作

### 启动调试
```
npm run dev
```
