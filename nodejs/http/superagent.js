const request = require('superagent');

request.get('https://github.com/qiugu')
  .set('content-type', 'text/html')
  .end((err, res) => {
    if (err) throw err;
    console.log(res);
  })

request.post('https://api.github.com/authorizations')
  .send({
    username: 'qiugu',
    password: 'jiaxxxxxx'
  })
  .end(res => {
    console.log(res);
  })
