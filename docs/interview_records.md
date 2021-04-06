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
