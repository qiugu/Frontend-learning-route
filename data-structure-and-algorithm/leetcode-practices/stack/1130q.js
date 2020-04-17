/**
 * 叶值最小代价生成树
 * @param {number[]} arr 中序遍历得到的叶子节点
 * @returns {number} 每个非叶节点最小可能总和
 */
var mctFromLeafValues = function(arr) {
  // 单调栈
  let stack = [], ans = 0;
  stack.push(Number.MAX_VALUE);
  for (let i = 0; i < arr.length; i++) {
    // 栈顶元素比当前元素小，栈顶元素出栈，取之后的栈顶元素和当前元素较小的乘积赋给ans
    while(stack[stack.length - 1] < arr[i]) {
      ans += stack.pop() * Math.min(stack[stack.length - 1], arr[i]);
    }
    stack.push(arr[i]);
  }
  while(stack.length > 2) {
    ans += stack.pop() * stack[stack.length - 1];
  }
  return ans;
};
console.log(mctFromLeafValues([4,11]))
console.log(mctFromLeafValues([6,2,4]))
console.log(mctFromLeafValues([5,8,7,4]))
