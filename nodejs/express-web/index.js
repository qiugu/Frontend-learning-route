const path = require('path');

const express = require('express');

const search = require('./search');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.set('env', 'production');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/search', (req, res, next) => {
  search(req.query.q, (err, data) => {
    if (err) return next(err);
    console.log(data);
    res.render('search', { results: data, search: req.query.q });
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
