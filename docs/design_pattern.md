# 设计模式

## 设计原则

1. 单一职责原则（SPR原则）
2. 最小知识原则（LKP原则）
3. 开放-封闭原则（OCP原则）

## 单例模式

### 普通单例模式

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

### 闭包创建单例模式

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

## 策略模式

### 优缺点

1. 策略模式使用了组合、委托和多态的的技术思想，避免了多重条件选择。
2. 提供了对开放-封闭原则的完美支持。
3. 策略类可以复用。
4. 增加了许多策略类对象，必须要了解所有的策略类的行为，违反了最小知识原则。

## 观察者模式
## 迭代器模式
## 代理模式
## 命令模式
## 组合模式
## 模板方法模式
## 享元模式
## 职责链模式
## 中介者模式
## 装饰者模式
## 状态模式

### 优缺点

1. 状态模式定义了状态和行为之间的关系，封装到了一起。
2. 定义了许多状态类，新增了很多对象，逻辑分散的问题。

### 与策略模式的区别

策略模式各个策略类之间的关系是平行的，他们之间没有任何关系。而状态模式的各个状态类已经封装好了改变行为的方法，状态之间是可以相互切换的。

## 适配器模式
## MVC
## MVVM
## MVP
