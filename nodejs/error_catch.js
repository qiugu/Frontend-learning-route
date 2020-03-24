const a = () => b()

const b = () => c()

// 错误包含在未来发生的情况下，无法捕获到错误
const c = () => {
  setTimeout(() => {
    throw new Error('error is here')
  }, 2000)
}

const http = require('http')

// 一旦访问了3000端口，会导致真个应用程序中断
http.createServer(() => {
   throw new Error('当前错误未被捕获')
}).listen(3000)
