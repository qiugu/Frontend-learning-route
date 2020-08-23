const http = require('http');

const express = require('express');
const sio = require('socket.io');

const app = express();
const server = http.createServer(app);
const ws = sio(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

ws.on('connection', socket => {
  // 监听用户连接
  socket.on('join', name => {
    console.log(`${name} join the chat`);
    socket.nickname = name;
    // 有用户加入的话，触发事件，告知所有人
    socket.broadcast.emit('announcement', `${name} join the chat`);
  });

  // 监听用户发送的信息
  socket.on('text', (msg, fn) => {
    socket.broadcast.emit('text', socket.nickname, msg);
    // 确认消息已经接受
    fn(Date.now());
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`socket is listening on port ${port}`);
});
