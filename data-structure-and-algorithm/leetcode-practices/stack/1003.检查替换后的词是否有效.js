/*
 * @lc app=leetcode.cn id=1003 lang=javascript
 *
 * [1003] 检查替换后的词是否有效
 */

// @lc code=start
/**
 * @param {string} S
 * @return {boolean}
 */
// 不停替换abc，剩下的再次替换，最后的字符串为空，就是true，否则就是false
// var isValid = function(S) {
//   var str = S;
//   while(str.length >= 3 && str.match(/abc/g) !== null){
//       str = str.replace(/abc/g, "");
//   }
//   return (str === "" ) ? true : false;
// };

var isValid = function(S) {
  let stack = [];
  for(let i = 0; i < S.length; i++) {
    if (stack.length === 0 || S[i] !== 'c') {
      stack.push(S[i]);
    } else {
      if (stack[stack.length - 1] === 'b') {
        stack.pop();
      }
      if (stack[stack.length - 1] === 'a') {
        stack.pop();
      }
    }
  }

  return stack.length === 0 ? true : false;
};
// @lc code=end

