# 指针

## 移动零

单指针，指针每次指向非0的值，然后往后移动一位，之后再去补足0
```js
var moveZeroes = function(nums) {
    const n = nums.length;
    let p1 = 0;
    for (let i = 0; i < n; i++) {
        if (nums[i] !== 0) {
            nums[p1++] = nums[i];
        }
    }
    for (let i = p1; i < n; i++) {
        nums[i] = 0;
    }
};
```

双指针，左指针指向已经处理好的序列的尾部，右指针指向待处理序列的头部
```js
var moveZeroes = function(nums) {
    const n = nums.length;
    let left = 0, right = 0;
    while (right < n) {
      // 当前为非0
      if (nums[right]) {
        // 交换左右指针
        const temp = nums[right];
        nums[right] = nums[left];
        nums[left] = temp;
        // 保持左指针指向处理好的序列尾部
        left++;
      }
      // 右指针指向未处理的序列头部，就是往右移动一位
      right++;
    }
};
```
