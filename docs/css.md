# css

![](../../../.gitbook/assets/css_mindgraphy.png)

CSS远比我们想象的更复杂、他的任意一个点拿出来可能都可以写出一篇篇幅不小的文章，往往就能见微知著。所以CSS不仅仅局限于他的名字，层叠样式表，更像是一个世界，一个网页中必不可少的重要组成部分。

围绕着上面的CSS体系，当然上面的图可能还不够全面，但是也能说明CSS的主要构成了。我们简单说下可能其中一些不为人知的“隐藏属性”，先留下一个大体的印象，拓展自己的CSS学习体系，后续才能慢慢深入其中。

## 文本排版

先来说字体，声明字体很简单，`font-famil`声明就完事了，但是有时我们可能会看到这样的声明：

```css
h1 {
  font-family: -apple-system,system-ui,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial;
}
```

这么一大串到底是几个意思呢，其实只要知道这个`font-faimly`属性中包含两种类型值就能明白了，一种是字体名称，一种叫做字体族。顾名思义，字体族就是所有字体的一个分类，在CSS世界中一般有以下几种字体族：

* 衬线字体。指的就是笔画开始、结束处有额外的装饰，并且笔画粗细不同。
* 无衬线字体。就是没有装饰，笔画粗细相同。
* 等宽字体。字形的宽度都相等。
* 草书字体。模仿人类手写的字体。
* 奇幻字体。没有归于以上四类字体的其他字体。

所以诸如上面的声明中的`sans-serif`、`Helvetica`指的是字体族，前者是衬线字体，后者是无衬线字体。那么这其中的意思就很明确了，如果系统中有前面的字体，那就使用前面的字体，如果没有的话，尝试使用后面的衬线字体，如果没有，则继续往后面的声明中寻找可用字体。

### 继承

一般文本类的属性都是可以继承的，例如`color`，`font-size`，`font-family`等。

与之对应有些属性时不能继承的，例如`border`，`padding`，`margin`，`background`等。其实也很好理解这些属性为何不能继承，因为一旦这些属性可以继承，那么会影响到了整个布局，例如，我们在父元素上加个边框，但是其子元素，后代元素都继承了边框，那就不得不去写更多的代码来消除继承的影响，这样的结果肯定不是CSS设计的初衷。

### line-height

首先需要明确的是`line-height`是作用在行内元素或者是行内块级元素上的，我们声明在块级框上的`line-height`实际也是作用于块级框中的内容的，因此经常可能看到会这么使用：

```css
div {
  line-height: 100px;
  font-size: 20px;
}
```

于是看到了这样的效果：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/420fd2f6b5d84090ae838bbd20c92389~tplv-k3u1fbpfcp-zoom-1.image)

可能下意识的就以为`line-height`就是作用在块级盒子上的。实际上呢，他是作用于块级盒子中的文本上的，如果去除 div 中的文本就会看到其宽度就没有 100px 了，文本也是行内元素，这点想必都是清楚的。

另外则是`line-height`的值可以为数值、百分比以及长度值，长度值也包括例如`em`这样的相对单位。当值不是具体长度值的时候，也就是为数值或者是百分比的时候，相对计算的是其`font-size`属性，如果`font-size`的值为`16px`，则`line-height: 1.5`的值就为`16 * 1.5`，就是`24px`，百分比值的时候也是这么计算的，不过需要注意的是，百分比值在继承的时候，会相对当前的`font-size`来计算，也就是说如果父子元素的`font-size`值不同，那么`line-height`计算出来的值也是不一样的。如果数值的话则没有这个问题，始终都是相对于数值来计算的。

另外经常会看到这样的用法，让文字垂直居中：

```css
div {
  line-height: 100px;
  height: 100px;
}
```

实际就是只需要`line-height`就能实现垂直居中，和下面的高度没有什么关系，而为什么这么设置可以垂直居中呢？这就要来看`line-height`设置的属性究竟如何作用的。还是来看上面的图，当设置`line-height`的时候，div 的高度就被设置为了 `100px`，但是这个值是这么分配的，用`100px - 1em`得到的值分成两份，分别加到字体的上部分和下部分的区域，这样字体就平分上下区域，形成一种垂直居中的情况，`1em`就是字体的大小。当然这里其实是近似的垂直，因为不同字体实际占据的`1em`的大小是不一样的，因此分配上下半行高的时候，会有存在偏差，除此之外，下面说的一种属性也会影响到这种情况。

### strut\(支柱\)

这是个在CSS中看不见，但却无处不在，有些书中将之称为空白节点。他是支撑内联文本存在的支柱。可以通过这种方法来看到他：

```css
.line1 {
  line-height: 0;
  border: 1px solid red;
  font-size: 20px;
}
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5428e559b571406cb21a1a3b7a7a9d56~tplv-k3u1fbpfcp-zoom-1.image)

根据上面学到的关于`line-height`的知识，当设置为 0 时，文本行高为 0，那么外面的包含块，也就是父元素理论上也应该是 0，但是我们发现这里的高度是 2，其实这就是所谓支柱的存在了，存在于每个内联盒子的前面，先记住他，下面会用到。

### vertical-align

`vertical-align`默默在背后“付出了很多”，来看个🌰：

```markup
<div class="line3">
  <img src="../../../assets/css_mindgraphy.png" width="100">
</div>
```

于是我们发现图片的下面出现了一点间隙，针对这种情况，`vertical-align`就可以出场了，只要将`vertical-align`设置为除默认值之外的位置值就可以了。

```css
.line3 > img {
  vertical-align: top;
}
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c75582a6da3472aa88878375ba58100~tplv-k3u1fbpfcp-zoom-1.image)

可以看到图片下面的间隙没有了，当然这里除了使用`vertical-align`以外，还可以设置`line-height: 0`、`font-size: 0`都能去解决这个问题。原因就在于上面说到`strut`， 图片是内联元素，因此其也存在一个看不见的文本节点，相当于这样

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac2edcc4d79a4347a37967f3afd619ed~tplv-k3u1fbpfcp-zoom-1.image)

噢~这样就知道应该是默认的行高起的作用，对了，还有`vertical-align`的作用，因为其默认值是`baseline`也就是基线对齐，可以看到图片底部可以文本的底部对齐了，那么当设置`vertical-align: top`、`line-height: 0`或者`font-size: 0`，前者相当于将基线对齐变成了顶部对齐，自然不会出现下面的间隙了，后两者则是将行高去掉，另外则是隐藏了文本大小，那么自然间隙也都不存在了。

除此之外，我们还有一种方法能够解决这个问题，就是直接改变图片的`display`值，将其设置为块级元素，那么上面所说的空白节点strut自然就不存在了，也能解决这个问题。不过这里改变了`display`值，可能会影响到布局，所以还是推荐使用上面几种办法。

`vertical-align`除了设置位置值，也就是除了`top`，`middle`，`bottom`这些关键字，还可以设置具体的数值，百分数，也可以设置负数值，负数值其实就是向下偏移指定的值，百分数就是相对`line-height`的值设定。

## CSS的全局关键字

全局关键字就是所有的属性都能使用的属性值，总共是有三个`inherit`，`initial`，`unset`。这些关键字是CSS3才出现的，在IE11以前和Opera Mini是不支持的。

inherit 就是打破了上面的继承限制，只要属性值设置为 inherit，那么就能从父元素继承这个属性。

initial 则是将属性设置为初始值，主要是用于那些没有预定义的初始值的属性，例如 color 属性，默认是取决于用户代理，就是用户设置的某个颜色值，而设置为 initial 则会将字体颜色变成黑色。

unset 则是前两个关键字的替代，就是对于继承的属性来说，unset 就表示 inherit，而对于不继承的属性则表示 initial。

还有一个特殊属性 all 就只支持这三个关键字。all 表示除了 direction 和 unicode-bidi 之外的所有的属性。因此如果设置了 all: inherit 则表示除了上述两个属性外，其他所有的CSS属性都从其父元素继承。

## 选择符

这里选择符，就是平常所说的选择器。选择器的种类非常多，但大多就是上面列举的几种，除此之外，还有一些平时可能忽略的通用选择符：

```css
* {
  box-sizing: border-box;
}
```

看起来非常的简单，但是滥用他会造成一些意向不到的结果。首页就是他会给所有的元素都添加上对应的属性，即使这个元素压根就用不到这个属性，这样就造成了一定的性能浪费，另外一点则是非常容易忽视的地方在于他的优先级，也是我们说的特指度，通用选择器的特指度为0，结合上面的继承来说，继承是没有特指度的，因此你如果用了通用选择符，然后指望元素通过继承获得父元素的继承属性，却会发现不起作用。来看个🌰

```css
* {
  color: green;
}
div#page {
  color: black;
}
```

```markup
<div id="page">
  我是CSS世界的小<em>菜鸡</em>
</div>
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2309fc3d0faf4b6e9014bfa989ee2e26~tplv-k3u1fbpfcp-zoom-1.image)

很明显，最终看到的`菜鸡`是绿色的。因此这也是非常容易让人困惑的地方，所以推荐是尽量不要过度使用

## 盒模型

### 块级盒子

我们都知道BFC、IFC这样的名词，也知道他们的定义，比如BFC，就是块级格式化上下文，表示块级盒子定义的区域，拥有自己的渲染规则，并且盒子之间不会相互影响等。但是具体包含了哪些渲染规则以及如何渲染可能知道的比较模糊，这里也是说下容易忽略的地方。

在说这些渲染规则之前，先来说下一些概念，理解了这些概念，才能更好的理解盒模型。

* 块级框，div 等块级元素生成的框体就是块级框
* 行内框，同理，span 这样的行内元素生成的框体就是行内框
* 行内块级框，即 `display: inline-block`的行内块级元素生成的框体就是行内块级框。
* 容纳快，就是包含当前元素的父级框体，简单来说，块级元素的容纳块就是块级框，行内元素的容纳块就是行内框，当然也有可能是块级框。

而BFC、IFC这样的格式化上下文就是在容纳块中定义的。先从横向布局开始说起，看下面的🌰

```css
.line8 > .child1 {
  width: auto;
  margin-left: 50px;
  margin-right: 20px;
}
.line8 > .child2 {
  width: 300px;
  margin-left: auto;
  margin-right: 150px;
}
.line8 > .child3 {
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}
.line8 > .child4 {
  width: 300px;
  margin-left: auto;
  margin-right: -200px;
}
```

```markup
<div class="line8">
  <span class="child1">CSS世界p元素1</span>
  <span class="child1">CSS世界p元素1</span>
</div>
<div class="line8">
  <p class="child2">CSS世界p元素2</p>
</div>
<div class="line8">
  <p class="child3">CSS世界p元素3</p>
</div>
<div class="line8">
  <p class="child4">CSS世界p元素3</p>
</div>
```

得到的结果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b0cc45e88104d078b794c031f0b7d39~tplv-k3u1fbpfcp-zoom-1.image)

从中也不难看出： 1. 横向布局时，外边距不会发生折叠 2. 包含一个`auto`值时，用整个容纳块的宽度减去设置的宽度，剩下的宽度分配给设置给`auto`的元素，因为外边距可以是负值，因此对于负值而言，也同样适用上述规则，可以看到第四个div就是负值外边距的情况。 3. 包含两个`auto`值时，就是将剩余距离平分为两份，每个`auto`值各占一半，这也是我们平时经常使用`margin: 0 auto;`居中的原理是一样的。

需要注意的时，这里关于块级盒子的一些属性，如外边距，内边距，边框，轮廓等，除了外边距可以设置为负值，其他设置为负值的时候，浏览器会忽略掉整条规则，并且`auto`值也只有宽高、外边距以及轮廓属性可以设置，其他设置`auto`值都是无效的，会被浏览器忽略掉。

再说纵向布局会产生margin折叠，折叠的规则就是**取大值**，也就是对于两个纵向布局的元素，`margin-bottom`和`margin-top`发生重叠，那么谁的值大就取谁的值作为折叠后的外边距的值。如果`margin`为负值的话，则取其绝对值大的那个值为折叠后的边距，如下所示：

```css
.line8 > .child5 {
  margin-bottom: 10px;
}
.line8 > .child6 {
  margin-top: -50px;
}
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfe5b13bc18d4070b747c0410d81a976~tplv-k3u1fbpfcp-zoom-1.image)

### 行内盒子

行内元素分为两个，一个是非置换元素，一个是置换元素。这两个元素在布局上也是有所不同的。

老规矩，先来说些概念：

* 匿名文本，就是不包含标签的文本，比如之前例子中我们给 span 元素前面加上了`x-height`这样的文本就是匿名文本。
* 字体框，顾名思义，就是`font-size`属性决定的字体占据的框
* 行距，就是`line-height`属性设置的值减去`font-size`的值就是行高，除以2分配和字体上下两端，则是半行距。
* 行内框，就是行距加上内容区，也就是字体文本的区域，对行内非置换元素来说，就是`line-height`设置的值，对于置换元素来说，就是他的内容区。
* 行框，经过一行内所有的行内框的最高点到一行内行内框的最低点之间的距离。

下面是他的示意图

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e62c5d2a8c941c2815fb981757e5dd0~tplv-k3u1fbpfcp-zoom-1.image)

1. 非置换元素

   结合上面的概念，来看个🌰

```css
.line10 {
  border: 1px solid red;
}
.line10 > p {
  font-size: 12px;
  line-height: 12px;
}
.line10 > p::first-line {
  border: 1px solid #ccc;
  background: #f2f2f2;
}
.line10 > p > strong {
  font-size: 24px;
}
```

得到如下的显示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cba939550754dd5a37dbb4535bbf47e~tplv-k3u1fbpfcp-zoom-1.image)

可以看出来，加粗文本那段明显超出了内容区，即便如此，文本也都还是默认对齐的，下面改变一下强调文本，添加一些样式：

```css
.line10 > p > em {
  padding: 20px;
}
.line10 > p > em {
  border: 20px solid blue;
}
.line10 > p > em {
  margin: 20px;
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92d099437c784780b9efc19c9b1f4ab6~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/099d9a6fdbf746b1a5efa2f98eaef3a2~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79e1dba4a3e74a87bdf7e42fc2500a4b~tplv-k3u1fbpfcp-zoom-1.image)

这里 1 像素的蓝色边框是为了能够看清强调文本所占据的范围，通过这几个结果对比，我们能看到，对于行内元素来说，无论是`padding`、`border`、还是`margin`对于行框来说完全没有影响，也就是纵向距离保持不变，不过文本的左右还是会产生了间距，同理对于`负margin`来说，行框大小依然不变，不过左右会产生重叠。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f5f36cb5195433793475d77056cf051~tplv-k3u1fbpfcp-zoom-1.image)

那么既然行内元素纵向布局不受这些组成盒模型的属性所影响，那么到底什么属性影响行框大小呢，试试这个属性：

```css
.line10 > p > strong {
  font-size: 24px;
  vertical-align: 4px;
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf720b457e38482faae5038d2ea195d2~tplv-k3u1fbpfcp-zoom-1.image)

可以看到行框的高度比之前多出了`4px`，这也就是说`vertical-align`会影响到纵向布局。在前一部分的时候说过，`vertical-align`计算是会受到`line-height`影响的，并且对于下面说到的置换元素而言，`line-height`就是置换元素的内容区，所以我们知道，影响行内元素纵向布局的主要属性就是这两个了。

1. 置换元素

   置换元素的布局则又不同了，还是看个🌰

```css
.line11 {
  font-size: 15px;
  line-height: 18px;
  border: 1px solid red;
}
.line11 > img {
  height: 30px;
  /* margin: 20px; */
  /* border: 0; */
  /* padding: 0; */
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb48d5b421be4e14b9359b2b1d335669~tplv-k3u1fbpfcp-zoom-1.image)

展示的结果其实和我们上面介绍图片间隙的例子是一样的，现在来看看对布局的影响，上面注释的三个属性，一个一个尝试一下，会发现都会对行内框的高度有影响，这是和非置换元素完全不同的表现。这里就不展示具体的结果了，可以自己去尝试看看。

1. 行内块级元素

   这里将行内块级元素放在这里是因为行内块级元素可以看做是置换元素，因此他们的布局影响是一样的，盒模型的属性都会对上下左右产生影响，因此不再赘述。

