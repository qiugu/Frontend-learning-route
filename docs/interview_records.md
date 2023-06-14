# 面试问题记录

## 前端基础

### 什么是BFC，如何利用BFC实现两栏布局，第一栏不定宽高，第二栏占据剩余空间

BFC全称**块级格式化上下文**，就是一块拥有独特的渲染规则的区域，区域内的元素不会影响到区域外的元素。利用BFC可以实现一些特定的功能：

- 清除浮动，防止浮动元素导致父元素高度塌陷
- 避免外边距折叠，BFC内的元素垂直方向上会发生折叠，但是两个不同的BFC元素则不会发生折叠
- 防止元素被浮动元素覆盖。

实现BFC主要有以下几种属性：

- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)

利用BFC就很容易实现两栏布局：

```html
<div class="container">
    <div class="child1"></div>
    <div class="child2"></div>
</div>
```

```css
.container {
    overflow: hidden;
}
.child1 {
    border: 1px solid red;
    float: left;
}
.child2 {
    border: 1px solid blue;
    height: 100px;
    overflow: hidden;
}
```

### flex布局中flex-grow和flex-shrink的计算规则

flex-grow属性是容器比子元素大的时候，子元素如何分配多出来的空间的规则，一般是按照下面这个式子来计算：

子元素的宽度 = 子元素设置的宽度 + 容器剩余宽度 * flex-grow / 所有子元素总共的flex-grow的值

假设容器宽度为500，两个子元素的宽度分别为200，200，其flex-grow的值为2,3，那么按照上面的公式可以得到：

第一个子元素的宽度 = 200 + （500 - 400）* （2 / 5）= 240
第二个子元素的宽度 = 200 + （500 - 400）* （3 / 5）= 260

flex-shrink则是当子元素宽度之和超过容器元素，则每个子元素按照其设置的值进行缩放，缩放规则也是类似的：

子元素自身的权重 = flex-shrink / 总flex-shrink

子元素缩小的宽度 = 溢出的宽度 * 自身的权重

还是按照上面的例子来，不过此时是flex-shrink的属性值分别为2和3，宽度分别为300，300，按照上面的公式计算可以得到：

第一个子元素的权重 = 2 / 5
第二个子元素的权重 = 3 / 5
第一个子元素缩小的宽度 = （600 - 500）* 2 / 5 = 40
第二个子元素缩小的宽度 = （600 - 500）* 3 / 5 = 60
第一个子元素缩小后的宽度 = 300 - 40 = 260
第二个子元素缩小后的宽度 = 300 - 60 = 240

### 如何使元素position:fixed基于父元素进行定位

`position: fixed`一般使基于`viewport`进行定位，如果要改变的话，可以在父元素上添加`transform: scale(1)`或者其他任何不为`none`的属性，都可以使其相对于父元素进行定位。

原理就是`transform: scale(1)`非`none`的值会创建层叠上下文，层叠上下文会影响子级元素的定位，等于重新创建了一个新的图层。

兼容性问题，谷歌浏览器和firefox下除了`transform`属性，`perspective`属性也可以使`fixed`布局失效，但是在safari和IE以及Edge下，都是无法使`fixed`失效的。
### promise数组如何串行执行

所谓串行执行，其实就是按顺序执行，这里按顺序执行，假设promise数组中不存在下一个执行依赖上一个执行的情况，考虑使用reduce来实现

```js
const arr = [
    new Promise(resolve => {
        console.log(1);
        resolve();
    }),
    new Promise(resolve => {
        console.log(2);
        resolve();
    }),
    new Promise(resolve => {
        console.log(3);
        resolve();
    })
];

function sequeceExcution(arr) {
    arr.reduce((prev, cur) => prev.then(val => cur)}, Promise.resolve());
}

sequeceExcution(arr);
```

这样执行的结果为1, 2, 3，这么做是否是顺序执行了呢，可以使用定时器来看看。假设每个promise中都有一个定时器，第一个定时器3s以后执行，第二个2s以后执行，第三个1s，那么可以这么写：

```js
const createPromise = (time, id) => new Promise(resolve => {
    setTimeout(() => {
      console.log("promise", id);
      resolve();
    }, time);
});

sequeceExcution([
    createPromise(3000, 1),
    createPromise(2000, 2),
    createPromise(1000, 3)
]);

```

最后可以得到3s以后打印出1，然后2s后打印2,1s以后打印出3，确实按照我们设置的顺序执行了。

除此之外，也可以使用递归来做:

```js
function dispatch(i, p = Promise.resolve()) {
  if (!arr[i]) return Promise.resolve();
  return p.then(() => dispatch(i + 1, arr[i]));
}

dispatch(0);
```

其他的还有利用async、await的方法，或者是利用for-of、for-await-of循环等比较普遍的写法，这里就不一一展开了。

## 除了 setTimeout 和 setInterval 以外还有没有其他方式实现轮询

可以利用 requestAnimationFrame 来实现轮询

```js
let start = 0;
function poll (timestamp) {
    if (timestamp - start >= 3000) {
        start = timestamp;
    }
    requestAnimationFrame(poll);
}
```


## 框架

### React 的 setState是同步还是异步

**在生命周期方法或是合成事件中 setState 是异步的**。原因是此阶段 React 并不会立刻执行更新，而是将更新放入一个队列中，给人感觉好像是异步的。当顶层组件 didMount 以后才会开始更新。需要注意在 componentDidMount 中 调用 setState 会触发两次 render 方法。而在 componentWillUpdate、componentDidUpdate中调用则会导致死循环。

**在异步方法和原生事件中 setState 是同步的**。此时 React 已经执行队列中的异步方法，说明已经是在更新过程中了，这个时候调用 setState 会立刻得到更新后的状态

[来源](https://juejin.cn/post/6844903781813993486#heading-10)

## 网络

### 简单请求和非简单请求

简单请求就是使用设定的请求方式请求数据，比如GET、POST、HEAD，这些可以直接用 form表单发送请求。

而非简单请求则是在使用设定的请求方式请求数据之前,先发送一个OPTIONS请求,看服务端是否允许客户端发送非简单请求.只有"预检"通过后才会再发送一次请求用于数据传输。非简单请求如PUT。

除了以上这些区别外，还可以通过请求头来区分简单请求和非简单请求

请求头信息不超过以下几个字段：Accept、Accept-Language、Content-Language、Last-Event-ID，Content-Type 对应的值是以下三个中的任意一个 application/x-www-form-urlencoded、multipart/form-data、text/plain。只有满足这些**请求头**以及请求**方法**，GET、POST、HEAD的请求才是简单请求，除此之外都是非简单请求。

### 设置什么响应头可以触发浏览器下载文件

通过设置 Content-Type 和 Content-Disposition 字段即可触发浏览器下载资源

```javascript
// nodejs中
fs.readFile('./req_get_download.js', function (err, data) {
    const header = {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment;filename=req_get_download.js'
    };
    res.writeHead(200, header);
    res.end(data);
});
```

### 请求头字段Refer的意思

Refer就是告诉服务器该网页是从哪个页面链接过来的，服务器因此可以获得一些信息用于处理

作用：
1. 防盗链
2. 防止恶意请求
3. 空Refer，当一个请求并不是由链接触发产生的，那么自然也就不需要指定这个请求的链接来源

### http1.x和http2.0的对比

1. 完全兼容1.x的方法。
2. 二进制分帧
3. 多路复用
4. 头部压缩
5. 请求优先级
6. 服务端推送

[来源](https://juejin.cn/post/6844903984524705800)

# React
## 性能优化

1. 优化加载性能

- 根元素添加 loading，使用prerender-spa-plugin，都是为了减少白屏时间
- 利用缓存、动态polyfill、代码分割、tree-shaking
- 看需要是否需要把代码编译到ES5，不需要的话，直接使用ES6+的代码，减少编译时间和代码体积
- 使用懒加载和骨架屏
