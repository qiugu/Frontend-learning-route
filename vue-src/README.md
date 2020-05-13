# vue-src-learning
## 记录学习Vue源码的过程，加上自己的一些理解，简化Vue源码中的代码，用最简单易懂的方式学习Vue的源码

### 源码学习步骤
#### 在vue源码中调试
* `test`目录下建立`index.html`文件
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="../dist/vue.js"></script>
</head>
<body>
  <div id="app">
    <h1>测试vue</h1>
    <p>{{foo}}</p>
  </div>
  <script>
    const app = new Vue({
      el: '#app',
      data: {
        foo: 'bar'
      }
    })
    console.log(app)
  </script>
</body>
</html>
```
* 修改`package.json`中的`scripts`脚本，添加如下一行命令
```
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
```
* 执行命令
```sh
npm run dev
```

#### 本项目中调试
* 下载本项目后，打开项目，执行命令
```sh
npm run dev
```
* 结合本项目的md文件夹中的内容，对比vue源码的执行过程，学习vue的实现

#### 参考文章链接
[vue-diff算法分析](http://hcysun.me/vue-design/zh/)
