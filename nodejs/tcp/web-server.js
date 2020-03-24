const net = require('net');

/**
 * 基于tcp聊天程序
 */
let count = 0, users = {};

const server = net.createServer((conn) => {
  console.log('\033[90m    new Connection!\033[39m');
  conn.write(
    '\n > welcome to \033[92mnode-chat\033[39m!'
    + '\n > ' + count + ' other people are connected at this time. '
    + '\n > please write your name and press enter:'
  );
  count++;
  conn.setEncoding('utf8');

  // 监听用户输入的数据
  let nickname;
  conn.on('data', (data) => {
    data = data.replace('\n\r', '');

    if (!nickname) {
      if (users[data]) {
        broadcast(users[data], '\033[93m> nickname is already in use. try again:\033[39m ');
        return;
      } else {
        nickname = data;
        users[nickname] = conn;
        broadcast(nickname, '\033[96m > ' +  nickname + ' joind the room\033[39m\n');
      }
    } else {
      broadcast(nickname, '\033[96m > ' + nickname + ':\033[39m ' + data + '\n', true);
    }
  });

  // 监听断开连接
  conn.on('close', () => {
    count--;
    delete users[nickname];
    broadcast(nickname, '\033[90m > ' + nickname + ' left the room\033[39m\n');
  });
});

/**
 * 通知用户信息
 * @param {string} nickname 要通知的人昵称
 * @param {string} msg 要广播通知的信息
 * @param {boolean} exceptMyself 是否发送信息时除去自己
 */
function broadcast(nickname, msg, exceptMyself) {
  for (let i in users) {
    if (!exceptMyself || i !== nickname) {
      users[i].write(msg);
    }
  }
}

server.listen(3000, () => {
  console.log('\033[96m      server listening on *:3000\033[39m');
});
