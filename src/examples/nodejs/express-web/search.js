const request = require('superagent');

module.exports = (query, fn) => {
  request.get('https://api.github.com/search/repositories')
    .query({ q: query })
    // 使用github-api必须要添加user-agent头
    .set('User-Agent', 'chrunleeAutoLogin')
    .end((err, res) => {
      if (err) fn(err);
      if (res.body && Array.isArray(res.body.items)) {
        fn(null, res.body.items);
      } else {
        fn(null, []);
      }
    });
}
