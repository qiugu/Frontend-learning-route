/**
 * 132模式
 * @param {array} nums 
 */
var find132pattern = function(nums) {
  let stack = [], mins = []
  // 生成最小值数组
  mins[0] = nums[0]
  for (let i = 1; i < nums.length; i++) {
    mins[i] = Math.min(nums[i], mins[i - 1]);
  }
  // 从右边进行遍历，因为要找大于mins的值
  for (let j = nums.length - 1; j >= 0; j--) {
    // 当前值和最小值数组相对位置的值进行比较
    if(nums[j] > mins[j]) {
      // 如果栈顶的元素小于等于最小值数组，则将栈顶元素弹出
      while(stack.length !== 0 && stack[stack.length - 1] <= mins[j]) {
        stack.pop()
      }
      // 如果栈顶元素小于当前值，那么就构成了a1 < a3 < a2的132结构
      if (stack.length !== 0 && stack[stack.length - 1] < nums[j]) return true
      stack.push(nums[j])
    }
  }
  return false
}
console.log(test([3, 5, 0, 3, 4]))
console.log(test([3, 1, 4, 2]))
console.log(test([-1, 3, 2, 0]))
console.log(test([1, 2, 3, 4]))
