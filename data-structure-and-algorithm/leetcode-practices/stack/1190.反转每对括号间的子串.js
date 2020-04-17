/*
 * @lc app=leetcode.cn id=1190 lang=javascript
 *
 * [1190] 反转每对括号间的子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseParentheses = function(s) {
  let stack = [];
  stack.push(s[0]);
  for (let i = 1; i < s.length; i++) {
    if (s[i] !== ')') {
      stack.push(s[i]);
    } else {
      // 将出栈的字符串保存起来
      let str = '';
      // 遇到）的时候，出栈，直到栈顶元素是（
      while(stack[stack.length - 1] !== '(') {
        str += stack.pop();
      }
      // 栈顶元素是（，所以（也需要出栈一次  
      stack.pop();
      // 将保存的字符串在放回去
      for (let j = 0; j < str.length; j++) {
        stack.push(str[j]);
      }
    }
  }
  return stack.join('');
};
// @lc code=end

