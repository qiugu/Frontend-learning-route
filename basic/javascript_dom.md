## DOM

### Node
所有的DOM节点都是基于Node类，Node有以下几个类型
- Node.ELEMENT_NODE, nodeType = 1, 元素节点
- Node.ATTRIBUTE_NODE nodeValueType = 2, 属性节点
- Node.TEXT_NODE nodeType = 3, 文本节点
- Node.CDATA_SECTION_NODE nodeType = 4, XML文档的节点
- Node.ENTITY_REFERENCE_NODE nodeType = 5
- Node.ENTITY_NODE nodeType = 6
- Node.PROCESSING_INSTRUCTION_NODE nodeType = 7
- Node.COMMENT_NODE nodeType = 8, 注释节点
- Node.DOCUMENT_NODE nodeType = 9, 文档节点
- Node.DOCUMENT_TYPE_NODE nodeType = 10, 文档类型节点
- Node.DOCUMENT_FRAGMENT_NODE nodeType = 11, 文档片段节点
- Node.NOTATION_NODE nodeType = 12

### Document
### 操作DOM

### DOM扩展方法
- document.activeElement 始终引用DOM中获得焦点的元素
- element.innerHTML
- element.outerHTML
- element.innerText 还有一个element.textContent兼容性不同
- readyState.loading 正在加载文档 readyState.complete 已经加载完文档
- document.charset 设置字符集
- element.scrollIntoView() 滚动浏览器窗口或容器元素，使元素出现在视口

### SelectorAPI
- document.querySelector
- document.querySelectorAll

### 元素遍历
- childElementCount 元素的子节点的个数
- firstElementChild 指向第一个子元素
- lastElementChild 指向最后一个子元素
- previousElementSibling 指向前一个兄弟元素
- nextElementSibling 指向下一个兄弟元素

<em>这些方法都是为了能准确的找出元素节点，因为浏览器处理DOM元素之间的空白符的方式不一样</em>
