const fs = require('fs')
const path = require('path')
const stdout = process.stdout
const stdin = process.stdin

// 保存文件的状态属性的数组
var stats = []

function read(files) {
  console.log(' ')
  stdout.write('Enter your choice!')
  stdin.resume()
  stdin.setEncoding('utf8')
  // 监听命令行的输入
  stdin.on('data', option)
  
  function option(data) {
    var filename = files[Number(data)]

    // 如果当前文件是目录类型，则打印目录下包含的文件
    // 如果不是目录类型，则打印文件的内容
    if (stats[Number(data)].isDirectory()) {
      console.log('Enter your choice')
      fs.readdir(__dirname + '/' + filename, (err, files) => {
        console.log('(' + files.length + ' files)')
        files.forEach(file => {
          console.log('    -    ' + file)
        })
        console.log(' ')
      })
    } else {
      stdin.pause()
      fs.readFile(__dirname + '/' + filename, 'utf8', (err, data) => {
        console.log(' ')
        console.log('\033[90m' + data.replace(/(.*)/g, '    $1') + '\033[39m')
      })
    }
  }
}

/**
 * 判断读取文件的类型，目录或者是文件
 * @param {array} files 
 * @param {number} i 
 */
function file(files,i) {
  var filename = files[i]

  fs.stat(__dirname + '/' + filename, (err, stat) => {
    stats[i] = stat
    if (stat.isDirectory()) {
      console.log(i + ' ' + filename)
    } else {
      console.log(i + ' ' + filename)
    }

    i++

    //  递归执行判断文件类型
    //  如果执行了最后一个文件，则开始读取文件
    if (i === files.length) {
      read(files)
    } else {
      file(files,i)
    }
  })
}

fs.readdir(process.cwd(), (err, files) => {
  console.log('')

  // 判断文件长度
  if (!files.length) {
    console.log('No files show!')
  }

  console.log('Select which file or directory you want to see\n')

  // 如果有文件存在，执行下一步
  file(files,0)
})
