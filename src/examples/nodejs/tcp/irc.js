const net = require('net');

const con = net.connect(6667, 'irc.freenode.net');
con.on('connect', () => {
  con.write('NICK mynick\r\n');
  con.write('USER mynick\r\n');
  con.write('JOIN #node.js\r\n');
})
