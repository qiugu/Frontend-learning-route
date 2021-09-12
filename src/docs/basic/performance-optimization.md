# 性能优化

## RAIL模型

1. Response
2. Animation
3. Idle
4. Load

## 缓存

1. 本地缓存
2. CacheAPI 也就是serviceWorker
3. HTTP缓存

## 大量图片的加载优化

1. 只加载首屏的图片
2. 图片单位像素的优化

## 避免全局变量的使用

## 避免属性查找

## 优化循环

1. 简化循环体
2. 展开循环

## 最小化语句数

## 优化DOM操作

1. 合并操作
2. 使用事件代理
3. 减少使用HTMLCollection
4. 操作DOM元素

为什么都说操作DOM元素是非常耗时的呢？从浏览器的角度出发，每次操作DOM元素的时候，都有可能导致DOM元素的变化，根据浏览器的渲染规则，可能会导致回流或者重绘，操作少量的DOM元素可能看不出来差别，但是如果操作成千上万的DOM元素，则可以明显看到性能差距。

另一方面则是从 JavaScript 代码执行的角度来看，每次执行代码，获取 document 这样的全局变量，执行速度也是必然不如使用局部变量来替代的。

## 参考资料
- [前端性能优化](https://alienzhou.com/projects/fe-performance-journey/#%E6%97%85%E9%80%94%E7%9A%84%E8%A1%8C%E7%A8%8B%E8%B7%AF%E7%BA%BF)

