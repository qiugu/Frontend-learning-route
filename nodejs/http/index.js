const http = require('http');
const fs = require('fs');
const qs = require('querystring');

/**
 * 连接http
 */
/*
http.createServer((req, res) => {
  console.log(req.headers);
  res.writeHead(200, { 'content-type': 'image/png' });
  // 通过管道将读取的数据流转入响应中
  fs.createReadStream('../../front.png').pipe(res);
}).listen(3000);
*/

/**
 * 表单提交
 */
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  if (req.url === '/') {
    res.end(`
    <form method="POST" action="/url">
      <h1>MY FORM</h1>
      <fieldset>
      <label>Personal Information</label>
      <p>What is your name</p>
      <input type="text" name="name"/>
      <p><button>Submit</button></p>
    </form>
  `);
  } else if (req.url === '/url' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      res.writeHead(200, { 'content-type': 'text/html' });
      // res.end(`
      //   <p>Content-Type: ${req.headers['content-type']}</p>
      //   <p>Data:</p>
      //   <pre>${body}</pre>
      // `);
      res.end(`
        <p>Your name is <b>${qs.parse(body).name}</b></p>
      `);
    });
  } else {
    res.writeHead(404);
    res.end('<h1>NOT FOUND</h1>');
  }
});

server.listen(3000, () => {
  console.log('app is listening localhost:3000');
});
