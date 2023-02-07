const path = require('path');

const Koa = require('koa');
const static = require('koa-static');

const app = new Koa();
app.use(static(path.resolve(__dirname, './examples')));
app.use(static(path.resolve(__dirname, './src')));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`app start at http://localhost:${PORT}`);
});
