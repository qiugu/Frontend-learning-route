const path = require('path')

console.log(path.join(__dirname, 'test', 'a.txt'))
console.log(path.relative(__dirname, 'test', 'a.txt'))
console.log(path.resolve(__dirname, 'test', 'a.txt'))
console.log(path.resolve('test', __filename))
console.log(__dirname)
