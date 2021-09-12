# readme

## webpack概述

本篇是基于 webpack5 的[文档](https://webpack.js.org/concepts/)来带大家重新认识一下 webpack，说到这里不得不提一下，小伙伴们在看文档的时候，能看英文文档还是尽量看英文文档，不会看的，学习英语也要看，不为其他，就是看英文文档的时候特帅，有没有？

开个玩笑，主要其实小伙伴们应该都了解，英文文档更新速度快，如果你使用的是最新的 webpack 的话，可能按照中文文档里面那样使用的话，会出现一些难搞的问题，我自己英文也很差，一边学习一边跟着翻译工具来看。

在我看来，webpack就是一个工厂，能将我们应用中的各种文件，js、css、img等等资源整合到一起，并且还能够帮助我们简化开发流程，提高应用的性能等多个好处，所以面对这样的好处，我们前端肯定也是不能放过的，所以我们必须要郑重的来对待他。

## 概念（concepts）

首先得知道以下的几个概念，如果还不清楚的话，可以打开上面的 webpack 文档来大概了解一下这些概念是什么意思，这样才能进行后面的学习。

* entry
* output
* loaders
* plugins
* mode

  **配置（configuration）**

  初步了解了以上的概念以后，相信大家能够信手拈来，但是还是希望大家跟着我一起完成下面的练习，首先我们来创建一个项目，项目目录结构如下：

```text
|-- webpack-learning
    |-- index.html
    |-- package.json
    |-- webpack.config.js
    |-- src
        |-- a.js
        |-- index.js
```

我们在webpack中写了一些 JS 文件和 webpack 基本的配置:

![](https://user-gold-cdn.xitu.io/2019/12/7/16ee0a18f5bf6de3?w=1356&h=850&f=png&s=142905)

![](https://user-gold-cdn.xitu.io/2019/12/7/16ee0a3fcf2853cc?w=532&h=444&f=png&s=33719)

好了，项目内容基本就是这样，接下来就来说说`webpack.config.js`中的配置选项。

### entry

`entry`是指定应用的入口文件，但是知道入口文件的值可以是什么类型的呢？打开我们的文档，发现其实 entry 的值可以是 string，string 数组，object，甚至可以是一个返回 object、string、string数组的函数，所以使用什么样的类型配置 entry 对象，大家心里就有个底了。

### output & output.library & output.libraryExport & output.libraryTarget

需要注意`output`，虽然和我们的 entry 是一对，但是 entry 可以配置各种类型，而我们的 output 只能配置一种类型，就是 object 类型，其他类型都会报如下的错误： ![](https://user-gold-cdn.xitu.io/2019/12/3/16ecbd0db9912b0c?w=1150&h=93&f=png&s=58448) 错误上也是告知我们 output 是一个 object 类型的。

`output.library`的选项就是指我们的入口文件对外暴露的一个值，需要搭配我们后面说的`output.libraryTarget`来使用，一般用在库或者是UI框架库中，当我们指定这个选项时:

```text
module.exports = {
    ...
    library: 'MyLibrary'
}
```

要知道我们打包出来的 bundle 文件是一个自执行的函数，会将我们模块中的代码放在这个自执行函数中，这里我们加了这个配置以后，我们打包文件后，来看看这个 bundle 文件，以下是截取的部分代码：

![](https://user-gold-cdn.xitu.io/2019/12/7/16ee08c54133bbb1?w=671&h=87&f=png&s=30522) 可以看到我们打包的文件的自执行函数被赋值给了我们刚刚在配置中写的变量，于是我们在打包的 dist 目录下的 html 文件中添加下面的代码：

```markup
<script>
  console.log(MyLibrary)
</script>
```

然后来看看控制台的输出内容：

![](https://user-gold-cdn.xitu.io/2019/12/7/16ee0a5976c16de0?w=737&h=209&f=png&s=11158) 可以看到控制台输出了一个空对象，这个是因为我们的 index 文件刚刚没有导出一个值，那么现在我们来修改一下index中的内容：

```javascript
const log = require('./a')
module.exports = log
```

然后在html文件中打印MyLibrary，就可以看到了：

![](https://user-gold-cdn.xitu.io/2019/12/9/16eeae3de0ec7686?w=427&h=205&f=png&s=9691)

再说说`output.libraryExport`，这个配置其实就是为我们入口文件导出的变量定义一个 key，即作为对象的属性来导出某个变量：

```javascript
module.exports = {
    ...
    library: 'MyLibrary',
    libraryExport: 'default'
}
```

这样的话，我们则需要在入口文件中这样导出变量：

```javascript
...
exports.default = log
```

这样我们引用入口文件时，则直接可以取到这个`log`的方法了，否则你如果用这个方法的话，则需要这样写：

```javascript
MyLibrary.default()
```

最后则是比较重要的一个配置`output.libraryTarget`，需要搭配`output.library`一起来使用，这个配置默认是`var`，表示入口文件导出的是一个变量，那么我们还可以配置`this`，`window`，`global`这样的配置，表示可以将入口文件导入的变量挂载到这些全局对象中，于是按照上面的写法，则可以这样使用导入的变量：

```javascript
this[MyLibrary] = log
window[MyLibrary] = log
global[MyLibrary] = log
```

还有一种配置情况，则是按照什么样的模块化方式来使用这个入口导出的变量，有这样几种配置：

* amd
* umd
* commonjs
* commonjs2

这些选项就是我们的JS模块化定义，需要注意的地方就是最后两者之间的区别，当选择`commonjs2`的时候，是使用的`module.exports`默认导出，那么`output.Library`选项则会被忽略，如果是`commonjs`选项的时候，则导出的模块是这样的：

```javascript
exports['MyLibrary'] = log
```

之所以提到这些导出模块，是因为我在配置webpack的externals选项来排除库的打包时，使用element-ui组件库的时候，一直无法排除这个库的打包，直到看到element的源码才发现，库导入的变量名叫做`ELEMENT`，不知道有没有小伙伴遇到过和我一样的问题呢。

### module.rules

1. loaders 的配置平时大家应该用的都是在 module.rules 中配置的，但是需要知道其实loaders是有三种配置方法的，配置文件中写 loaders 只是其中一种，另外两种，一种就是导入某个文件的时候跟在后面指定需要的loaders解析文件：

   ```javascript
   import Styles from 'style-loader!css-loader?modules!./styles.css'
   ```

   还有一种则是在执行打包命令的时候来指定需要加载的 loaders：

   ```bash
   webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
   ```

   **optimization**

   从 webpack4.0 以后，出现了一个`optimization`的选项，默认会根据你选择的mode来进行相应的优化，这个选项则是用来覆盖默认的优化选项的。

### devtool

`devtool`的开发工具配置，这个选项就是我们说的开发调试的时候用的，之前我也一直没用弄清楚到底是什么用的，也是查找过资料才明白，其实就是当我们启用 webpack 的时候，所有的代码会被处理，压缩等等，这样如果有什么报错信息的话，我们则无法查找到具体的错误代码的位置，因此webpack给我们提供了这个选项，让我们来配置打包后的代码如何调试。有这么几个配置选项：

![](https://user-gold-cdn.xitu.io/2019/12/7/16ee054638d8d5cc?w=892&h=1127&f=png&s=80578) 这里就将webpack文档中的配置选项粘了过来，大家不用看这么多选项，其实总结起来就是这么几点：

* 生成.map映射文件，定位出错的行和列 （source-map）
* 不生成.map映射文件，定位出错的行和列（eval-source-map）
* 生成.map映射文件，定位出错的行（cheap-module-source-map）
* 不生成.map映射文件，定位出错的行（cheap-module-eval-source-map）

以上几种情况都会有打包构建速度，以及打包文件体积的影响，所以配置还需要我们自己来选择决定。

### stats & performance

`stats`和`performance`选项可能大家平时接触的不多，前者是在打包或者是 webpack 执行时，命令行界面弹出的信息，如果你不需要这些信息按照配置设置为`none`关闭所有的信息。后者则是当打包文件过大或者是其他影响性能的情况下，命令行界面提示的信息，如果不需要的话，则可以设置`hints: false`则可以关闭性能提醒的信息。

### watch & watchOptions

`watch`这个选项表示webpack会监听你要打包的文件，当发现文件改变的时候，webpack 会自动进行打包编译，需要注意这个选项是针对打包的时候，如果是使用`webpack-dev-server`的话是热更新机制。`watchOptions`则是对上面`watch`选项进行详细的配置，比如防抖、轮询的时间以及需要忽略监听的文件夹配置等等。

如果以上几点大家都清楚了解的话，那我认为你可能已经对 webpack 是比较熟悉了，提出这几点的原因是因为我在系统学习前，对这些是不了解的，所以拿出来和大家说一下。

## loaders

所谓loaders其实就是加载器，用来解析文件，webpack 只能解析 JS 文件，因此我们需要这些 loaders 来处理非 JS 文件，所以这里就和大家说说一些常用的 loaders 的使用。

### css-loader & style-loader

css-loader和style-loader。这两个是我们常用的处理样式的 loader，一般我们都会把他们放在一起来处理 css 文件，他们的区别就是前者是生成`link`标签插入文档头中，而后者则是生成`style`的标签插入文档中，因此我们根据 loader 的执行顺序，自下而上，自右至左，因此一般可以这样配置：

```text
{
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader']
}
```

这就表示了我们先使用 css-loader 来处理，然后使用 style-loader 再去处理的顺序。

### url-loader & file-loader

这两个loader用来处理图片文件路径，也是经常会用到的。前者表示会将一些图片资源转换成 base64 编码格式，这样在图片体积较小的情况下，不需要请求服务器来减少请求数量，同时`url-loader`可以配置一个 options 来控制需要转换成 base64 的资源的大小，如果大于这个大小的话，则使用`file-loader`来正常请求资源：

![](https://user-gold-cdn.xitu.io/2019/12/9/16eeb18fa2212929)

### cache-loader & thread-loader

这里列出的这两个 loader 涉及到了 webpack 打包优化的问题，看名称就可以知道，一个是缓存，一个是关于线程的，他们的作用也很明显，使用`cache-loader`来缓存转换后的内容，这样文件下次如果没有修改的话，还是继续使用缓存中的内容。而`thread-loader`则是开启多线程来执行打包构建，加快构建的速度。需要注意的是，这两个 loader 要用在比较耗时操作的loader中，例如`babel-loader`这样的 loader 中，能够明显优化 webpack 的构建速度，如果 loader 转换不是很耗时，则无需这两个 loader 了，毕竟 loader 多了，运行时间自然也会增加。

## 插件（plugins）

### html-webpack-plugin

多入口文件时，使用 webpack-dev-server 怎么去配置 html 文件？ 简单来说，就是当我们有多个入口文件的时候，使用 webpack-dev-server 的时候进行开发，怎么在对应的html文件中导入相对应的入口文件呢，来看下面的代码:

![](https://user-gold-cdn.xitu.io/2019/12/2/16ec6eaf14c2f05b?w=1122&h=1148&f=png&s=143538)

这样我们在打包的时候，其实会发现打包的`dist`目录下两个入口文件都被引入了

```text
// index.html
<script type="text/javascript" src="index.js"></script><script type="text/javascript" src="main.js"></script></body>
// main.html
<script type="text/javascript" src="index.js"></script><script type="text/javascript" src="main.js"></script></body>
```

这样显然不符合我们的需求，因此需要用到`html-webpack-plugin`中的`chunks`选项：

![](https://user-gold-cdn.xitu.io/2019/12/3/16ecbe7a302a179a?w=1356&h=1144&f=png&s=179212)

这样我们打包以后再来看看 html 文件：

```markup
// main.html
<script type="text/javascript" src="main.js"></script>
// index.html
<script type="text/javascript" src="index.js">
```

这样就实现了分别导入入口文件，如果希望某个 html 文件同时导入两个入口文件的话，那就可以在`chunks`数组中，添加入口文件的标示字符串，则会将入口文件都添加进 html 文件中。

### ignorePlugin

此插件为webpack自带的一个插件，主要作用于忽略某些第三方库的打包，比如我们可能经常会用到的一个时间插件 moment，这个包就是比较大的，因为它包含了很多语言包，而我们用的时候可能只需要其中一种或者几种语言，但是却全部引入了，这肯定不是我们想要的，于是我们就可以使用这个`ignorePlugin`来实现忽略 moment 中的语言包的打包：

![](https://user-gold-cdn.xitu.io/2019/12/10/16eefd3cd10dd549?w=936&h=702&f=png&s=85517)

这里我们截取了配置`ignorePlugin`的前后打包的体积对比：

![](https://user-gold-cdn.xitu.io/2019/12/10/16eefd52c40bd11c?w=500&h=98&f=png&s=24396) ![](https://user-gold-cdn.xitu.io/2019/12/10/16eefd4e67dd754c?w=497&h=99&f=png&s=28840)

可以看到体积足足小了将近500kb，这个对于我们的优化还是有一个非常明显的作用的。

### DllPlugin & DllReferencePlugin

这两个插件同样也是 webpack 自带的插件，从官方的文档中我们也可以找到这两个插件，他们的作用就是用来分离第三方库，`DLL`就是`Dynamic-link library`，即动态链接库的意思。

我们来使用一下这个插件，首先安装 vue 的依赖，然后修改一下我们的 index.js 的文件：

```javascript
import Vue from 'vue'

new Vue({
  render: h => h('h1', '动态链接库')
}).$mount('#root')
```

打包以后可以看到我们的打包文件体积：

![](https://user-gold-cdn.xitu.io/2019/12/10/16eefecb10dbbccd?w=511&h=120&f=png&s=32271)

然后在配置文件中添加我们的插件，这里就会用到我们上面说过的配置`library`，还不清楚的同学可以翻上去复习一下。

添加一个webpack的配置文件`webpack.library.js`：

![](https://user-gold-cdn.xitu.io/2019/12/10/16ef00fedb81061f?w=1106&h=924&f=png&s=123852)

这个配置文件专门用来给我们的vue来打包成链接库的，再在`package.json`中添加我们打包的命令：

```bash
"dist": "webpack --config webpack.library.js"
```

运行我们的dist命令，会发现`dist`目录下多了两个文件，一个是我们的vue打包后的`vue.js`，另外一个则是我们的模块目录`manifest.json`文件，这样的话我们的动态链接库就已经打包好了，接下来要做的就是如何在我们引入 vue 的时候，让 webpack 去动态链接库中找依赖，而不是去`node_modules`下面找。

好了，这就到了另外一个相对应的插件`DllReferencePlugin`的出场了，我们在原来的 webpack 配置文件中添加上这个插件，需要注意这里两个插件分别是在两个配置文件中的，不要弄错了。

```javascript
module.exports = {
    ...
    new webpack.DllReferencePlugin({
        // 指定我们的目录文件的路径
        manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    })
}
```

这样配置以后，当我们引入vue的时候，webpack 就会去这个 json 文件配置的路径中去找我们的动态链接库。这里我们还有最后一步，就是在我们打包的html文件中手动引入我们的动态链接库：

```markup
<script src="./vue.js"></script>
```

注意这个 script 标签需要放在我们引入的 js 文件的上面，然后其实我们打包的时候就能再次看到打包的文件已经排除了 vue 的打包，并且体积也减少了很多：

![](https://user-gold-cdn.xitu.io/2019/12/10/16ef017e33bd9e7e?w=448&h=100&f=png&s=28559) 总结一下，所谓动态链接库其实就是将我们的第三方库抽离出来单独打包，就类似于我们引用 cdn 来引用模块是一样的。

## webpack的优化

以上或多或少的说了 webpack 如何优化的问题，其实还有很多平时我们可能忽略的一些细节

这里可以参考大佬们的[文章](http://mp.weixin.qq.com/s?__biz=MzIyMDkwODczNw==&mid=2247485517&idx=1&sn=041b949dbe50716a4f700d50c57ee3cd&chksm=97c595e3a0b21cf5266ed49f3cc40f969b0507c715281ee9007dec8700f7ff9f4482f54b0aed&mpshare=1&scene=23&srcid=1209Z6bAKD6AGb8KWIOdC3GY&sharer_sharetime=1575900858577&sharer_shareid=df34129d0e6b4473b3af7ff2617a5e80#rd)，说的非常详细，所以就不再赘述。

## webpack 深入理解

### 手写一个简单的 webpack

我们先按照以下目录新建一个项目

```text
|-- webpack-implement
    |-- package-lock.json
    |-- package.json
    |-- bin
    |   |-- main.js
    |-- lib
        |-- Compiler.js
        |-- main.ejs
```

这里 bin 目录中的 main.js 就是我们的入口文件，如果写过自己的脚手架的同学，应该就比较清楚了。我们在 package.json 中配置我们的 bin 命令

```text
"bin": {
    "qpack": "./bin/main.js"
  }
```

这样就表示我们可以使用`qpack`来当做命令，启动我们的入口文件。我们在入口文件添加如下内容

![](https://user-gold-cdn.xitu.io/2019/12/16/16f0ea0911edcedf?w=1036&h=444&f=png&s=64390)

代码其实非常简单，就是获取我们的配置文件，然后加载一个 Compiler 的类，所有的处理方法都放在这个类中，在写这个类之前，我们先来看看 webpack 打包后的文件是什么样子的，我们按照之前学习的 webpack-learning 的项目执行打包以后，查看一下打包后的 bundle.js 中的内容：

```javascript
(function (modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  ({
    "./src/a.js":
      (function (module, exports) {
        eval("module.exports = function (str) {\r\n  console.log(str)\r\n}\n\n//# sourceURL=webpack:///./src/a.js?");
      }),
    "./src/index.js":
      (function (module, exports, __webpack_require__) {
        eval("const log = __webpack_require__(/*! ./a.js */ \"./src/a.js\")\r\n\r\nlog('aaaaaaaaaaaaaaaaa')\r\n\n\n//# sourceURL=webpack:///./src/index.js?");
      })
  });
```

这个是经过我们整理，去掉注释以及一些我们这次用不到的代码后的部分。可以看到这个是一个自执行函数，我们往里面传递的是一个对象，这个对象就是我们的依赖关系，key 是我们依赖的文件路径，value 也是自执行函数，里面使用 eval 包裹了我们的模块代码，我们就按照这个代码来实现我们自己的 webpack 打包。

先来写我们的 Compiler 实现类：

```javascript
module.exports = class Compiler {
  constructor (config) {
    // 初始化配置
    this.config = config
    // 入口文件名称
    this.entryId = null
    // 模块依赖对象
    this.modules = {}
    // 形成最后打包文件传入立即执行函数中的参数
    this.assets = {}
    // 获取配置文件中的entry
    this.entry = config.entry
    // 当前的工作目录
    this.root = process.cwd()
  }
}
```

我们还需要有一个 run 方法来给我们的 main.js 去运行:

```javascript
module.exports = class Compiler {
    // 略
  run () {
    // 构建模块的依赖关系并生成代码
    this.buildModule(path.resolve(this.root, this.entry), true)
    // 将构建好的代码生成放入指定的输入目录中
    this.emitFile()
  }
}
```

其实关键点就在于如何构建我们的模块依赖关系的，从我们的入口文件开始去递归遍历每一个模块：

```javascript
/* 
** @param modulePath {string} 传入的模块路径名称
** @param isEntry {boolean} 当前路径是否是入口文件
*/
buildModule (modulePath, isEntry) {
  // 获取模块的内容，也就是代码
  const source = this.getSource(modulePath)
  // 根据上面我们分析的源码，需要获取模块的相对路径
  const moduleName = `./ ${path.relative(this.root, modulePath)}`
  if (isEntry) {
    this.entryId = moduleName
  }
  // 需要利用模块的内容以及模块路径的进行ast解析生成我们想要的源码以及模块的依赖
  const {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName))
  this.modules[moduleName] = sourceCode
  // 如果模块中有依赖的话，则递归遍历模块
  dependencies.forEach(dep => {
    this.buildModule(path.join(this.root, dep), false)
  })
}
```

我们的 buildModule 的方法就是从入口文件处开始，递归遍历模块，来生成我们之前看到的源码，以及类似于`{'./src/a.js': (function(){})}`这样的对象，接下来再看看 parse 方法是如何生成的：

```javascript
// babylon 已经被 @babel/parser 取代，用来生成AST
const babelParser = require('@babel/parser')
// 遍历AST
const traverse = require('@babel/traverse').default
// 用来判断类型或生成指定节点类型
const t = require('@babel/types')
// 将AST生成代码
const generator = require('@babel/generator').default

parse (source, parentPath) {
  // 生成AST
  let ast = babelParser.parse(source)
  // 记录依赖数组
  let dependencies = []
  // 遍历AST
  traverse(ast, {
    CallExpression (p) {
      const node = p.node
      // 找到调用的方法名 require
      if (node.callee.name === 'require') {
        // 修改我们指定的变量名
        node.callee.name = '__webpack_require__'
        // 获取 require 方法的参数
        let moduleName = node.arguments[0].value
        // 利用路径拼成我们需要的形式，形如 ./src/index.js
        moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')
        moduleName = `./${path.join(parentPath, moduleName)}`
        // 将require的模块加入依赖数组中
        dependencies.push(moduleName)
        // 根据我们生成的新的moduleName，将AST中的argments修改为moduleName
        node.arguments = [t.stringLiteral(moduleName)]
      }
    }
  })
  // 生成源码
  const sourceCode = generator(ast).code
  return { sourceCode, dependencies }
}
```

parse 方法就返回了我们需要的修改后的代码，以及依赖数组。这里还用到了AST转换代码，其实我们的 babel 就是用了上面的步骤，来将高版本的语法转换成低版本的语法。最后我们利用解析的代码和依赖来生成我们想要的打包后的文件，这里为了简单，我们就不使用字符串来拼接我们的 bundle 文件，而是使用 ejs 来渲染，先来创建我们的 main.ejs 的文件：

![](https://user-gold-cdn.xitu.io/2019/12/16/16f0edafeca86a7f?w=1560&h=1144&f=png&s=185460)

```javascript
generateFile () {
  // 根据配置文件获取我们的打包文件的路径
  const main = path.join(this.config.output.path, this.config.output.filename)
  // 获取渲染的模板
  const templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
  // 渲染之后返回我们的 bundle 文件的源码
  const code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules })
  // 当打包多个文件时，把文件存入assets中
  this.assets[main] = code
  // 将源码写入文件中
  fs.writeFileSync(main, code)
}
```

到这里我们自己的 webpack 基本的打包功能已经完成了，我们删除之前的 dist 目录，然后执行我们编写的打包命令`qpack`，来看下打包后的文件结果：

![](https://user-gold-cdn.xitu.io/2019/12/16/16f0ee9c6bc8dbce?w=1560&h=1254&f=png&s=219197)

可以看到，生成的文件和我们之前看到的是基本一样的，我们在 dist 目录下新建一个 index.html 来测试一下这个打包的文件是否有效。这里就不展示结果了，大家可以按照以上步骤自己来试试。

### loader 的实现

说完了打包的功能，就到了最重要的 loader 的实现了，先来看看如何在我们自己的 webpack 中来添加 loader。首先我们在刚刚的 Compiler 类中的 getSource 方法中来获取模块的内容，那么我们的 loader 肯定也是在这个方法中来添加，根据正则来判断文件类型，如果符合的话则调用相应的 loader 方法：

```javascript
getSource (path) {
  // 读取文件内容
  let content = fs.readFileSync(path, 'utf8')
  // 获取rules中的配置项，遍历配置项中的loader
  const rules = this.config.module.rules
  rules.forEach(rule => {
    const { test, use } = rule
    // loader执行顺序是自下而上，因此我们拿到最后一个loader
    let len = use.length - 1
    if (test.test(path)) {
      const normalLoader = () => {
        // 导入最后一个loader，如果后面还有loader的话，长度自减，递归遍历规则
        const loader = require(use[len--])
        content = loader(content)
        if (len >= 0) {
          normalLoader()
        }
      }
      normalLoader()
    }
  })
  return content
}
```

添加 loader 的方法我们写好了，接下来就是写我们自己的 loader 方法实现。其实 loader 就是一个方法，传入的参数就是我们导入的文件内容，然后将文件内容转换一下再返回，按照这个思路，我们首先在我们的 webpack-learning 中新建一个文件夹 loaders，在文件夹下创建两个我们的 loader 方法，`style-loader`，`less-loader`。然后在 webpack 配置中添加这两个 loader:

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname,'loaders','style-loader.js'),
          path.resolve(__dirname,'loaders','less-loader.js')
        ]
      }
    ]
  },
}
```

指定好我们的loader后，先按顺序从 less-loader 开始实现：

```javascript
const less = require('less')

module.exports = function loader (code) {
  let css
  // 利用less提供的render方法来将less文件转换成css文件
  less.render(code, function(err, code) {
    css = code.css
  })
  // 转换后的内容\n会被转译，因此需要替换成\\n
  css = css.replace(/\n/g,'\\n')
  return css
}
```

这样返回一个 css 的内容，会作为 style-loader 的参数来执行 style-loader 的处理方法：

```javascript
module.exports = function loader (code) {
  const styleStr = `
    const style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(code)}
    document.head.appendChild(style)
  `
  return styleStr
}
```

style-loader 是不是非常简单，其实就是添加一个 style 标签而已，我们在 src 目录下建一个 test.less文件：

```css
body {background: red;}
```

然后执行我们的命令，打开 bundle.js 文件可以看到：

![](https://user-gold-cdn.xitu.io/2019/12/17/16f13da291dc41ac?w=734&h=312&f=png&s=69195)

里面多了一个 test.less 的依赖，内容就是我们刚刚利用 loader 进行转换后的内容，这样我们的 bundle 文件执行就会在 html 中添加一个 stlye 标签，从而让样式生效了。

### 理解 plugins 的实现

在理解 plugin 的实现之前，我们先需要了解一个库 tapable，这个是 webpack 中各种钩子实现的基类，tapable 中包含了很多种类型的钩子，有同步钩子，异步钩子，异步串行钩子等等。这里不会着重去讲这个库，需要大家自行去学习了解，我们重点需要了解 plugin 是如何实现的，所以我们先把 tapable 这个库看做是一个实现发布订阅模式的依赖，我们需要在 webpack 打包期间，将这些钩子插入其中，作为 webpack 打包的生命周期钩子。

这里就简单使用同步钩子 SyncHook，首先来修改一下我们的 Compiler 的构造方法：

```javascript
const {
  SyncHook
} = require('tapable')

class Compiler {
    constructor (config) {
    // 省略...
    // 这个是我们定义的一些生命周期钩子
    this.hooks = {
      entryOptions: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }

    const plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        // 插件中都需要提供一个apply方法，我们会将Compiler作为参数传递进去
        plugin.apply(this)
      })
    }
    // 插件执行完毕后，调用我们上面定义的生命周期方法
    this.hooks.afterPlugins.call()
  }
}
```

同时我们也将这些定义的钩子放到我们 Compiler 执行的过程中：

```javascript
run () {
    this.hooks.run.call()
    this.hooks.compile.call()
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompile.call()
    this.emitFile()
    this.hooks.emit.call()
    this.hooks.done.call()
}
```

这样我们在打包的过程中，就会一一调用我们的钩子，现在再来写一个简单的插件，创建一个 plugins 文件夹，再新建一个 DonePlugin 的 JS 文件，看到 webpack 中插件都是需要 new 实例化，并且会有一个 apply 方法，那么我们的插件大概就是这样：

```javascript
module.exports = class DonePlugin {
  apply (compiler) {
    // 当文件生成以后处罚钩子，执行回调
    compiler.hooks.emit.tap('DonePlugin', () => {
      console.log('编译完成~~~~~')
    })
  }
}
```

于是当我们执行 qpack 命令的时候，可以看到控制台输出

![](https://user-gold-cdn.xitu.io/2019/12/17/16f1412ecab82f24?w=381&h=56&f=png&s=14615)

ok，我们的插件就调用成功啦！当然这里只是简单的调用一个同步的钩子 SyncHook，实际 webpack 中包含了很多复杂的钩子，有兴趣可以去研究下其中的源码，可以学习到更多的东西。

## 结尾

写到这里 webpack 的学习算是告一段落了，也是写了将近两周的时间，后续如果有同学需要这些源码的话可以联系我，我会整理一下放在我的[github](https://github.com/qiugu)上。本篇也是打开大家学习 webpack 的视野，更多用法可以参考下面的链接以及社区大佬们的分享啦！

## 参考链接

* [10天搞定webpack4](https://www.bilibili.com/medialist/play/ml414793726)
* [webpack官方文档](https://webpack.js.org/guides/)

