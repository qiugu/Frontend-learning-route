
/**
 * 函数的独占时间
 * @param {number} n 运行函数的数量1 <= n <= 100
 * @param {array} logs 运行日志
 * @returns {array} 每个函数执行的时间组成的数组
 */
var exclusiveTime = function(n, logs) {
  let stack = [], i = 1;
  let s = logs[0].split(':');
  // 初始化返回数组都为0
  let res = new Array(n).fill(0);
  // 保存0函数的执行时刻
  prev = parseInt(s[2]);
  // 将0函数压入栈中
  stack.push(parseInt(s[0]));
  while (i < logs.length) {
    s = logs[i].split(':');
    if (s[1] === 'start') {
      if (stack.length !== 0) {
        // 栈顶表示正在执行的函数
        res[stack[stack.length - 1]] += parseInt(s[2]) - prev;
      }
      stack.push(parseInt(s[0]));
      prev = parseInt(s[2]);
    } else {
      res[stack[stack.length - 1]] += parseInt(s[2]) - prev + 1;
      stack.pop();
      // 如果函数为end时，下一个函数执行从+1时刻开始
      prev = parseInt(s[2]) + 1;
    }
    i++;
  }
  return res;
};
console.log(exclusiveTime(3, [
  '0:start:0',
  '1:start:2',
  '1:end:5',
  '2:start:6',
  '2:end:9',
  '0:end:12'
]))
