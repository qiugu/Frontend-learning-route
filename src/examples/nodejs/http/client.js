const http = require('http');
const qs = require('querystring');

/**
 * 请求服务器的方法
 * @param {string} theName 发送到服务器的数据
 */
function send(theName) {
  http.request({
    host: '127.0.0.1',
    port: 3000,
    url: '/',
    method: 'POST'
  }, res => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', data => {
      body += data;
    });
    res.on('end', () => {
      console.log('\n We got \033[90m request complete! \033[39m\n');
      process.stdout.write('\n your name: ');
    })
  }).end(qs.stringify({ name: theName }));
}

process.stdout.write('\n your name: ');
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', name => {
  send(name.replace('\n', ''));
});
