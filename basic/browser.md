# 浏览器概览

##  浏览器的组成
* `界面控件` - 除浏览器主窗口外的其他部分，包括地址栏，前进后退按钮等都属于浏览器的界面控件
* `浏览器引擎` - 将用户界面的指令传递给渲染引擎
* `渲染引擎` - 负责解析HTML显示在浏览器主窗口
* `网络请求` - 用户网络请求，例如HTTP请求等
* `UI后端` - 绘制基本的窗口小部件
* `JS解释器` - 解释和执行JS代码
* `数据存储` - 持久层，如sessionStorage和localStorage及浏览器内置的数据库

***需要注意：谷歌浏览器每个tab页都会开启一个独立的进程，并且拥有一个独立的渲染引擎***

## 浏览器中的进程与线程
1. GUI渲染线程
2. JavaScript引擎线程
3. 定时器触发线程
4. 事件触发线程
5. 异步HTTP请求线程

## 浏览器的渲染过程
1. 解析HTML元素和文本节点，此时`document.readyState = 'loading'`。
2. 遇到外部link的CSS文件，浏览器会另外创建线程进行解析，所以外部CSS文件不会阻塞页面解析，但是会阻塞页面渲染。
3. 遇到外部的script脚本，如果没有async，defer属性，则会阻塞文档加载，等待脚本加载完成后继续解析文档；如果脚本有async，defer属性，浏览器会另外创建线程来加载脚本，对于async属性的脚本，加载完成后会立即执行。
4. 遇到img、video等资源，先正常解析DOM结构，浏览器会异步加载src指向的资源，然后继续解析文档。
5. DOM解析完之后，`document.readyState = 'interactive'`，此时defer属性的脚本开始顺序执行，执行完毕后触发了DOMContentLoaded事件，标志着程序执行从同步脚本执行阶段转换为事件驱动阶段。
6. async属性脚本加载完就会执行，不论是在HTML解析阶段还是在DOMContentLoaded之后执行，async属性脚本会阻塞load事件，当所有的async脚本执行完毕，以及img等资源加载完毕，`document.readyState = 'complete'`，window对象会触发load事件。

:::从浏览器绘制页面的过程来看
1. 解析HTML元素生成DOM树
2. 解析CSS生成CSS树，将CSS树和DOM树一起生成Render树
3. 进行布局Render树，也就是所谓的`Layout`
4. 遍历Render树，需要注意的是Render树的计算只需要遍历一次就能够完成，但是table及其内部的元素除外，这就是我们布局时尽量避免使用table的原因。浏览器将其的每一个节点渲染到浏览器上，即所谓的`Paint`

### 回流（reflow）和重绘（repaint)
* 回流（reflow）：就是页面元素布局发生变化，浏览器需要重新回到渲染之前的状态重新计算
* 重绘（repaint）：当元素节点的自身不影响布局的属性，如背景色、字体颜色、边框颜色等发生改变时会触发重绘

<em>触发回流一定会触发重绘，但是重绘却不一定会触发回流</em>

### 性能影响
* 回流的代价比重绘更高
* 现代浏览器会对频繁的回流和重绘操作进行优化，即会将所有的回流或重绘的操作放入一个队列，然后进行一起操作，避免多次进行回流和重绘

## 浏览器缓存
* 强缓存
* 协商缓存
* 本地缓存localStorage和sessionStorage

## 浏览器兼容性问题

可以参考这篇文章[浏览器兼容性问题解决方案 · 总结](https://juejin.im/post/59a3f2fe6fb9a0249471cbb4)

## 其他
* 判断浏览器类型通过使用浏览器内置对象navigator的useAgent属性
* 浏览器桌面通知Notification

## 参考链接
* [浏览器渲染基本原理解析](https://mp.weixin.qq.com/s/njwpsI-5T2mewPYjNef0jA)
* [浏览器的回流与重绘](https://juejin.im/post/5a9923e9518825558251c96a)
* [JavaScript判断桌面浏览器和移动浏览器](https://github.com/XavierXuV5/Check-Browser)
* [H5 notification浏览器桌面通知](https://juejin.im/post/5c6df433f265da2de80f5eda)
* [浏览器的工作原理：新式网络浏览器幕后揭秘](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)