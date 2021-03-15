# DOM

## Node

所有的DOM节点都是基于Node类，Node有以下几个类型

* Node.ELEMENT\_NODE, nodeType = 1, 元素节点
* Node.ATTRIBUTE\_NODE nodeValueType = 2, 属性节点
* Node.TEXT\_NODE nodeType = 3, 文本节点
* Node.CDATA\_SECTION\_NODE nodeType = 4, XML文档的节点
* Node.ENTITY\_REFERENCE\_NODE nodeType = 5
* Node.ENTITY\_NODE nodeType = 6
* Node.PROCESSING\_INSTRUCTION\_NODE nodeType = 7
* Node.COMMENT\_NODE nodeType = 8, 注释节点
* Node.DOCUMENT\_NODE nodeType = 9, 文档节点
* Node.DOCUMENT\_TYPE\_NODE nodeType = 10, 文档类型节点
* Node.DOCUMENT\_FRAGMENT\_NODE nodeType = 11, 文档片段节点
* Node.NOTATION\_NODE nodeType = 12

## Document

## 操作DOM

## DOM扩展方法

* document.activeElement 始终引用DOM中获得焦点的元素
* element.innerHTML
* element.outerHTML
* element.innerText 还有一个element.textContent兼容性不同
* readyState.loading 正在加载文档 readyState.complete 已经加载完文档
* document.charset 设置字符集
* element.scrollIntoView\(\) 滚动浏览器窗口或容器元素，使元素出现在视口

## SelectorAPI

* document.querySelector
* document.querySelectorAll

## 元素遍历

* childElementCount 元素的子节点的个数
* firstElementChild 指向第一个子元素
* lastElementChild 指向最后一个子元素
* previousElementSibling 指向前一个兄弟元素
* nextElementSibling 指向下一个兄弟元素

_这些方法都是为了能准确的找出元素节点，因为浏览器处理DOM元素之间的空白符的方式不一样_

**DOM结构的深度优先遍历** 1. NodeIterator 使用document.createNodeIterator\(\)创建实例 2. TreeWalker

## 元素大小

* 偏移量
* `offsetHeight` 元素在垂直方向上占用的空间大小
* `offsetWidth` 元素在水平方向上占用的空间大小
* `offsetLeft` 元素的左外边框到子元素的左内边框之间的距离
* `offsetTop` 元素的上外边框到子元素的上内边框之间的距离
* 客户区大小
* `clientWidth` 内容区的宽度加上左右的内边距
* `clientHeight` 内容区的高度加上上下的内边距
* 滚动大小
* `scrollHeight` 没有滚动条的情况下元素内容的高度，即元素可见于不可见的高度和
* `scrollWidth` 没有滚动条情况下元素内容的宽度，即元素可见不可见的宽度和
* `scrollLeft` 不可见区域的左侧的像素距离
* `scrollTop` 不可见区域的上面的像素距离

## 范围

1. 创建范围

   \`\`\`javascript

   document.createRange\(\)

// ie8以前的浏览中 document.createTextRange\(\)

```text
### style 对象
1. 获取某元素的计算样式

```javascript
window.getComputedStyle(element)
// ie不支持这个方法，可以使用下面的属性代替
element.currentStyle
```

1. 获取所有引用的样式表

```javascript
document.styleSheets
```

