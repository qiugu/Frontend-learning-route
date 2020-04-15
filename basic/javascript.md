

## 创建对象
在 JavaScript 世界中，创建对象是非常简单的，但如何组织对象却是一个复杂的问题。首先要明确的就是在 JavaScript 中并没有和 Java 中的类那样的机制，即使后面 ES6 出现了 class 这样的类关键字，也不过是一种语法糖罢了。

```javascript
let obj = {
  name: 'aaa',
  age: 18
}
console.log(obj) // object
console.log(obj.toString()) // [object Object]
```

可以看到当用字面量的形式创建一个对象的时候，对象中不仅有定义的 name 和 age 的属性，还有 __proto__ 属性，这个属性就是一个引用，指向了需要引用的原型对象。之所以对象能去访问如 toString、valueOf这样的方法，其实就是调用原型对象上的 toString、valueOf方法，如果修改了这个引用，那么也就无法访问这些方法了。

```javascript
// 改变引用
obj.__proto__ = Object.create(null);
console.log(obj.toString()); // TypeError: obj.toString is not a function
```

因此可以这么说：所有的对象`默认`都关联了这个 __proto__ 对象，即有一个引用指向了这个对象，而不是复制了一份放到了自己身上。一旦手动改变了这个引用，那么就无法再使用 Object 上的一些方法了，这和其他的面向类的语言显然是一种完全不同的做法。准确来说，在 JavaScript 中并没有实例化、继承这样的概念


### 工厂模式

```javascript
function factory(name, age, say) {
  let obj = {};
  obj.name = name;
  obj.age = age;
  obj.say = function() {
    console.log(obj.name + ' ' + obj.age);
  }
  return obj;
}
```

### 构造函数模式
### 原型模式
### 组合构造函数模式和原型模式
### 动态原型模式
### 寄生构造函数模式
### 稳妥构造函数模式

## 继承
### 原型链
### 构造函数继承
### 组合继承
### 原型式继承
### 寄生式继承
### 寄生组合式继承 
