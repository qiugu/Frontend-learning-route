# 单例模式

## 普通单例模式

```javascript
class Singleton {
  constructor (name) {
    this.name = name;
  }

  // 实例对象
  static instance = null

  // 实例方法
  getName () {
    console.log(this.name);
  }

  // 返回实例
  static getInstance(name) {
    if (!this.instance) {
      this.instance = new Singleton(name);
    }
    return this.instance;
  }
}

const single1 = Singleton.getInstance('foo');

const single2 = Singleton.getInstance('foo');

console.log(single1 === single2); // true
```

这种单例模式是传统的面向对象，对于 JavaScript 来说，实用性不高

## 闭包创建单例模式

```javascript
var createInstance = (function(){
  var instance = null;
  return function(name) {
    if (instance) {
      return instance;
    }
    this.name = name;
    return this = instance;
  }
}());
```
