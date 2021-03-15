# canvas

**注意：给canvas设置宽高时使用自身的width和height属性，而不是style对象中的属性来设置大小，否则会有画布被压缩的现象**

## getContext\('2d'\)

获取canvas元素的上下文，所有canvas的操作都是基于上下文的API来完成的

```javascript
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
```

## 绘制形状

### 绘制矩形

1. fillRect\(x, y, width, height\)
2. strokeRect\(x, y, width, height\)
3. clearRect\(x, y, width, height\)

### 绘制路径

* beginPath\(\) 新建一条路径
* closePath\(\) 闭合路径
* stroke\(\)  绘制轮廓
* fill\(\) 填充内容区域
* moveTo\(x, y\) 将笔触移动到指定的坐标上
* lineTo\(x, y\) 绘制从当前位置（就是笔触所在位置，如果没有设置笔触，则在0,0位置）到指定坐标的直接

> closePath\(\)不是必须的，当使用fill\(\)时，所有没有闭合的形状都会自动闭合，但是调用stroke\(\)时则不会自动闭合

### 绘制圆弧

* arc\(x, y, radius, startAngle, endAngle, anticlockwise\)
* arcTo\(x1, y1, x2, y2, radius\)

