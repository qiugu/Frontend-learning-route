# WebGL基础

## 前言
这是WebGL学习系列的第一篇，主要说了一些基本的WebGL的绘图流程，以及如何绘制一些基本的图元。关于WebGL的一些概念或者是更深入的了解可以看[这里](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)。

看完本篇后相信都能轻松使用WebGL绘制一些简单的图形，其实这些图形可能**CSS**和**canvas2D**都能绘制出来，但是因为WebGL使用的是**GPU**，因此性能更好，速度也更快。另外如果包含一些3D的图形，那么使用WebGL就更加方便了。

好了，下面进入主题，WebGL本身就是提供了一系列的API供我们去调用，并且其调用方式不太符合我们平时写JavaScript那样清晰明了，所以这里将WebGL的绘图流程用下面这张图表示出来，并且也划分了几个步骤，让大家能有一个初步的概念。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff2172b2ad85462b87f8c7c9771f880f~tplv-k3u1fbpfcp-watermark.image)

## 1. 获取WebGL上下文

首先就是获取WebGL上下文，其实就是创建`WebGLRenderingContext`对象，和canvas2D类似，直接通过`getContext`来获取WebGL上下文

```Javascript
const gl = canvas.getContext('webgl', options);
```

这里的options就是`WebGLContextAttributes`类型，包含下面几个属性

1. depth 创建深度缓冲区，默认值为true
2. stencil 创建模板缓冲区，默认值为false
3. alpha 设置颜色缓冲区的格式，true表示格式为rgba，false则为rgb，默认值为false
4. premultipiedAlpha 不使用预乘alpha，默认为true，暂时不会用到这个值
5. antialias 设置抗锯齿，硬件支持的话就会使用抗锯齿功能，默认为true
6. preserveDrawingBuffer 保留上一帧的渲染，默认值为false，即不保留

这里的选项一般不会用到，后面会在某些特殊场景下用到它来解决一些问题。获取到WebGL的上下文，后面我们的操作都是基于这个上下文进行的。

## 2. 初始化着色器

根据上面的流程图，可以看出来，我们获取完上下文以后，需要一个叫做着色器的东东，那什么是着色器呢？着色器简单来说就是给GPU执行的程序，使用GLSL语言编写，这种语言是一种类C的的强类型语言。

着色器包含两类

1. 顶点着色器
2. 片元着色器

顶点着色器控制点的位置和大小，片元着色器控制点的颜色。我们可以通过WebGL的API来向着色器中传递四种类型的数据：

1. `attribute` 一般用来存储顶点坐标数据
2. `uniform` 全局变量
3. `texture` 存储图像数据
4. `varying` 从顶点着色器给片元着色器传值的方式

在GLSL中还包括一些常用的内置的变量，目前用到的有下面几种：

1. `gl_Position` 顶点着色器中使用，表示图形的坐标
2. `gl_PointSize` 顶点着色器中使用，表示图形的大小
3. `gl_FragColor` 片元着色器中使用，表示要渲染的颜色

来看一个简单的着色器GLSL的代码就能明白了：

```c
// 顶点着色器
attribute vec4 a_Position;

void main() {
    gl_Position = a_Position;
}

// 片元着色器
// 这里必须要定义数据精度
precision mediump float;
uniform vec4 u_Color;

void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
```

这里的的着色器对象源码，其实就是一段JavaScript的字符串，字符串可以使用“+”连接起来，像这样：

```JavaScript
const fs = '\n'+
'void main() {\n' +
'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n' +
'}\n'
```

这么做主要是为了调试的时候，可以发现错误的行号，不过也可以使用ES6的写法，利用反引号更加方便：

```JavaScript
const fs = `
void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`
```

甚至你觉得这种字符串形式比较麻烦，可以定义加一段script脚本中

```html
<script id="fragment" type="notjs">
	void main() {
    	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
</script>
```
这里浏览器无法识别“notjs”，因此脚本之间的代码被当做普通的字符串文本识别，利用选择器选择标签获取内容就可以了。

当然光有着色器还不能进行绘图，因为GPU并不认识着色器，所以我们需要将着色器组织起来，形成一个着色程序来交给GPU执行，这里就涉及到了两个类`WebGLShader`类和`WebGLProgram`类。

WebGLShader就是我们说的着色器，来看看如何创建WebGLShader：

### 创建shader对象

创建着色器对象利用`createShader`来创建，注意创建的对象就是一个空引用，里面什么都没有，也无法执行，还需要进行后面的几步以后才能使用。

```JavaScript
const shader = gl.createShader(type);
/**
 *  type的类型可以下面两种
 *  1. gl.VERTEX_SHADER 顶点着色器类型
 *  2. gl.FRAGMENT_SHADER 片元着色器类型
 */
```

这里type就是上面说到的两类着色器，顶点和片元着色器。它们包含在WebGLRenderingContext的属性中，实际打印出来会发现就是number类型。后面所有的WebGL程序都会用到这两个着色器对象，缺一不可。

创建好着色器对象以后，就需要将之前写好的GLSL的源码放入着色器中：

### 载入shader的源码

载入源码，执行`shaderSource`方法就可以了：

```JavaScript
// 第一个参数就是刚刚创建的着色器程序，第二个参数就是GLSL的字符串片段
gl.shaderSource(shader, source);
```

### 编译源码

载入了源码以后，就需要进行编译了。熟悉C语言应该都比较了解，运行代码时需要先进行编译操作，使用`compileShader`方法传入之前创建的shader对象进行编译。

```JavaScript
gl.compileShader(shader);
```

编译完成以后，去判断是否编译成功了：

```JavaScript
// 返回一个布尔值，成功的话为true，否则为false
const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
if(isSuccess) {
	// 获取失败的信息
	console.error(`shader compile failed: ${gl.getShaderInfoLog(shader)}`);
    // 删除shader对象
    gl.deleteShader(shader);
}
```

### 将编译好的shader放入程序中

其实就是将编译好的顶点着色器和片元着色器组装起来，放入一个程序中，称之为**着色程序**。上面提及到的`WebGLProgram`对象就是我们的着色程序。

来看看如何使用这个着色程序：

```JavaScript
// 1. 创建一个着色器程序
const program = gl.createProgram();

// 2. 将之前编译好的shader对象和程序绑定起来
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

// 3. 将程序链接到GL上下文中
gl.linkProgram(program);

// 4. 使用着色程序
gl.useProgran(program);
```

这样就将上面的shader对象和着色程序链接在一起了，就可以进行下一步的操作了。这里也可以去验证一下着色程序是否链接成功：

```JavaScript
if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	// 获取失败信息
    console.error(`program created failed: ${gl.getProgramInfoLog(program)}`);
    // 删除创建的program
    gl.deleteProgram(program);
}
```

我们通过四个API，`createProgram`,`attachShader`,`linkProgram`,`useProgram`来设置好了着色程序，至此，第一阶段的工作已经完成了，接下来就是向这个程序中写入数据。

## 将数据放入缓冲区

写入的数据类型一般就是上文中提到的四种类型。不过现在我们的GLSL代码中，就只设置了`attribute`和`uniform`类型，因此只需要向程序中传入这两个变量就可以了。我们按照下面几个步骤来写入数据：

### 创建缓冲区

```JavaScript
// 创建缓冲区
const buffer = gl.createBuffer();
// 绑定缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
```

### 创建数据，将数据写入缓冲区

这里的数据就是创建类型化数组，里面存储着色器需要的坐标数据或者是颜色数据信息。而之所以使用类型化数组，则是为了提高使用效率，因为在JS中的数组可以存储不同类型的值，内部为此做了很多取舍，所以效率实际上是比较低的，因此这里使用类型化数组作为数据载体。

```JavaScript
const data = new Float32Array([0.5, 0.5]);

gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
```

传递给类型化数组的参数就是普通的数组，里面的值就是要画的图形的一个坐标。这里简单介绍下WebGL的坐标系。

WebGL的坐标和canvas2D的坐标系都是直角坐标系，区别就在于原点不同，canvas2D的坐标系是以画布的左上角为坐标原点，而WebGL则是画布中心为坐标原点，并且坐标取值范围是在`[-1, 1]`之间，所以上述代码中的`[0.5, 0.5]`就是指的右上角的区域一半的位置。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d47aecfdffca40188c15cef31a1ef021~tplv-k3u1fbpfcp-watermark.image)

后面也会涉及到很多坐标转换的计算，这里先不去深入，只要知道WebGL的坐标原点位置即可。

### 从缓冲区中取出数据赋给着色器中的变量

```JavaScript
// 获取着色器中的变量的引用
const a_Position = gl.getAttribLocation(program, 'a_Position');
// 将缓冲区中的数据赋给着色器变量
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
// 启用此变量
gl.enableVertexAttribAarry(a_Position);
```

这里是将多个顶点数据一起赋值给着色器中的变量，如果只有一个顶点数据，也可以使用如下方法：

```JavaScript
// 这里是一系列的类似方法
// gl.vertexAttrib[1234]f，数字表示分量的个数
gl.vertexAttrib4f(a_Position, 1.0, 1.0, 0.0, 1.0);
```

这里关于类型化数组传入的数据只是做了一个最简单的介绍，还有很多其他复杂的方法，后续会一一说到。至此，第二阶段的工作也已经完成了，接下来就是进行绘制了。

## 绘制

首先需要清除canvas画布的缓冲区，WebGL的缓冲区，包括三种缓冲区：

1. 颜色缓冲区
2. 深度缓冲区
3. 模板缓冲区

```JavaScript
gl.clear(buffer);

/*
 * buffer参数可以选择下面三种之一
 * gl.COLOR_BUFFER_BIT 颜色缓冲区
 * gl.DEPTH_BUFFER_BIT 深度缓冲区
 * gl.STENCIL_BUFFER_BIT 模板缓冲区
 */
```

清空缓冲区以后就可以进行绘制了

```JavaScript
/**
 * 第一个参数 表示绘制的图元，WebGL的图元总共就三大类，点、线、三角形
 * 第二个参数 表示从第几个顶点开始绘制
 * 第三个参数 表示绘制多少个顶点数据 
 */
gl.drawArrays(gl.POINTS, 0, 1);
```

上面图元有以下几类，总结起来就是点、线、三角形这三类，不过细分的话，总共有下面几个值可以使用：

1. gl.POINTS
2. gl.LINES
3. gl.LINE_STRIP
4. gl.LINE_LOOP
5. gl.TRIANGLES
6. gl.TRIANGLE_STRIP
7. gl.TRIANGLE_FAN

我们传入四个点[(-0.5, 0.5), (-0.5, -0.5), (0.5, -0.5), (0.5, 0.5)]来理解上面这些图元的意思。利用上面所学的类型化数组传入坐标信息

```JavaScript
// 生成坐标数据
const coords = new Float32Array([
    -0.5, 0.5, 
    -0.5, -0.5, 
    0.5, -0.5, 
    0.5, 0.5
]);

// 创建缓冲区并绑定坐标数据
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);

// 将缓冲区数据读取到program中
const a_Position = gl.getAttribLocation(program, 'a_Position');
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * 2, 0);
gl.enableVertexAttribArray(a_Position);
```

然后分别按照上面的图元进行绘制

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9f0882cfdbe4b8c96c2da983a74771c~tplv-k3u1fbpfcp-watermark.image)

可以看到点、线、三角形都是比较好理解，需要注意这里提供了四个点，但是`gl.TRIAGNLES`只绘制了三个顶点，因为剩下的一个点已经无法组成三角形了，所以就被忽略了，同理`gl.LIINES`也是一样，如果提供了三个点，那么剩下的那个点也会被忽略掉。

再看带[strip]的图元，会共用顶点，[fan]也同样会共用顶点，只是共用的顶点位置不同，这里大家可以通过上面的示例自己敲一遍感受一下。

总结起来，一个WebGL程序分为三步，**第一就是创建WebGL程序，第二就是创建程序需要的数据并写入程序中，第三就是执行程序进行绘制。**


## 未完待续
好了，到此为止，你已经可以自己绘制出简单的WebGL图形了。看似我们绘制一个简单的图形，却需要这么多的代码，是不是觉得有点得不偿失呢？使用WebGL进行绘制的一个最大的好处就是，使用GPU进行计算位置和像素信息，而不是使用CPU计算。因为GPU本身就是用于图形计算的，所以其上包含了很多的计算单元，并且每次计算都是**并行**计算，相当于同时开了几个线程去计算，并且不会浪费资源的那种线程。这样想的话，就能理解WebGL用来绘制一些复杂图形的优势了，复杂图形往往包含成千上万个坐标信息和像素信息，使用GPU渲染能大大减少计算时间，提高渲染速度。

接下来，还会有更多有趣奇妙的东西...

<small>文中的示例代码地址[点这里](https://github.com/qiugu/webgl_learning/tree/master/examples)</small>
