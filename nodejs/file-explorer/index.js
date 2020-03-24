const fs = require('fs');
const stdin = process.stdin;
const stdout = process.stdout;

// 存储读取的文件目录
let files = [];
// 保存每个文件的信息
let stats = [];

/**
 * 读取文件目录
 */
fs.readdir(process.cwd(), (err, data) => {
  if (err) throw err;
  console.log('');

  if (!data.length) {
    return console.log('    \033[31m No files to show!\033[39m\n');
  }

  console.log('      Select which file or directory you want to see\n');

  files = data;
  file(0);
})

/**
 * 递归遍历文件目录
 * @param {number} i 文件的索引 
 */
function file(i) {
  const filename = files[i];

  // 读取指定路径的文件信息
  fs.stat(`${__dirname}/${filename}`, (err, stat) => {
    if (err) throw err;
    
    stats[i] = stat;

    if (stat.isDirectory()) {
      console.log('      ' + i + '   \033[36m' + filename + '/\033]39m');
    } else {
      console.log('      ' + i + '   \033[90m' + filename + '\033[39m');
    }

    if (++i === files.length) {
      read();
    } else {
      file(i);
    }
  });
}

/**
 * 读取用户的输入
 */
function read() {
  // 没输出换行，为什么
  console.log('');
  stdout.write('      \033[33mEnter your choice: \033[39m');
  stdin.resume();
  stdin.setEncoding('utf8');
  stdin.on('data', option);
}

/**
 * 监听用户输入的回调
 * @param {string} 用户输入的目录序号 
 */
function option(data) {
  // 这里使用parseInt不使用Number的原因是Number会将空字符串转换成0
  // 也就是说如果不输入任何值的情况下，默认会读取第一个文件
  const filename = files[parseInt(data)];
  if (!filename) {
    stdout.write('      \033[31mEnter your choice: \033[39m');
  } else {
    // 暂停流
    stdin.pause();
    if (stats[parseInt(data)].isDirectory()) {
      fs.readdir(`${__dirname}/${filename}`, (err, files) => {
        if (err) throw err;
        console.log('');
        console.log('      (' + files.length + ' files)');
        files.forEach(file => {
          console.log('      - ' + file);
        });
        console.log('');
      });
    } else {
      fs.readFile(`${__dirname}/${filename}`, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('');
        console.log('\033[90m' + data.replace(/(.*)/g, '         $1') + '\033[39m');
      });
    }
  }
}
