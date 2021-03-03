# interviews

## 原型

在 JavaScript 中，所有的对象都内置了一个特殊的属性 [[prototype]]，当我们引用对象的某个属性时，如

```javascript
// myObject.a
```

会触发 [[get]] 操作，如果在对象中找不到 a 属性，那么就会去 [[prototype]]链中去查找。对于默认的 [[get]] 操作而言，如果在对象本身找不到 a 属性，则会去访问 [[prototype]] 链， 如果在 [[prototype]] 中也找不到属性，那会继续沿着当前的 [[prototype]] 链继续查找，直到找到同名属性或者是返回 undefined。

会触发 \[\[get\]\] 操作，如果在对象中找不到 a 属性，那么就会去 \[\[prototype\]\]链中去查找。对于默认的 \[\[get\]\] 操作而言，如果在对象本身找不到 a 属性，则会去访问 \[\[prototype\]\] 链， 如果在 \[\[prototype\]\] 中也找不到属性，那会继续沿着当前的 \[\[prototype\]\] 链继续查找，直到找到同名属性或者是返回 undefined。

所有的 \[\[prototype\]\] 链最终都会指向 `Object.prototype`，如果到这里还找不到属性，那么就会返回 undefined。

这个 \[\[prototype\]\] 链在对象中，其实就是 `__proto__` 属性，一般可以使用 `Object.getPrototypeOf` 来获取，函数也是对象，但是函数中的 \[\[prototype\]\] 链不是存在函数本身的属性，而是存在函数的 prototype 属性中

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

## 作用域

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

1. 借用构造函数

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

1. 原型式继承

```javascript
function SubType (o) {
  function F() {}
  F.prototype = o
  return new F()
}
```

1. 寄生式继承

```javascript
function SubType (o) {
  var clone = object(0)
  clone.sayHi = function () {
    console.log('Hi')
  }
  return clone
}
```

1. ES6中的 extends 继承

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

## 一些常用API的实现

### call/apply的实现

```JavaScript
// call的实现
Function.prototype.myCall = function(context, args) {
  // 获取上下文，如果为null的话则指向window
  context = context || window;
  // 获取函数的参数，利用argments对象截取从第一位往后的参数
  const params = [...arguments].slice(1);
  // 利用Symbol生成一个唯一的属性名
  const symbol = Symbol('fn');
  // 把属性挂到上下文上，执行该方法
  context[symbol] = this;
  const res = context[symbol](...params);
  // 执行完成后删除生成的这个属性
  delete context[symbol];

  return res;
}

// apply的实现
Function.prototype.myApply = function(context, args) {
  context = context || window;
  const symbol = Symbol('fn');
  context[symbol] = this;
  const res = context[symbol](...args);
  delete context[symbol];

  return res;
}
```

### bind的实现

```JavaScript
Function.prototype.myBind = function(context, args) {
  const self = this;
  const params = Array.prototype.slice.call(arguments, 1);
  function FNO() {}
  function Fn() {
    const bindParams = Array.prototype.slice.call(arguments);
    // 如果当前this是函数的实例，则此函数作为构造函数使用，因此其上下文指向了实例，否则的话其上下文就是指定的context
    return self.call(this instanceof Fn ? this : context, params.concat(bindParams));
  }

  FNO.prototype = this.prototype;
  Fn.prototype = new FNO();

  return Fn;
}
```

### new的实现

```JavaScript
function objFactory(fn, ...args) {
  // 生成一个空对象
  const obj = new Object();
  // 将对象的原型链接到构造函数的原型上，这么做就能使对象访问到构造函数原型上的属性方法
  obj.__proto__ = fn.prototype;
  // 执行构造函数，利用call将上下文指向刚刚创建的对象，这样就能访问this上的属性方法
  const res = fn.call(obj, ...args);
  // 如果构造函数有返回值的话，需要判断返回值的类型是否是对象，如果是对象就返回这个对象
  // 如果是基础类型，则还是返回创建的对象
  return typeof res === 'object' ? res : obj;
}
```

### instanceof的实现

```JavaScript
// 1.拿到右边构造方法的原型
// 2. 不停去获取左边的实例的原型进行对比
// 3. 如果最后左边的原型为空返回false
// 4. 如果左边原型和右边的原型相等则返回true
function customInstanceOf(left, right) {
  const prototype = right.prototype;
  const proto = left.__proto__;
  while(true) {
    if (proto == null) return false;
    if (proto === prototype) return true;
    proto = proto.___proto__;
  }
}
```

### 函数柯里化的实现

```JavaScript
// 利用闭包保存参数，当参数和给定的函数参数数量相等，则执行该函数
// 否则返回一个包含该参数的包裹给定函数的函数
function curry(fn) {
  const judge = function(...args) {
    return args.length === fn.length
      ? fn(...args)
      : arg => judge(...args, arg);
  }
  return judge;
}
```

## 浮点数精度问题

## v8的垃圾回收机制

主要分为`新生代`和`老生代`空间。新生代存放那些经常变化的对象，老生代存放那些一直存在不变的对象。

新生代中的垃圾回收算法是`Scavenge`算法。新生代也分为两个空间，一个FORM，一个是TO，一般声明一个变量都会存放在FROM中，当进行垃圾回收的时候，FROM中还存在着使用的对象，则将其复制到TO空间中，然后清除FROM中所有的对象，最后将TO空间变成FROM，FROM空间再变成TO空间。

所以`Scavenge`算法就是复制两个空间，并进行互换，所以该算法会浪费一半的空间用于复制和交换。

当对象已经经过一次`Scavenge`算法，或者是TO空间使用占比超过了`25%`，那么就会进行`对象晋升`。所谓对象晋升就是将新生代中对象移动到老生代空间中。

由于老生代空间中的对象都是长期存活的对象，因此`Scavenge`算法不适用与老生代空间，老生代空间使用的算法就是`标记-清除`和`标记整理`算法。理解起来很简单，就是将老生代空间中的所有对象进行标记，一旦进行回收的时候，发现某个对象没有标记，那么就将其清除。因为不同的对象在内存中占据的空间是分散的，因此这样清理会出现`内存碎片`，而内存碎片会导致遇到一些大对象的时候，空间不足无法分配。因此这里又使用了标记整理算法，就是将之前标记的对象移到内存的另一端，然后清除剩下所有的空间，这样内存中的对象都集中在一端，就不会出现碎片的情况了。

老生代空间中存储着大量的存活对象，因此其数量十分庞大，当进行标记的时候，需要遍历空间中的所有对象，耗时特别长，导致浏览器无法响应js的任务。因此又引入了`增量标记`的概念，即将一次遍历的内存，改为多次分批标记，标记完一次之后停下来将执行权还给js线程，然后等待下一次执行标记会从上次标记的地方继续开始执行，这么做就不会导致浏览器执行长任务的时候卡顿无法响应js主线程。

## promise

```JavaScript
const PENDING = 'pending';
const FULLFILLED = 'fullFilled';
const REJECTED = 'rejected';
function MyPromise(fn) {
    this.status = PENDING;
    this.val = null;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (val) => {
        // 只有状态为PENDING时才能改变状态
        // 状态一旦改变就不能再去改变了
        if (this.status === PENDING) {
            this.val = val;
            this.status = FULLFILLED;
            // then添加回到以后执行回调，因此放入setTimeout中
            this.onResolvedCallbacks.forEach(fn => fn());
        }
    };

    const reject = reason => {
        if (this.status === PENDING) {
            this.val = reason;
            this.status = REJECTED;
            this.onRejectedCallbacks.forEach(fn => fn());
        }
    };

    // 如果传入的函数发生错误，则转入rejected状态
    try {
        fn.call(this, resolve, reject);
    } catch(e) {
        reject(e);
    }
}

MyPromise.prototype.then = function(onFullfied, onRejected) {
    // 当then方法不传回调方法的时候，保证值透传到下一个then中
    onFullfied = typeof onFullfied === 'function' ? onFullfied : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err;}

    let promise2;
    if (this.status === PENDING) {
        promise2 = new MyPromise((resolve, reject) => {
            this.onResolvedCallbacks.push(() => setTimeout(() => {
                try {
                    let x = onFullfied(this.val);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            }));
            this.onRejectedCallbacks.push(() => setTimeout(() => {
                try {
                    let x = onRejected(this.val);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            }));
        });
    }
    if (this.status === FULLFILLED) {
        promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFullfied(this.val);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (this.status === REJECTED) {
        promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(this.val);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    return promise2;
};

MyPromise.resolve = function(val) {
    return new MyPromise((resolve, reject) => resolve(val));
};

MyPromise.reject = function(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
};

MyPromise.all = function(promises) {
    let arr = [], i = 0;
    const processData = (index, data, resolve) => {
        arr[index] = data;
        i++;
        if (i === promises.length) resolve(arr);
    }
    return new MyPromise((resolve, reject) => {
        for(let i = 0; i < promises.length; i++) {
            promises[i].then(data => {
                processData(i, data, resolve);
            }, reject);
        }
    })
};

MyPromise.race = function(promises) {
    return new MyPromise((resolve, reject) => {
        for(let i = 0; i < promises.length; i++) {
            promises[i].then(resolve, reject);
        }
    })
};

MyPromise.prototype.catch = function(onRejected) {
    this.then(null, onRejected);
};

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        // 这里使用TypeError，是promiseA+规范规定，当promise2和x引用了同一个对象时，返回一// reject的TypeError的错误
        return reject(new TypeError('循环引用: Chaining cycle detected for promise'));
    }

    // 执行完then中的回调获取的返回值判断是否是对象或者是函数
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 保证resolve,reject只执行一次
        let called;
        try {
            // 判断x是否是一个thenable对象
            // 如果不是的话，直接当成值resolve
            let then = x.then;
            if (typeof then === 'function') {
                // 如果是一个thennable对象，则调用then方法，递归解析
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, err => {
                    if (called) return;
                    called = true;
                    reject(err);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}
```

这里可以使用一个库来测试写出来的promise代码是否正确

```js
MyPromise.deferred = MyPromise.defer = function(){
    let dfd = {}
    dfd.promise = new MyPromise((resolve,reject)=>{
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

var promisesAplusTests = require("promises-aplus-tests");

promisesAplusTests(MyPromise, function (err) {
    console.log(err, 'complete');
});
```

## 事件循环

### 浏览器环境

执行栈
事件队列(Task Queue)
微任务(Micro Task)
宏任务(Macro Task)

当前执行栈为空时，会先去处理所有的微任务队列中的事件，然后去宏任务队列中取出一个事件加入栈中执行。所以微任务永远在宏任务的前面执行。
### NodeJS环境

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

## CSS相关

包括盒模型、BFC、IFC

## 网络

cookie SameSite属性有三个值Strict，Lax，None
