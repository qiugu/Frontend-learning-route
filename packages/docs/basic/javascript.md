# javascript

## 数据类型

### 基本类型

* String
* Number
* Boolean
* Null
* Undefined
* Symbol

### 引用类型

* Function
* Array
* Object
* Map
* Set
* WeakMap
* WeakSet

## 作用域

## 对象用法

[创建对象和继承](javascript_obj.md)

## BOM

## DOM

## 事件

1. 事件流 分为两种，一种是**事件冒泡**，一种是**事件捕获**
2. 事件处理程序
3. 获取DOM引用，给DOM引用添加事件属性，例如

   ```javascript
   var btn = document.querySelector('button')
   btn.onclick = function() {
   console.log('clicked!')
   }
   ```

4. addEventListener、removeEventListener方法

接受两个参数，第一个参数是事件处理回调，第二参数为布尔值，true表示在事件捕获阶段触发事件处理程序，false则相反。

取消事件处理程序时第一个参数要和注册事件时的引用保持一致，否则无法取消事件监听

* IE下使用attachEvent、detachEvent方法
* 事件对象

> 处理事件时，会产生一个事件对象，包含所有与事件相关的信息

* DOM中事件对象会注入到事件处理程序中
* IE中事件对象则存储在 window 对象上
* 事件类型
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
* 事件委托
* 模拟事件

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

## 表单

1. 获取表单

```javascript
var form = document.getElementById('form')

// 也可以使用document中的属性来获取所有的表单
var form = document.forms['formname']

// 获取表单中的字段，利用上面得到的表单引用
form.elements['fieldname']
```

1. 表单提交与重置
2. 直接利用获得的表单引用，执行submit或reset方法
3. 利用按钮来提交重置，设置按钮的type属性为`submit`、`reset`
4. 表单操作
5. 表单中存在的事件：blur\(\)、focus\(\)、change\(\)
6. 选择文本，当点击输入框时选中输入框中的所有文本，可以使用select\(\)方法，也可以利用HTML5提供的setSectionRange\(\)来选择部分文本
7. 过滤表单，利用keypress过滤按键输入，HTML5约束验证输入，例如required、validity、pattern。注意HTML5的验证属性不会阻止输入，只是提供一个验证方法。禁用验证：novalidate
8. 操作剪切板，一些剪切板相关事件：beforecopy、copy、beforecut、cut、beforepaste、paste
9. 富文本
10. 通过给iframe设置designMode = 'on'来开启富文本输入模式
11. 利用DOM元素的contenteditable属性开启富文本输入

```javascript
// 通过iframe
<iframe src="test.html" frameborder="0" name="rich" width="100%" height="100%"></iframe>

window.addEventListener('load', () => {
  frames['rich'].document.designMode = 'on'
  frames['rich'].document.execCommand('italic', false, null)
})

// contenteditable
<div contenteditable></div>
```

1. 富文本的操作方法
2. execCommand\(\) 

## canvas

[canvas的基本使用](javascript_canvas.md)

## 错误处理与调试

