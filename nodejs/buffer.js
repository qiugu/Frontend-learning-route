const myBuffer = Buffer.from('==ii1j2i3h1i23h', 'base64')
console.log(myBuffer)
require('fs').writeFile('./test/logo.png', myBuffer, 'base64', (err, data) => {
  if (err) throw err
  console.log('写入完成', data)
})
