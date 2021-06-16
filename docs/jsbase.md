# JS基础

## 原型

首先得从 JavaScript 这门语言说起，严格来说 JavaScript 是没有继承的机制的，所谓继承不过就是存在一个指针指向了其委托的对象。怎么理解呢，在 JavaScript 的世界中，对象并不是通过`类`来创建的，众所周知，JavaScript 中的类不过是一种语法糖，并不是真正的类。所有的对象，除了 null 以外，可以发现对象其实通过另外一个对象创建的，而另外一个对象则是由另一个对象创建，最终所有的对象都是由`Object.prototype`这个对象所创建，再其上，则不在有对象了。可以这么理解，JavaScript 世界中，除了 null 以外的一切对象的“追根溯源”都是`Object.prototype`。

原型是一个对象，简单来说在JavaScript中，所有的对象都是由一个对象创建出来的，这个对象就是Object.prototype。在函数中，存在一个`prototype`的属性指向了它的原型，而在一个实例中，它有一个非正式属性`__proto__`指向原型。对原型来说，它存在一个属性`constructor`指向了构造函数

```javascript
function Person() {}
const person = new Person()

console.log(Person.prototype === Person.prototype);
// 实例的原型指向了构造函数的原型
console.log(person.__proto__ === Person.prototype);
// 构造函数原型的constructor属性指向了构造函数本身
console.log(Person.prototype.constructor === Person);
// 实例对象的constructor属性指向了构造函数本身
console.log(person.constructor === Person);

```

实例对象中还有一个constructor属性指向了Person，也就是指向了自己，是可以被修改的，所以在编码不要信任constructor属性，来作为判断条件的依据。

### 原型链

对象中的关联关系组成的链式结构就是**原型链**

## 作用域

> 作用域是指程序源代码中定义变量的区域。
> 作用域，就是一套规则，用于确定在何处以及如何查找变量
> 作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限

JS采用了词法作用域，也就是静态作用域。一般说作用域，指的就是函数作用域，在JavaScript中最重要的也就是函数了。函数的作用域在函数创建时就已经确定了，而不是在执行时确定的作用域。

```javascript
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo();
}

bar(); // 结果是1，原因就是foo的作用域创建时就决定了其value是1
```

### 作用域链

> 由多个执行上下文的变量对象构成的链表就是作用域链

## 闭包

> 闭包是基于词法作用域书写代码时产生的自然结果，当函数可以记住并访问所在词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。
> 有权访问另一个函数作用域中的变量的函数

1. 闭包只会保存包含作用域中的任何变量的最后一个值。例如在 for 循环中使用 setTimeout 访问 i

```javascript
for (var i = 0; i < 10; i++) {
  setTimeout(() => { console.log(i) }, i * 1000)
}
```

此时只能访问 i 的最后一次赋值，也就是10，因此会每次打印出10，要解决这个问题，利用闭包在最外层套上一个立即执行函数，将外部的 i 传递给里面的匿名函数，这样的话，匿名函数和外面包含的立即执行函数形成闭包，引用当前循环的 i 值

1. 在闭包中访问 this 时会有一些意想不到的结果。这是因为内部函数执行时，会生成两个对象，this 和 argements，引擎搜索这两个变量时，只会搜索到该函数的活动对象，而不会去上层的作用域中搜索，所以此时的 this 指的实际是全局变量 window。
2. 利用闭包设计模块模式

```javascript
var myModules = (function(){
  var modules = {}

  function define (name, deps, callback) {
    for (let i = 0; i < deps.length; i++) {
      // 将依赖模块的字符串重新赋值为对应的模块
      deps[i] = modules[deps[i]]
    }
    modules[name] = callback.apply(callback, deps)
  }

  function get(name) {
    return modules[name]
  }

  return {
    define,
    get
  }
})()

myModules.define('a', [], function () {
  function hello (who) {
    return `Let me introduce ${who}`
  }

  return { hello }
})

myModules.define('b', ['a'], function (a) {
  var hungry = 'hippo'

  function awesome () {
    console.log(a.hello(hungry).toUpperCase())
  }

  return { awesome }
})

var foo = myModules.get('a')
var bar = myModules.get('b')
console.log(foo.hello('hippo')) // Let me introduce hippo
bar.awesome() // LET ME INTRODUCE HIPPO
```

## 变量提升

## this指向

## 立即执行函数

## instanceof的原理

## bind实现

## apply和call

## 柯里化

## v8的垃圾回收机制

## 浮点数精度问题

## new操作符

## 事件循环机制

## promise原理

## generator原理
## Tree-Shaking

由于JavaScript是动态语言，只有在编译时才能确定代码的作用，因此在初期各种定义的模块规范都无法使用Tree-Shaking。后面出现了ES6的模块化，是一种静态的模块依赖，所以可以在代码运行前确认模块依赖关系，从而分析出来，哪些变量和函数没有用到，从而可以在打包压缩时去掉无用的代码。

不过由于代码中可能会包含一些副作用的代码，类似rollup和webpack无法进行静态分析，所以也会导致Tree-Shaking失效。
