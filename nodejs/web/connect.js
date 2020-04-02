const fs = require('fs');

const connect = require('connect');
const serveStatic = require('serve-static');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const time = require('./request-time');
const users = require('./users.json');

const app = connect();

const upload = multer({ dest: '/uploads' }).single('file');
const redisClient = redis.createClient()

app.use(upload);

// 请求体解析中间件
//扩展模式       //限制-2M
app.use(bodyParser.urlencoded({ extended: false }));
// 托管静态文件
// 设置maxAge缓存
app.use('/my-img', serveStatic(__dirname + '/images', { maxAge: 10000000000000000 }));

// index属性表示首次要去寻找的文件
app.use(serveStatic(__dirname, { index: ['index.html'], dotfiles: 'allow' }));

// 日志中间件
app.use(morgan('type is :res[content-type], length is :res[content-length] and it took :response-time ms'));

// session
app.use(session({
  secret: 'qg',
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({ client: redisClient })
}));

// 自定义请求时间的中间件
app.use(time({ time: 100 }));

// 查看上传文件
app.use((req, res, next) => {
  if (req.method === 'POST' && req.file) {
    fs.readFile(req.file.path, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error');
        return;
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(`
        <h3>File: ${req.file.originalname}</h3>
        <h4>Type: ${req.file.mimetype}</h4>
        <h4>Content: </h4><pre>${data.toString()}</pre>
      `)
    });
  } else {
    next();
  }
});

// 是否登录
app.use((req, res, next) => {
  if (req.url === '/index' && req.session.logged_in) {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
      Welcome back, <b>${req.session.name}</b>
      <a href="/logout">logout</a>
    `);
  } else {
    next();
  }
});

// 登录页面
app.use((req, res, next) => {
  if (req.url === '/log' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
      <form action="/login" method="POST">
        <fieldset>
          <legend>Please log in</legend>
          <p>User: <input type="text" name="user"/></p>
          <p>Password: <input type="password" name="password"/></p>
          <button>Submit</button>
        </fieldset>
      </form>
    `);
  } else {
    next();
  }
});

// 处理登录表单
app.use((req, res, next) => {
  if (req.url === '/login' && req.method === 'POST') {
    res.writeHead(200);
    if (!users[req.body.user] || users[req.body.user].password !== req.body.password) {
      res.end(`
        Bad username/password
      `);
    } else {
      req.session.logged_in = true;
      req.session.name = users[req.body.user].name;
      res.end('Authenticated!');
    }
  } else {
    next();
  }
});

// 退出登录
app.use((req, res, next) => {
  if (req.url === '/logout') {
    req.session.logged_in = false;
    res.writeHead(200);
    res.end('Logged out!');
  } else {
    next();
  }
});

// 快速响应
app.use((req, res, next) => {
  if (req.url === '/a') {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end('<h1>Fast</h1>');
  } else {
    next();
  }
});

// 慢速响应
app.use((req, res, next) => {
  if (req.url === '/b') {
    setTimeout(() => {
      res.writeHead(200, { 'content-type': 'text/html' })
      res.end('<h1>Slow</h1>');
    }, 1000);
  } else {
    next();
  }
});

app.listen(3333);
