## 原型链
在 JavaScript 中，所有的对象都内置了一个特殊的属性 [[prototype]]，当我们引用对象的某个属性时，如

```javascript
// myObject.a
```
会触发 [[get]] 操作，如果在对象中找不到 a 属性，那么就会去 [[prototype]]链中去查找。对于默认的 [[get]] 操作而言，如果在对象本身找不到 a 属性，则会去访问 [[prototype]] 链， 如果在 [[prototype]] 中也找不到属性，那会继续沿着当前的 [[prototype]] 链继续查找，直到找到同名属性或者是返回 undefined。

所有的 [[prototype]] 链最终都会指向 `Object.prototype`，如果到这里还找不到属性，那么就会返回 undefined。

这个 [[prototype]] 链在对象中，其实就是 `__proto__` 属性，一般可以使用 `Object.getPrototypeOf` 来获取，函数也是对象，但是函数中的 [[prototype]] 链不是存在函数本身的属性，而是存在函数的 prototype 属性中

```javascript
function foo () {}

console.log(foo.prototype)

/*
foo.protype = {
  constructor: function foo()
  __proto__: Object
}
*/
```
函数中除了 [[prototype]] 链以外还有一个 constructor 属性指向了 foo，也就是指向了自己，并且这个是函数的默认属性，因此是可以被修改的，所以在编码不要信任 constructor属性，来作为判断条件的依据。

### 引申
> 作用域，就是一套规则，用于确定在何处以及如何查找变量 

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

2. 在闭包中访问 this 时会有一些意想不到的结果。这是因为内部函数执行时，会生成两个对象，this 和 argements，引擎搜索这两个变量时，只会搜索到该函数的活动对象，而不会去上层的作用域中搜索，所以此时的 this 指的实际是全局变量 window。

3. 利用闭包设计模块模式

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

## 继承
> 利用原型让一个引用类型继承另一个引用类型的属性和方法

继承可以通过以下方法来实现
1. 原型链继承

```javascript
function SuperType () {
  this.colors = ['red', 'white', 'green']
}
function SubType () {}

SubType.prototype = new SuperType()
const sub = new SubType()
// 如果往子类的colors中添加一个属性，那么超类中的属性也会改变
sub.colors.push('black')
console.log(sub.colors) // ['red', 'white', 'green', 'black']
```

2. 借用构造函数

```javascript
function SuperType () {
  this.colors = ['red', 'white', 'green']
}
function SubType () {
  // 可以向超类中传递参数
  SuperType.call(this)
}

const sub = new SubType()
console.log(sub.colors) // ['red', 'white', 'green']
```

3. 原型式继承

```javascript
function SubType (o) {
  function F() {}
  F.prototype = o
  return new F()
}
```

4. 寄生式继承

```javascript
function SubType (o) {
  var clone = object(0)
  clone.sayHi = function () {
    console.log('Hi')
  }
  return clone
}
```

5. ES6中的 extends 继承

### 引申

如何实现 ES6 的 extends 的关键字

```javascript
function inherit(subType, superType) {   
  subType.prototype = Object.create(superType.prototype, {     
    constructor: {       
      enumerable: false,       
      configurable: true,       
      writerable: true,       
      value: subType.constructor     
    }   
  })   
  Object.setPrototypeOf(subType, superType) 
}
```

## promise
## 异步相关
## 网络
cookie SameSite属性有三个值Strict，Lax，None
