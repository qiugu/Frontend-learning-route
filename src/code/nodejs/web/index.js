const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.substring(0, 7) === '/images' && req.url.substr(-4) === '.jpg') {
    fs.stat(__dirname + req.url, (err, stat) => {
      if (err || !stat.isFile()) {
        notFound(res);
        return;
      }
      console.log(__dirname + req.url);
      serve(res, __dirname + req.url, 'image/jpg');
    })
  } else if (req.method === 'GET' && req.url === '/') {
    serve(res, __dirname + '/index.html', 'text/html')
  } else {
    notFound(res);
  }
});

server.listen(3000, () => {
  console.log('app is listening at \033[92mlocalhost:3000\033[39m');
});

/**
 * 将静态文件输出到响应中
 * @param {object} res 请求的响应对象
 * @param {string} path 静态文件的路径
 * @param {string} type 请求的内容类型
 */
function serve(res, path, type) {
  res.writeHead(200, { 'content-type': type });
  fs.createReadStream(path).pipe(res);
}

/**
 * 请求的地址不存在时返回404
 * @param {object} res 请求的响应对象
 */
function notFound(res) {
  res.writeHead(404, { 'content-type': 'text/html' });
  res.end(`<h1>Not found</h1>`);
}
