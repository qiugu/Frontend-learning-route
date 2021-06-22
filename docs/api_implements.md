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

## call/apply的实现

```javascript
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

## bind的实现

```javascript
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

## new的实现

```javascript
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
    proto = proto.___proto__;
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
      : arg => judge(...args, arg);
  }
  return judge;
}
```

## promiseA+的实现

```javascript
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
    if (res.indexOf(arr[i]) !== -1) {
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
