# hash 表

## 两数之和

```js
const twoSum = (nums, target) => {
  const memo = new Map();
  for (let i = 0; i < nums.length; i++) {
    const remaining = target - nums[i];
    if (memo.has(remaining)) {
      return [i, memo.get(remaining)];
    }
    memo.set(nums[i], i);
  }
};
```
