/*
 * @lc app=leetcode.cn id=636 lang=javascript
 *
 * [636] 函数的独占时间
 */

// @lc code=start
/**
 * @param {number} n
 * @param {string[]} logs
 * @return {number[]}
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
// @lc code=end

