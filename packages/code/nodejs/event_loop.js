process.nextTick(() => {
  console.log(9)
})

console.log(1)

setTimeout(() => {
  console.log(2)
}, 0)

setImmediate(() => {
  console.log(3)
})

process.nextTick(() => {
  console.log(4)
})

const fs = require('fs')

fs.readFile('./test/a.txt', 'utf-8', (err, data) => {
  if (err) throw err
  console.log(5)
  setTimeout(() => {
    console.log(7)
  }, 0)
  
  // 在一个异步回调中，setImmediate会优先setTimeout调用
  setImmediate(() => {
    console.log(8)
  })

  // process.nextTick的优先级是最高的
  process.nextTick(() => {
    console.log(10)
  })
})

console.log(6)

const start = Date.now()

setTimeout(() => {
  console.log(Date.now() - start, '1')
  let count = 0
  for (let i = 0; i < 1000000000; i++) {
    count++
  }
  console.log(count)
}, 1000)

setTimeout(() => {
  console.log(Date.now() - start, '2')
}, 1001)
