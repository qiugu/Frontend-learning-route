/**
 * 请求时间的中间件
 * @param {object} opts 参数对象
 */
module.exports = function(opts) {
  const time = opts.time || 100;

  return (req, res, next) => {
    const timer = setTimeout(() => {
      console.log('\033[90m%s %s\033[39m \033[91mis taking too long!\033[39m', req.method, req.url);
    }, time);

    // 保持对原始方法的引用
    const end = res.end;
    // 重写方法（猴子补丁）
    res.end = (chunk, encoding) => {
      // 恢复引用
      res.end = end;
      // 调用原始方法
      res.end(chunk, encoding);
      // 清除定时器
      clearTimeout(timer);
    };
    next();
  }
}