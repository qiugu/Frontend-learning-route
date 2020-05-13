## 数据类型

### 基本类型
- String
- Number
- Boolean
- Null
- Undefined
- Symbol

### 引用类型
- Function
- Array
- Object
- Map
- Set
- WeakMap
- WeakSet

## 作用域

## 对象用法
[创建对象和继承](./javascript_obj.md)

## BOM

## DOM
[](./javascript_dom.md)

## 事件

1. 事件流
分为两种，一种是**事件冒泡**，一种是**事件捕获**

2. 事件处理程序
* 获取DOM引用，给DOM引用添加事件属性，例如
```javascript
var btn = document.querySelector('button')
btn.onclick = function() {
  console.log('clicked!')
}
```
* addEventListener、removeEventListener方法

接受两个参数，第一个参数是事件处理回调，第二参数为布尔值，true表示在事件捕获阶段触发事件处理程序，false则相反。

取消事件处理程序时第一个参数要和注册事件时的引用保持一致，否则无法取消事件监听

* IE下使用attachEvent、detachEvent方法

3. 事件对象

>处理事件时，会产生一个事件对象，包含所有与事件相关的信息

* DOM中事件对象会注入到事件处理程序中
* IE中事件对象则存储在 window 对象上

4. 事件类型

* UI事件
* 焦点事件
* 鼠标事件
* 滚轮事件
* 文本事件
* 键盘事件
* 复合事件
* 变动事件
* HTML5事件（contextmenu, beforeunload, DOMContentLoaded, readystatechange, hashchange）
* 设备事件（orientationchange, MozOrientation, deviceorientation, devicemotion）
* 触摸与手势事件

5. 事件委托
6. 模拟事件

```javascript
var btn = document.getElementById('#btn')
// 创建时间对象
var event = document.createEvent('MouseEvents')

// 触发事件
btn.dispatchEvent(event)
```

IE中的模拟事件

```javascript
var btn = document.getElementById('#btn')
// 创建时间对象
var event = document.createEventObject('MouseEvents')

// 触发事件
btn.fireEvent('onkeypress', event)
```

## 错误处理与调试
