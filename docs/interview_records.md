# 面试问题记录

## 网络

### 简单请求和非简单请求

简单请求就是使用设定的请求方式请求数据，比如GET、POST、HEAD，这些可以直接用 form表单发送请求。

而非简单请求则是在使用设定的请求方式请求数据之前,先发送一个OPTIONS请求,看服务端是否允许客户端发送非简单请求.只有"预检"通过后才会再发送一次请求用于数据传输。非简单请求如PUT。

除了以上这些区别外，还可以通过请求头来区分简单请求和非简单请求

请求头信息不超过以下几个字段：Accept、Accept-Language、Content-Language、Last-Event-ID，Content-Type 对应的值是以下三个中的任意一个 application/x-www-form-urlencoded、multipart/form-data、text/plain。只有满足这些**请求头**以及请求**方法**，GET、POST、HEAD的请求才是简单请求，除此之外都是非简单请求。

### 设置什么响应头可以触发浏览器下载文件

通过设置 Content-Type 和 Content-Disposition 字段即可触发浏览器下载资源

```javascript
// nodejs中
fs.readFile('./req_get_download.js', function (err, data) {
    const header = {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment;filename=req_get_download.js'
    };
    res.writeHead(200, header);
    res.end(data);
});
```

### 请求头字段Refer的意思

Refer就是告诉服务器该网页是从哪个页面链接过来的，服务器因此可以获得一些信息用于处理

作用：
1. 防盗链
2. 防止恶意请求
3. 空Refer，当一个请求并不是由链接触发产生的，那么自然也就不需要指定这个请求的链接来源
