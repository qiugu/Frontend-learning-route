/*
 * @lc app=leetcode.cn id=946 lang=javascript
 *
 * [946] 验证栈序列
 */

// @lc code=start
/**
 * @param {number[]} pushed
 * @param {number[]} popped
 * @return {boolean}
 */
var validateStackSequences = function(pushed, popped) {
  let stack = [], index = 0;
  for (let i = 0; i < pushed.length; i++) {
    stack.push(pushed[i]);
    while(stack.length !== 0 && stack[stack.length - 1] === popped[index]) {
      stack.pop();
      index++;
    }
  }
  return stack.length === 0;
};
// @lc code=end

