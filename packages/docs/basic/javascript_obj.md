# javascript\_obj

## 创建对象

在 JavaScript 世界中，创建对象是非常简单的，但如何组织对象却是一个复杂的问题。首先要明确的就是在 JavaScript 中并没有和 Java 中的类那样的机制，即使后面 ES6 出现了 class 这样的类关键字，也不过是一种语法糖罢了。

首先使用创建对象的最普遍的方法就是字面量，虽然字面量创建对象非常的容易，并且好理解，但是如果需要创建大量的对象，那么字面量就显得有些力不从心了。所以就出现了一些改进的方法。

### 工厂模式

```javascript
function factory(name, age) {
  let obj = {};
  obj.name = name;
  obj.age = age;
  obj.say = function() {
    console.log(obj.name + ' ' + obj.age);
  };
  return obj;
}
```

工厂模式是编程中常见的一种模式，解决了批量产生对象的问题，并且代码可以复用，极大的提高了编码的效率。而不足的地方就在于无法识别对象的类型，所以就有下面的构造函数的方法。

### 构造函数模式

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.say = function() {
    console.log(this.name + this.age);
  };
}
```

所谓构造函数，只是模仿了传统面向类语言的说法，实际上在 JavaScript 中，并没有构造一说，构造函数也只是一个普通的函数，使用 new 也只是执行了函数，生成对象只是函数的一个副作用而已，这里先卖个关子，后面会解释这一点。

需要知道的是构造函数模式`解决`了上面工厂模式的对象类型问题，可以使用 `instanceof` 操作符类验证对象类型。

```javascript
const p1 = new Person('aaa', 18);
console.log(p1 instanceof Person); // true
```

这种方法存在的问题就在于对象属性如果是一个函数的话，那么每创建一个对象都需要引用一个函数方法，造成了空间的浪费，实际上这样的方法是可以对象间共享的。当然也可以将这个方法提取到函数外面，作为一个公共方法，此时就共享了同一个函数，但带来的问题就是随着方法增多，全局作用域中大量充斥着这种共享方法也非常不合适，于是 JavaScript 提供了原型来解决这个问题。

### 原型模式

```javascript
function Person() {}

Person.prototype.name = 'qiugu';

Person.prototype.age = 18;

Person.prototype.say = function() {
  console.log(this.name + this.age);
};
```

使用原型模式如上代码展示，其实就是给 _Person_ 函数的 _prototype_ 属性添加了一个方法，这样的话就解决了构造函数模式的创建的对象生成多个方法引用，造成的空间浪费。但同时这种原型模式也有缺陷：所有的对象都会共享同一个属性，如果这个属性是引用类型的话，则某一个对象操作这个属性，所有的对象都会受到影响。

注意需要分辨函数原型和对象原型。函数的原型则是 _prototype_ 属性，而对象的原型，有一个非标准的属性 `__proto__`，ES5之前可以通过这个属性访问对象的原型，而ES5之后提供一些API来获取对象上的原型，后面继承会详细说明。

由于上面两种创建对象的方法的不足，所以自然引出了下面混合这两种模式的组合方法。

### 组合构造函数模式和原型模式

```javascript
function Person(name, age, hobby) {
  this.name = name;
  this.age = age;
  this.hobby = ['coding', 'reading', 'writing'];
}
Person.prototype.say = function() {
  console.log(this.name + this.age);
};
```

这种模式是在 JavaScript 中创建对象比较普遍的一种方法，不过这种写法并不符合传统的封装的思想，因此可以考虑将原型中的方法封装到函数里面。

### 动态原型模式

```javascript
function Person(name, age, hobby) {
  this.name = name;
  this.age = age;
  this.hobby = ['coding', 'reading', 'writing'];

  if (typeof this.say !== 'function') {
    Person.prototype.say = function() {
      console.log(this.name + this.age);
    };
  }
}
```

动态原型模式就是直接在函数中进行原型属性的添加而已，不过依然需要注意不能改变原型的引用，否则新原型和旧原型之间的联系断开，造成一些`意料外的事`。

### 寄生构造函数模式

```javascript
function SpecialObj(name, age) {
  let obj = new Object();
  obj.name = name;
  obj.age = age;
  obj.say = function() {
    console.log(obj.name + ' ' + obj.age);
  };
  return obj;
}

let obj = new SpecialObj('qiugu', 18);
```

寄生构造函数模式和工厂模式代码是一模一样的，所以也有工厂模式的缺陷，无法使用 instanceof 操作符判断对象的类型，因为函数创建的对象和函数并没有什么联系。要说区别的话，则是寄生构造函数模式可以创建一个特殊的构造函数，利用他可以在不修改原来的构造函数的情况下，添加一些属性方法。上面的代码给 `Object` 添加一些对象和属性，也可以给`Array`、`String`这样的原生构造函数添加一些属性方法。

那么如果是给原生的构造函数添加属性方法，为什么不使用 `prototype` 来添加呢，这样不是更方便吗？其实还是原型模式带来的问题，原型上所有的属性方法都会共享，因此一旦在原型上添加了属性方法，所有对象会去共享这些方法，这并不是我们想要的结果，另外的原因则是在这些原生构造函数添加属性方法，以后随着 JavaScript 版本迭代万一出现代码中定义的属性方法，则会生成一些难以预料的错误。

### 稳妥构造函数模式

```javascript
function Person(name, age) {
  let obj = new Object();
    console.log(name + ' ' + age);
  };
  return obj;
}

let obj = new Person('qiugu', 18);
```

稳妥构造函数其实就是类似 Java 中的私有成员，如上代码所示，name 属性只能通过 say 方法来访问，这种私有成员的模式是为了防止篡改对象成员，你可以任意添加属性，但是无法修改函数中的原本的成员，这样保证其创建的对象是一个`稳妥对象`。

在ES6以后，可以利用 `proxy` 这个api来代理所有的对象，通过拦截某些属性来达到私有属性的一个实现：

```javascript
function Person(name,age) {
  let obj = {};
  obj._name = name;
  obj.age = age;
  return new Proxy(obj, {
    get (target, key) {
      console.log(key)
      if (key.startsWith('_')) {
        throw new Error('private key')
      }
      return Reflect.get(target, key)
    },
    ownKeys (target) {
      return Reflect.ownKeys(target).filter(key => !key.startsWith('_'))
    }
  });
}
let p1 = new Person('qiugu',19);

console.log(p1);
console.log(p1._name) // Uncaught Error: private key
```

这里就是通过 `proxy` 来代理返回的对象，这样所有该方法生成的对象的属性都会被拦截判断是否为私有属性，不是的话则返回对应的值。

以上这些就是在 JavaScript 中创建对象的一些方法，总结起来也只有两种，一种是构造函数模式，一种是工厂模式，其他几种都是他们的扩展模式。理解他们的创建对象的原理，才能在使用的时候，根据实际需要来选择相应的模式。

## 继承

说完了创建对象的问题，现在来学习上文中留下的一些问题，`prototype`到底是什么，`__proto__`又是什么，他们和继承又有什么关系。

先来说函数。创建函数的时候会默认获得一个 prototype 的属性，这个属性则是指向了函数的原型对象，**注意原型指向的是一个`对象`，并且只有函数才有 prototype 的属性。** 来看看这个原型对象有什么属性，如下

```javascript
function Person() {}
console.log(Person.prototype); // {constructor: Person, __proto__: Object}
```

![](https://imgkr.cn-bj.ufileos.com/522e6032-8ddb-420e-b790-f5136d65e118.png)

包含了`constructor`属性和`__proto__`属性，`constructor`属性指向了这个函数，这里需要特别小心的是这个`constructor`属性并不是永远可靠的，因为一旦改变了`__proto__`的指向，那么里面将不再包含这个`constructor`属性了，如果代码中有关于`constructor`属性的操作则可以出现难以发现错误。

```javascript
Person.prototype = {};
console.log(Person.prototype);
```

![](https://imgkr.cn-bj.ufileos.com/1e6dbb46-da4c-4c9e-bbd7-758a116ac11b.png)

`__proto__`属性则指向了`Object.prototype`。`__proto__`属性则是下面要说的对象的原型。

```javascript
let obj = {
  name: 'qiugu',
  age: 18
}
console.log(obj) // object
console.log(obj.toString()) // [object Object]
```

![](https://imgkr.cn-bj.ufileos.com/c4e961fb-166d-485e-9570-d33f74a4b938.png)

创建一个对象，打印出来可以看到对象中不仅有定义的 name 和 age 的属性，还有 `__proto__` 属性，这个属性就是和函数的`prototype`一样，指向了对象的原型，也符合在函数的`prototype`对象上看到的`__proto__`属性，所以每个创建的对象都有一个内置的`[[prototype]]`属性，`__proto__`就是上文说的一个非标准属性，在ES6就可以利用`getPrototypeOf`这个标准方法来获得对象上的原型。还有类似的方法`setPrototypeOf`、`isPrototypeOf`用来操作原型对象，下面也会用到。

可以看到之所以对象能去访问如 toString、valueOf这样的方法，其实就是调用原型对象上的 toString、valueOf方法，如果修改了这个引用，那么也就无法访问这些方法了。

```javascript
// 改变obj的原型
Object.setPrototypeOf(obj, Object.create(null));
console.log(obj.toString()); // TypeError: obj.toString is not a function
```

总结一下就是所有的对象`默认`都有一个`[[prototype]]`属性，指向了一个原型对象，并且该对象通过这个引用可以访问原型上的所有属性和方法，而不是复制了一份放到了自己身上。一旦手动改变了这个引用，那么就无法再使用 Object 上的一些方法了，这和其他的面向类的语言显然是一种完全不同的做法。

准确来说，在 JavaScript 中并没有构造函数、实例化、继承这样的概念，对象并不是构造函数所构造，所谓的使用`new`实例化，只是调用了方法产生的副作用，继承更只是对象`委托`了其原型上的属性方法，才能够使用这些方法，一旦失去和原型的联系，那么这些属性方法显然都是无法访问到了。本文还是使用了`继承`的说法，只是为了形象的表名对象间的关系，但是其继承的本质还是通过`委托`来实现的，理解`委托`的含义也是也是学习面向对象的一个重要的过程。

可见改变对象的原型是一种非常危险的操作，如上文所说的意料之外的事，所以看到上文所有添加原型属性方法，都是在原型上直接添加，而不是直接改变原型的引用，但有时候又不得不去改变原型，这里就可以参考下面的一些方法，保证原型的正确指向。

### 原型链继承

```javascript
function SuperType() {
  this.name = 'qiugu';
}
function SubType() {}
SubType.prototype = new SuperType();

let instance = new SubType();
console.log(sub.constructor === SuperType); // true
```

原型链继承就是让一个函数的原型指向另外一个函数的实例，这样做实际就是上面所说的改变了原来的函数的原型，让他指向了一个新的对象，此时的 sub 对象的`[[prototype]]`属性就指向了 SuperType 的实例对象，也就拥有了其上的 name 属性。同时因为改变了 SubType 的默认的原型，现在 SubType 生成的对象的`constructor`属性不再指向`SubType`，而是指向了`SuperType`，也就证明了上面所说的，在 JavaScript 中并没有构造一说，`constructor`也并不是构造函数，他只不过是原型上的一个可以被改变的属性而已。

虽然现在`constructor`的属性指向的不是原来的函数了，但是所需要的关键功能`继承`还是存在的，可以用 instanceof 的操作符来测试一下：

```javascript
console.log(instance instanceof SubType); // true
console.log(instance instanceof SuperType); // true
console.log(instance instanceof Object); // true
```

可以看到确实如我们所愿，instance现在确实是 SuperType 类型的，也是 Object 类型的，所有的对象都继承自 Object，这个也是没有问题的。但是原型链继承还是有上文原型模式同样的缺点，一旦在原型上定义了引用类型的属性，那么修改这个属性，会影响到所有继承自这个类的对象，另外则是如果不小心改变了原型的指向，那么上面所有的继承关系都会被断开。

```javascript
// ...
SubType.prototype = {
  sex: 'male',
  say: function() {
    console.log(this.sex);
  }
}
```

如代码展示，如果直接改变了原型的引用，原型再一次被重写，原来继承自 SuperType 的实例现在指向了一个新对象，继承关系自然也就不复存在了。

原型链继承还有一个问题则是在不影响其他对象的情况下，无法给父函数传递参数，这个也导致原型链继承使用的很少的原因，下面的继承方法正是为了解决这个不足的。

### 构造函数继承

```javascript
function SuperType() {
  this.name = 'qiugu';
}
function SubType() {
  SuperType.call(this);
}
```

构造函数继承就是利用了 call 方法来改变 this 指向，调用父级的构造函数生成子类的对象，如果需要添加参数的话，则可以在 call 里面继续添加参数，也就解决了无法在父类中传参的问题。同理，构造函数也有方法无法复用的缺点，因此一般不会单独使用，结合上面的原型链继承，就有了下面的组合继承的方法。

### 组合继承

```javascript
function SuperType() {
  this.name = 'qiugu';
}
function SubType() {
  SuperType.call(this);
}
SubType.prototype = new SuperType();
// 修正原型的constructor属性
SubType.prototype.constructor = SubType;
```

组合继承就是融合上面两种方法，也是 JavaScript 中常用的继承方法。注意这里修复了子类的`constructor`属性指向父类的构造函数的问题，让他重新指向了子类的构造方法，也就符合了一般面向类编程的一个习惯，并且防止出现需要`constructor`作为判断条件时的问题。

下面几种继承的方法，没有使用构造函数来实现继承，而是将继承的逻辑封装在一个普通方法中，在方法中传入对象，返回一个新对象来实现的继承。

### 原型式继承

```javascript
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
let person = object(new Person());
```

这种继承虽然很少见，但其实后来是被规范化了，出现了 Object.create 的API就是这个原理，当然 Object.create 不仅仅是为了继承，还有很多其他的功能。这里其实就是内部定义了一个构造函数，指定其原型指向，最后返回这个构造函数的实例，思路和上面几种是一样的，只是他将逻辑都封装到了方法里面了，使用的时候也就不需要 new 来调用方法了。

再下面的两种继承方法都是原型式继承的一种增强对象功能的方法。

### 寄生式继承

```javascript
function createAnother(origin) {
  const obj = object(origin);
  obj.say = function() {
    console.log('hello');
  };
  return obj;
}
```

寄生式继承的缺点很明显，就是给对象定义方法时，每个方法都是单独的引用，无法做到方法共用，因此效率会比较低。

### 寄生组合式继承

```javascript
function SuperType() {
  this.name = 'qiugu';
}
function SubType() {
  SuperType.call(this);
}
SubType.prototype = new SuperType();
// 修正原型的constructor属性
SubType.prototype.constructor = SubType;

function parasitic(subType, superType) {
  const proto = object(superType.prototype);
  proto.constructor = subType;
  subType.prototype = proto;
}
```

寄生组合式继承是对于上面常用的组合继承方法的增强，因为组合继承实际上会执行两次父类构造方法，一次是在子类中的调用，另外一次是在改变子类的原型指向的父类实例。两次调用肯定是没有必要的，寄生组合式继承利用原型式继承，将父类的原型传递给 object 方法，返回了一个原型指向父类原型的对象，而不是父类的实例，再将子类的原型指向刚刚返回的对象，这样就只需要实例化一次父类就可以将原型对象指向了父类的原型，同时子类构造函数中调用父类构造函数初始化，这样子类上面就有自己的属性方法，而不是存在于父类上，就解决了原型共享的问题。

