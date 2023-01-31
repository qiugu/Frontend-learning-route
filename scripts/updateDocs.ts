const fs = require('fs');
const path = require('path');

function copyFile (src, target, cb) {
  const rs = fs.createReadStream(src);
  rs.on('error', err => {
    if (err) {
      console.log('创建可读流失败', err);
    };
    typeof cb === 'function' && cb(err);
  });

  const ws = fs.createWriteStream(target);
  ws.on('error', err => {
    if (err) {
      console.log('创建可写流失败', err);
    }
    typeof cb === 'function' && cb(err);
  });

  ws.on('close', ex => {
    typeof cb === 'function' && cb(ex);
  });

  rs.pipe(ws);
  console.log('文件复制完成');
}

copyFile(path.resolve(__dirname, '../docs/README.md'), path.resolve(__dirname, '../README.md'), () => {});
