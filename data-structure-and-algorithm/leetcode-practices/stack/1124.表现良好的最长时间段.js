/*
 * @lc app=leetcode.cn id=1124 lang=javascript
 *
 * [1124] 表现良好的最长时间段
 */

// @lc code=start
/**
 * @param {number[]} hours
 * @return {number}
 */
// 时间复杂度n^2，超出时间限制
// var longestWPI = function(hours) {
//   let max = 0;
//   if (hours.length === 0) return max;
//   for(let i = 0; i < hours.length; i++) {
//     for(let j = i; j < hours.length; j++) {
//       let arr = hours.slice(i, j + 1);
//       let noTired = arr.filter(val => val > 8);
//       let tired = arr.filter(val => val <= 8);
//       if (noTired.length > tired.length) {
//         max = Math.max(max, arr.length);
//       }
//     }
//   }
//   return max;
// };

// 滑动窗口思路，结果不对
// var longestWPI = function(hours) {
//   if (hours.length === 0) return 0;
//   let max = 0, start = 0, end = 0;
//   while(start < hours.length && end <= hours.length) {
//     end = start + max + 1;
//     let arr = hours.slice(start, end);
//     let tired = arr.filter(val => val > 8);
//     let noTired = arr.filter(val => val <= 8);
//     if (tired.length > noTired.length) {
//       max = Math.max(max, arr.length);
//     } else {
//       start++;
//     }
//   }
  
//   return max;
// };

// 单调栈
var longestWPI = function(hours) {
  if (hours.length === 0) return 0;
  // 定义得分数组，大于8为1，小于等于8为-1
  let n = hours.length, score = new Array(n);
  for (let i = 0; i < n; i++) {
    if (hours[i] > 8) {
      score[i] = 1;
    } else {
      score[i] = -1;
    }
  }
  // 定义前缀和数组
  let presum = new Array(n + 1);
  presum[0] = 0;
  for (let i = 1; i < presum.length; i++) {
    presum[i] = presum[i - 1] + score[i - 1];
  }
  // 定义单调栈和返回最大长度
  let stack = [], ans = 0;
  for (let i = 0; i < presum.length; i++) {
    if (stack.length === 0 || presum[stack[stack.length - 1]] > presum[i]) {
      stack.push(i);
    }
  }
  let k = n;
  while(k > ans) {
    while(stack.length !== 0 && presum[stack[stack.length - 1]] < presum[k]) {
      ans = Math.max(ans, k - stack[stack.length - 1]);
      stack.pop();
    }
    k--;
  }
  return ans;
};
console.log(longestWPI([9,9,6,0,6,6,9]))
// @lc code=end

