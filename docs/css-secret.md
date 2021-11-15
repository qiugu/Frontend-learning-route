---
theme: qklhk-chocolate
highlight: srcery
---
## 开篇

最近把 《CSS揭秘》这本书又精读了一遍。简单介绍下这本书，这本书是 CSS 工作组的大佬成员写的一本书，某瓣评分也挺高。里面提到了很多有用的 CSS 技巧，第一次读的时候，粗略的翻了一遍，没怎么深究，这次又翻了出来再次研读。

对着书中的代码都敲了一下，又有了一些不一样的感受。结合最近遇到的一些 CSS 问题，读完以后竟然有种茅塞顿开的感觉，所以就挑选了其中一些可能大家会遇到的案例，先给大家展示一下，算是一个导读吧。当然因为本人水平有限，感兴趣的可以自行去读读这本书，强烈推荐啊！

## CSS编码原则

在开始分享书中一些有趣的案例之前，先来学习一下书中所提到的 CSS 的书写原则。什么是书写原则，我觉得就和写 JS 是一样的，就是写出来的代码要具有可维护性、可读性以及可复用性。应用在 CSS 身上，可以归纳为以下几点：

- 减少重复，Don‘t repeat yoursef，DRY原则。
- 结构分离，能使用 CSS 完成的不要用 HTML 来代替。
- 考虑 CSS 代码的可维护性，多用简写属性、善用继承。

首先减少重复很容易理解，应用在任何语言中都是一样的，不要去写重复的 CSS 代码，这样不仅会导致文件体积变大，可维护性也会变差，所以一般如果出现重复两次以上的属性，就可以抽离出来，做成类似 CSS 变量或者预处理器的 mixins。

我们经常会遇到写一个小箭头的需求，一般大家可能会用一个额外的 div 或者是 span来写这个箭头，但实际上这种 HTML 标签是没语义的，完全可以使用其他元素上的伪元素定位来替代，这样就不会占用额外的 HTML 标签了。还有类似什么做装饰作用的分割线什么的，都可以考虑使用伪元素来替代。这就是我们说的，能使用 CSS 完成的工作，尽量交给 CSS 来做，这样会让页面结构更加清晰。 

使用简写也很简单，CSS 中存在非常多的简写属性，它把多个属性合成为一个属性，这样不但减少了代码量而且如果我们要修改相关属性的时候也非常的方便，这同样也涉及到了下面提到的一个原则，可维护性原则。

可维护性原则是我重点想要说的，我觉得也是这本书中一直会体现的一个地方。CSS 的可维护性到底是什么呢，可以来看个简单的例子🌰

```css
.bad {
  padding: 6px 16px;
  border: 1px solid #446d88;
  background: #58a linear-gradient(#77a0bb, #58a);
  border-radius: 4px;
  box-shadow: 0 1px 5px gray;
  color: white;
  text-shadow: 0 1px 1px #335166;
  font-size: 20px;
  line-height: 30px;
}
```

![截屏2021-10-12下午6.57.06的副本.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02dbfa45a78e4fe88c08c544b5d927c8~tplv-k3u1fbpfcp-watermark.image?)

这就是一个普通的按钮，现在假设需求变了，我们需要一个弹框中的确认和取消按钮，该怎么去修改，才能使修改的地方最少呢。对，修改的地方最少，这就是我们追求的地方。在 CSS 文件日益变得非常庞大的时候，当我们需要修改某些样式的时候，希望只修改其中的一处，或者几处，而不是到处去修改。

回到这个需求上来，如何把一个普通按钮修改为弹框的确认按钮，我们需要修改背景颜色，文字阴影，边框，大小等等内容，这就不符合上面提到的可维护性的原则了，所以得修改一下这段代码：

```css
div {
  font-size: 50px; /* 使用相对单位，只需要改动一处，就可以灵活改变按钮的大小 */
}
.good {
  display: inline-block;
  padding: .3em .8em;
  border: 1px solid rgba(0, 0, 0, .1);
  background: #58a linear-gradient(hsla(0,0%,100%,.2), transparent);
  border-radius: .2em;
  box-shadow: 0 0.05em 0.25em rgba(0,0,0,.5);
  color: white;
  text-shadow: 0 0.05em 0.05em rgba(0,0,0,.5);
  font-size: 125%;
  line-height: 1.5;
}
```

这里的区别就是使用了相对单位 em 代替了原先的像素的单位，目的注释中也提到了，就是为了修改方便，像上面的例子，只需要改动 div 的字体大小就可以随意改变按钮的大小。

除此之外，如果我们需要改变按钮的颜色，像上面提到的对话框中的确认和取消按钮，可以这么去修改：

```css
.ok {
  background-color: #6b0;
}
.cancel {
  background-color: #c00;
}
```

![截屏2021-10-14下午9.57.46.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cca4bd40e14848d9a9f709abdcb5ff2a~tplv-k3u1fbpfcp-watermark.image?)

如上，我们只需要加个背景颜色就可以了，这个平时大家应该都会用到。这里不一样的地方在于 background 属性写了两个颜色，其中一个还是渐变色，为什么要这么写呢？原因就在于按钮不止有背景色，还有边框、文字阴影、盒子阴影，这些都需要随着背景色的变化而变化，所以在可维护的写法中可以看到，这些属性都变成了半透明。这样背景色覆盖在上面，就不需要单独修改这些属性了。而 background 中使用了两个背景色，其实是按钮的主色 #58a 这么一个颜色值作为主色调，另外通过 hsla 对比度饱和度调整形成一个主色调的明暗效果。关于多重背景的应用，后续还会说到。

另外可维护性还体现在简写属性上，这个也是显而易见的，简写属性为几个属性的复合写法，不但减少了代码量，同时修改起来也会非常的方便，

说完了这些，来看看在实际项目中如何写出一个好的 CSS 呢。

## CSS复杂背景的应用

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a83e98fcaa1745f6947c035b58a58245~tplv-k3u1fbpfcp-watermark.image?)

如何写出上图所示的复杂的背景呢，条纹背景，网格背景、棋盘背景等等。除了用图片来替代这些背景，我们也可以使用纯 CSS 来实现，这样就不需要额外的图片结构，不需要多余的带宽，也符合上面提到的能用 CSS 来解决的就不要使用一些影响页面结构的 DOM 元素来解决。

办法就是一个平时可能很少用到的一个属性：线性渐变 linear-gradient。这里就是利用了渐变属性 linear-gradient 的一个特性，**后一个渐变颜色的范围如果是0的话，那么这个渐变颜色将不会有过渡，而是直接从前一个颜色到后一个颜色**。什么意思呢，来看一个条纹背景的实现思路就明白了。

```css
background: linear-gradient(#fb3 50%, #58a 0);
```

就这么简单，一行足以，来看看效果

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcf4ec4de5f44c99a724d1ce84bc13ed~tplv-k3u1fbpfcp-watermark.image?)

好像不是我们要的条纹，修改一下

```css
background: linear-gradient(#fb3 50%, #58a 0);
/* 利用了背景平铺的效果 */
background-size: 100% 30px;
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd4b1247ab1d4825bdbac440fdd86c16~tplv-k3u1fbpfcp-watermark.image?)

是不是有点意思了，想要个垂直的条纹呢，改变下渐变的方向就可以了

```css
background: linear-gradient(to right, #fb3 50%, #58a 0);
background-size: 30px 100%;
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9802ea071034cc8abc23153f3849b75~tplv-k3u1fbpfcp-watermark.image?)

也成了，那如果想要一个斜向的条纹呢，是不是像下面这么写就可以了：

```css
background: linear-gradient(45deg, #fb3 50%, #58a 0);
background-size: 30px 30px;
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04c8ff5567f247d388b00c084b1cbad7~tplv-k3u1fbpfcp-watermark.image?)

不对啊，为什么会是这样的呢？这和我们想象的不一样啊。实际渐变中旋转的45度，只是旋转了当前的一小块背景的45度

![image-20211113134217014](/Users/qiugu/Library/Application Support/typora-user-images/image-20211113134217014.png)

就是上面红色框选出来的一小段的45度，我们需要的效果应该是这样的

![image-20211113134519254](/Users/qiugu/Library/Application Support/typora-user-images/image-20211113134519254.png)

可以看到红色框中的颜色变化了4次，并不是两次，找到了问题所在，改下上面的代码

```css
background: linear-gradient(45deg,#fb3 25%, #58a 0, #58a 50%, #fb3 0, #fb3 75%, #58a 0);
background-size: 30px 30px;
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1bdf7bbf83843fab41387587151f9c8~tplv-k3u1fbpfcp-watermark.image?)

好了，大功告成，所以有时候写 CSS 还得有一颗细心观察的心。

然后再说到网格背景、棋盘背景，波点背景什么的，心里是不是有底了。这里就不在去深入分析，不过注释上面会提到一些值得注意的地方，可以照着下面的代码，自己敲一敲感受一下。

- 网格背景

  ```css
  /* 网格图案，写法参照DRY，改动颜色只需要改动background-image这里就可以 */
  background: white;
  /* 利用了background-image多重背景，一个是横向的渐变，一个是纵向的渐变 */
  /* 另外这里的长度都是百分比单位，也可以写成像素单位，这样就变成了最开始的第二个图案 */
  background-image: linear-gradient(90deg, rgba(200,0,0,.5) 50%, transparent 0),
  linear-gradient(rgba(200,0,0,.5) 50%, transparent 0);
  background-size: 30px 30px;
  ```

- 波点图案

  ```css
  /* 波点图案则是使用了径向渐变来实现 */
  background: #655;
  background-image: radial-gradient(tan 30%, transparent 0),
  radial-gradient(tan 30%, transparent 0);
  background-size: 30px 30px;
  /* 这里做了偏移，否则就是第一个波点图案了 */
  /* 这里的偏移位置需要为background-size设置的一半，也就是每个贴片偏移到中间位置 */
  background-position: 0 0, 45px 45px;
  ```

- 棋盘图案

  ```css
  /* 棋盘图案，这里使用了透明度来表示棋盘的深浅色，替换background主色即可改变其他色系的棋盘 */
  background: #eee;
  background-image: linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0),
  linear-gradient(45deg, transparent 75%, rgba(0,0,0,.25) 0),
  linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0),
  linear-gradient(45deg, transparent 75%, rgba(0,0,0,.25) 0);
  background-position: 0 0, 15px 15px, 15px 15px, 30px 30px;
  background-size: 30px 30px;
  ```

- 角向渐变创建棋盘图案

  ```css
  /* 角向渐变轻松创建棋盘图案，注意兼容性 */
  background: #58a repeating-conic-gradient(rgba(0,0,0,.25) 0 25%, rgba(0,0,0,.5) 0 50%);
  background-size: 30px 30px;
  ```

## CSS复杂图形

所谓复杂图形，就是一些不规则的图形，例如平行四边形，菱形、椭圆以及切角图形等。都是在日常开发中比较常遇到的。来看看纯 CSS 如何去实现呢？

先在脑海中想象一下平行四边形的样子，然后发现其实不就是一个矩形再加两个三角形吗。确实可以这么做，在你没有其他更好的办法的时候，这也是个办法。但是今天就有一个意想不到的方法，利用 transform 变形这个属性来做。

想象一下，把矩形放在三维空间，然后绕 z 轴旋转一定角度，然后从二维空间旋转；

## 动画

## 实际应用

### 自定义的checkbox

### 图片对比工具

### 毛玻璃

### 文字效果

## 结尾

[上面demo的地址仓库](https://github.com/qiugu/Front-end-learning-route/tree/master/src/css)
