/**
 * 表现良好的最长时间段
 * @param {number[]} hours 每天工作小时数组成的数组
 * @return {number} 表现良好时间段的最大长度
 */
var longestWPI = function(hours) {
  // 前缀和 + 单调栈
  // 数组下标0到length-1时的和组成的数组叫做前缀和数组

  // 前缀和
  let preSum = new Array(hours.length + 1).fill(0);
  for (let i = 0; i < hours.length; i++) {
      if (hours[i] > 8) preSum[i + 1] = preSum[i] + 1;
      else preSum[i + 1] = preSum[i] - 1;
  }

  // 单减栈
  let stack = [];
  stack.push(0);
  for (let i = 1; i < preSum.length; i++) {
      if (preSum[stack[stack.length - 1]] > preSum[i]) stack.push(i);
  }

  // 从右到左求最大跨度
  let max = 0;
  for (let i = preSum.length - 1; i > max; i--) {
      while(stack.length > 0 && preSum[stack[stack.length - 1]] < preSum[i]){
          max = Math.max(max, i - stack.pop());
      }
  }
  return max;
};
console.log(longestWPI([9,9,6,0,6,6,9]))
// console.log(longestWPI([15,8,4,9,15,7,6,9,10,15]))
