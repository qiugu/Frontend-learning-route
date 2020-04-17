/*
 * @lc app=leetcode.cn id=1249 lang=javascript
 *
 * [1249] 移除无效的括号
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var minRemoveToMakeValid = function(s) {
  let i = 0, stack = [];
  // 存储不符合条件的索引
  let indexes = [];
  while(i < s.length) {
    if (s[i] === '(') {
      stack.push(i);
    } else if (s[i] === ')') {
      // 当栈中为空时，)也是不符合条件的，所以将其索引加入indexex数组中
      if (stack.length === 0) {
        indexes.push(i);
      } else {
        stack.pop();
      }
    }
    i++;
  }
  // 栈中剩余的元素也是不符合要求的，加入到indexex数组中
  while(stack.length !== 0) indexes.push(stack.pop());
  let res = '';
  for (let i = 0; i < s.length; i++) {
    // 过滤indexex数组中的索引
    if (indexes.indexOf(i) === -1) {
      res += s.charAt(i);
    }
  }
  return res;
};
// @lc code=end

