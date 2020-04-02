const http = require('http');
const qs = require('querystring');

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', data => {
    body += data;
  });
  req.on('end', () => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('DONE');
    console.log('\n got name \033[90m' + qs.parse(body).name + ' \033[39m\n');
  });
});

server.listen(3000, () => {
  console.log('app is listening localhost:3000');
});
