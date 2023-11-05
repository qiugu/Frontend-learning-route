# interviews
## 继承几种方式

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

2. 原型式继承

```javascript
function SubType (o) {
  function F() {}
  F.prototype = o
  return new F()
}
```

3. 寄生式继承

```javascript
function SubType (o) {
  var clone = object(0)
  clone.sayHi = function () {
    console.log('Hi')
  }
  return clone
}
```

4. ES6中的 extends 继承

```javascript
class Sub extends Super {}
```

## 实现 ES6 的 extends 的关键字

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
## 判断数据类型

```js
function type (obj) {
  // 兼容ie6,ie6下面null和undefined执行Object.prototype.toString返回object
  if (obj == null) {
     return obj + '';
  }
  if (typeof obj === 'object' || typeof obj === 'function') {
    return Object.prototype.toString.call(obj)
      .split(' ')[1]
      .slice(0, -1)
      .toLowerCase();
  } else {
    return typeof obj;
  }
}
```

## 判断是否是纯对象

```js
function isPlainObject (obj) {
  var toString = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;
  var proto, Ctor;

  if (!obj || toString.call(obj) !== '[object Object]') return false;

  // 获取对象的原型
  proto = Object.getPrototypeOf(obj);
  if (!proto) return true; // 诸如Object.create(null)得到的就是一个没有原型的纯对象

  // 获取对象的构造函数
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === 'function' && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
}

// 而在redux中也定义了一个判断纯对象的方法
function isPlainObject (obj) {
  if (typeof obj !== 'object' || obj === null) return false;

  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

// 两者的区别就是在于使用 Object.create(null) 创建的对象是否是纯对象
```

## call/apply的实现

```javascript
// call的实现
Function.prototype.myCall = function(context) {
    // globalThis 兼容浏览器和NodeJS环境下的全局变量
    context = context || globalThis;
    // 尽量保证key是唯一的，防止和对象原有属性冲突
    var key = 'key' + Date.now();
    context[key] = this;
    var args = [];
    // call,apply 都是ES3的方法，实现时尽量使用ES3的API
    for (var i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context[key](' + args + ')');
    delete context[key];
    return result;
}

Function.prototype.myApply = function(context, args) {
    context = context || globalThis;
    var key = 'key' + Date.now();
    context[key] = this;
    var result;
    if (!args) {
        result = eval('context[key]()');
        // 第二个参数不是对象类型会报错
    } else if (typeof args !== 'object') {
        throw new Error('args is called on non-object')
    } else {
        var params = [];
        for (var i = 0; i < args.length; i++) {
            params.push('args[' + i + ']');
        }
        result = eval('context[key](' + params + ')');
    }

    delete context[key];
    return result;
}
```

## bind的实现

```javascript
Function.prototype.myBind = function(context, args) {
  const self = this;
  const params = Array.prototype.slice.call(arguments, 1);
  // 设置了一个空方法
  function FNO() {}
  function Fn() {
    const bindParams = Array.prototype.slice.call(arguments);
    // 如果当前this是函数的实例，则此函数作为构造函数使用，因此其上下文指向了实例，否则的话其上下文就是指定的context
    return self.call(this instanceof Fn ? this : context, params.concat(bindParams));
  }

  // 空方法的原型绑定到调用方法的原型上
  FNO.prototype = this.prototype;
  // bind返回函数的原型指向空方法的实例，主要是为了防止修改调用方法原型时会影响到返回函数的原型
  Fn.prototype = new FNO();

  return Fn;
}
```

> 博主在最新版的 Chrome 浏览中发现，无论是 bind 方法返回的函数（返回函数上不存在 prototype 属性了）、还是 bind 绑定的函数，二者的原型更改均不会互相影响，也就是说在 bind 实现中，通过将返回函数的原型指向了中间函数的实例这种做法已经不需要了，可以作为面试中的一个亮点提出

## new的实现

```javascript
function objFactory() {
  // 从参数中拿到构造函数，注意此时arguments只剩下剩余传入构造函数的参数了
  var constructor = [].shift.call(arguments);
  // 生成一个空对象
  var obj = new Object();
  // 将对象的原型链接到构造函数的原型上，这么做就能使对象访问到构造函数原型上的属性方法
  obj.__proto__ = constructor.prototype;
  // 执行构造函数，利用call将上下文指向刚刚创建的对象，这样就能访问this上的属性方法
  var result = constructor.apply(obj, arguments);
  // 如果构造函数有返回值的话，需要判断返回值的类型是否是对象，如果是对象就返回这个对象
  // 如果是基础类型，则还是返回创建的对象
  // 如果函数返回null，因为null的类型也是object，所以会返回null，实际为null的时候应该返回新对象
  return result !== null && typeof result === 'object' ? result : obj;
}
```

## instanceof的实现

```javascript
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
    proto = proto.__proto__;
  }
}
```

## 函数柯里化的实现

```javascript
// 利用闭包保存参数，当参数和给定的函数参数数量相等，则执行该函数
// 否则返回一个包含该参数的包裹给定函数的函数
function curry(fn) {
  const judge = function(...args) {
    return args.length === fn.length
      ? fn(...args)
      : (...arg) => judge(...args, ...arg);
  }
  return judge;
}
```

## promiseA+的实现

```javascript
const PENDING = 'pending';
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(excutor) {
    this.state = PENDING;
    this.value = null;
    this.onFullfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (val) => {
      if (this.state === PENDING) {
        this.state = FULLFILLED;
        this.value = val;
        this.onFullfilledCallbacks.forEach(cb => cb(val));
      }
    }

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.value = reason;
        this.onRejectedCallbacks.forEach(cb => cb(reason));
      }
    }

    try {
      excutor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then (onFullFilled, onRejected) {
    onFullFilled = typeof onFullFilled === 'function' ? onFullFilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    const promise2 = new MyPromise((resolve, reject) => {
      const fullfilledCb = () => {
        setTimeout(() => {
          try {
            const x = onFullFilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }

      const rejectedCb = () => {
        setTimeout(() => {
          try {
            const x = onRejected(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        })
      };

      if (this.state === PENDING) {
        this.onFullfilledCallbacks.push(fullfilledCb);
        this.onRejectedCallbacks.push(rejectedCb);
      }
      else if (this.state === FULLFILLED) {
        fullfilledCb();
      }
      else if (this.state === REJECTED) {
        rejectedCb();
      }
    });

    return promise2;
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise === x) {
    return reject(new TypeError('The promise and the return value are the same'));
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let called;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          err => {
            if (called) return;
            called = true;
            reject(err);
          }
        )
      } else {
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      called = true;
      reject(err);
    }
  } else {
    resolve(x);
  }
}

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
```

这里可以使用一个库来测试写出来的promise代码是否正确

```javascript
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

## 防抖和节流

```javascript
// 防抖
function debounce(fn, wait) {
  let timeout = null;
  return function() {
    let context = this, args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  }
}

// 立即执行防抖
function debounce(fn, wait, immediate) {
  let timeout = null;
  return function() {
    let context = this, args = arguments;

    if(timeout) clearTimeout(timeout);
    if(immediate) {
      timeout = setTimeout(() => {
        // 立即执行完成后，清空timeout
        timeout = null;
      });
      // 保证只调用一次
      if(!timeout) fn.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  }
}

// 节流
function throttle(fn, wait) {
  // 利用闭包保存上次时间和定时器的标示id
  let previous = 0, timeout = null;
  return function() {
    let context = this, args = arguments;
    let now = +new Date();
    const remaining = wait - (now - previous);
    // 当时间间隔大于wait或者修改了系统时间（这都能想到？？）
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      fn.apply(context, args);
      previous = now;
    } else {
      timeout = setTimeout(() => {
        previous = +new Date();
        timeout = null;
        fn.apply(context, args);
      }, wait);
    }
  }
}
```

## EventEmit的实现

```javascript
function EventEmit() {
  this.listeners = {};
}

EventEmit.prototype.on = function(eventName, cb) {
  // 因为事件是可以重复注册的，所以需要用一个数组来存储事件回调的队列
  if (!this.listeners[eventName]) {
    this.listeners[eventName] = [cb];
  } else {
    this.listeners[eventName].push(cb);
  }
}

EventEmit.prototype.once = function(eventName, onceCb) {
  const cb = (...args) => {
    onceCb.apply(this, args);
    this.off(eventName, onceCb);
  };
  this.on(eventName, cb);
}

EventEmit.prototype.off = function(eventName, cb) {
  if (this.listeners[eventName]) {
    const index = this.listeners[eventName].findIndex(event => event == cb);
    this.listeners[eventName].splice(index, 1);
    if (!this.listeners[eventName].length) delete this.listeners[eventName];
  }
}

EventEmit.prototype.emit = function(eventName, args) {
  if (this.listeners[eventName]) {
    this.listeners[eventName].forEach(fn => fn.apply(this, args));
  }
}

```

## 数组去重的方法

1. 双重for循环

```javascript
function unique(arr) {
  if (!Array.isArray(arr)) return;
  let res = arr[0];
  for(let i = 1; i < arr.length; i++) {
    let flag = true;
    for(let j = 0; j < res.length; j++) {
      flag = true;
      if (arr[i] === res[j]) break;
    }
    if (flag) res.push(arr[i]);
  }
  return res;
}
```

2. indexOf

```javascript
function unique(arr) {
  if (!Array.isArray(arr)) return;
  let res = [];
  for(let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) === -1) {
      res.push(arr[i]);
    }
  }
  return res;
}
```

3. filter

```javascript
function unique(arr) {
  if (!Array.isArray(arr)) return;
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
```

4. sort

```javascript
function unique(arr) {
  if (!Array.isArray(arr)) return;
  arr.sort();
  let res = [];
  for(let i = 0; i < arr.length; i++) {
    if (arr[i] !== arr[i-1]) res.push(arr[i]);
  }
  return res;
}
```

5. reduce

```javascript
function unique(arr) {
  if (!Array.isArray(arr)) return;
  return arr.reduce((prev, cur) => {
    return prev.includes(cur) : prev : [...prev, cur];
  }, []);
}
```

6. Set

```javascript
function unique(arr) {
  if (!Array.isArray(arr)) return;
  return [...new Set(arr)];
}

// 也可以使用Array.from来把Set转成数组
function unique(arr) {
  if (!Array.isArray(arr)) return;
  return Array.from(new Set(arr));
}

```

7. 使用对象或者Map去重

```javascript
function unique(arr) {
  if (!Array.isArray(arr)) return;
  let obj = {}, res = [];
  for(let i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      res.push(arr[i]);
      obj[arr[i]] = 1;
    } else {
      obj[arr[i]]++;
    }
  }
  return res;
}
```

[参考来源](https://juejin.cn/post/6844903602197102605)

## 深拷贝

```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  // 针对循环引用的情况，如果当前对象已经存在，直接返回已经存在的对象
  if (hash.get(obj)) return hash.get(obj);
  // 根据对象的constructor属性，重新创建一个新对象
  const cloneObj = new obj.constructor();
  hash.set(obj, cloneObj);
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```

## 数组乱序

```js
function shuffle(nums) {
  for (let i = nums.length; i > 0; i--) {
    let j = Math.random() * i | 0;
    [nums[i-1], nums[j]] = [nums[j], nums[i-1]];
  }
}
```

[参考链接](https://github.com/mqyqingfeng/Blog/issues/51)

## Promise 控制并发量

```js
function asyncPool(promises, limit = 5) {
  const ret = [];
  const excuteQueue = [];
  for (let i = 0; i < promises.length; i++) {
    ret.push(promises[i]);
    // promise 数量小于并发数，才进行并发控制
    if (promises.length < limit) {
        // 完成以后，从执行队列中删除该promise
       const p = promises[i].then(e => excuteQueue.splice(excuteQueue.indexOf(e), 1));
       excuteQueue.push(p);
       // 执行队列满足最大并发量，进行请求
       if (excuteQueue.length >= limit) {
         // 拿到最先完成的promise
         await Promise.race(excuteQueue);
       }
    }
  }
  // 等待结果完成以后，一起返回
  return Promise.all(ret);
}
```
