const fs = require('fs');

const stream = fs.createReadStream('./test/a.txt');

// 监听流传输，只有两个参数
// 回调中只有一个参数
stream.on('data', (data) => {
  console.log(data.toString());
});
stream.on('end', (data) => {
  console.log(data);
});
