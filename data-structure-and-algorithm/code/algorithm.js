/**
 * 大O表示法
 * 1.使用常量1代替所有的常数项
 * 2.保留多项式中的最高次幂
 * 3.最高次幂存在且不为1，则去除最高次幂的相乘的常数项
 */

/**
 * 冒泡排序
 * 时间复杂度：O(n^2)
 */
function bubleSort(arr) {
  const len = arr.length
  // 两两比较，因此数组长度最低为2，外层循环比较次数为len - 1
  for (let i = len; i >= 2; i--) {
    // 每次排序之后，获得最右边的值，下次排序比较次数-1，因此j < i -1
    for (let j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}

/**
 * 选择排序
 * 时间复杂度：O(n^2)
 * 交换次数小于冒泡排序
 */

function selectSort(arr) {
  const len = arr.length
  // 取第一个值和剩下所有的值进行比较，最后一个值不需要和其他值比较，因此外层循环次数为len - 1
  for (let i = 0; i < len - 1; i++) {
    // 内层循环每次获得左边最小值，每次比较i和i+1后面的所有值
    for (let j = i + 1; j < len; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}

/**
 * 插入排序
 * 时间复杂度: O(n^2)
 * 相对于冒泡排序和选择排序效率更高
 */

function insertSort(arr) {
  const len = arr.length
  // 比较每项的数值和他左边已排序的树进行比较，外层排序次数len - 1
  for (let i = 0; i < len - 1; i++) {
    // 内层排序从1开始，和他左边的值进行比较
    for (let j = i + 1; j > 0; j--) {
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
      }
    }
  }
  return arr
}

/**
 * 希尔排序
 * 多数情况下效率高于简单排序，最快情况下的时间复杂度为O(n^2)
 */

function shellSort(arr, gap) {
  const len = arr.length
  for (let i = 0; i < gap.length; i++) {
    const n = gap[i]
    for (let j = i + n; j < len; j++) {
      for (let k = j; k > 0; k-=n) {
        if (arr[k] < arr[k - n]) {
          [arr[k], arr[k - n]] = [arr[k - n], arr[k]]
        }
      }
    }
  }
  return arr
}

// 动态计算间隔序列
function shellSort1(arr) {
  const len = arr.length
  let h = 1
  while (h < len / 3) {
    h = h * 3 + 1
  }
  while (h >= 1) {
    for (let i = h; i < len; i++) {
      for (j = i; j >= h; j -=h) {
        if (arr[j] < arr[j - h]) {
          [arr[j], arr[j - h]] = [arr[j - h], arr[j]]
        }
      }
    }
    h = (h - 1) / 3
  }
  return arr
}

/**
 * 快速排序
 * 多数情况下效率最高的
 * 时间复杂度：O(nlogn)
 */

function quickSort(arr) {
  const len = arr.length
  if (len === 0) return []
  // 枢纽的选择会影响快速排序的效率
  const pivot = arr[0]
  const left = []
  const right = []
  for (let i = 1; i < len; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(pivot, quickSort(right))
}

/**
 * 动态规划
 * 斐波那契数列的优化
 */
function dynFib(n) {
  const val = []
  for (let i = 0; i <= n; i++) {
    val[i] = []
  }
  if (n === 1 || n === 2) {
    return 1
  } else {
    val[1] = 1
    val[2] = 1
    for (let i = 3; i <= n; i++) {
      val[i] = val[i - 1] + val[i - 2]
    }
    return val[n - 1]
  }
}

/**
 * 动态规划
 * 寻找最长公共子串
 */
function lcs(word1, word2) {
  let max = 0
  let index = 0
  let lcsarr = new Array(word1.length + 1)
  for (let i = 0; i <= word1.length; i++) {
    lcsarr[i] = new Array(word2.length + 1)
    for (let j = 0; j <= word2.length; j++) {
      lcsarr[i][j] = 0
    }
  }
  for (let i = 0; i <= word1.length; i++) {
    for (let j = 0; j <= word2.length; j++) {
      if (i === 0 || j === 0) {
        lcsarr[i][j] = 0
      } else {
        if (word1[i - 1] === word2[j - 1]) {
          lcsarr[i][j] = lcsarr[i - 1][j - 1] + 1
        } else {
          lcsarr[i][j] = 0
        }
      }
      if (max < lcsarr[i][j]) {
        max = lcsarr[i][j]
        index = i
      }
    }
  }
  let str = ''
  if (max === 0) {
    return ''
  } else {
    for (let i = index - max; i <= max; i++) {
      str += word2[i]
    }
    return str
  }
}

/**
 * 递归
 * 背包问题
 */
function knapsack(capacity, size, value, n) {
  if (n === 0 || capacity === 0) {
    return 0
  }
  // 如果最大的尺寸大于背包容量，则取最大尺寸的前一个尺寸的物品
  if (size[n - 1] > capacity) {
    return knapsack(capacity, size, value, n - 1)
  } else {
    return Math.max(
      value[n - 1] + knapsack(capacity - size[n - 1], size, value, n - 1),
      knapsack(capacity, size, value, n - 1)
    )
  }
}

/**
 * 动态规划
 * 背包问题
 */
function dKnapsack(capacity, size, value, n) {
  // 记录多个物品和不同容量时的背包中能装的物品的最大价值的二维数组
  // 横坐标表示物品的数量，纵坐标表示背包的容量
  let K = []
  for (let i = 0; i <= capacity + 1; i++) {
    K[i] = []
  }
  // 外层循环遍历物品的数量
  for (let i = 0; i <= n; i++) {
    // 内层循环遍历背包的容量
    for (let w = 0; w <= capacity; w++) {
      if (i === 0 || w === 0) {
        K[i][w] = 0
      } else if (size[i - 1] <= w) {
        // 取价值最大的物品和当前容量减去最大尺寸的价值的和
        K[i][w] = Math.max(value[i - 1] + K[i - 1][w - size[i - 1]], K[i - 1][w])
      } else {
        K[i][w] = K[i - 1][w]
      }
    }
  }
  // console.log(K)
  return K[n][capacity]
}

/**
 * 贪心算法
 * 找零问题
 */
function makeChange(origAmt, coins) {
  let remainAmt = 0
  if (origAmt % 0.25 < origAmt) {
    coins[3] = parseInt(origAmt / 0.25)
    remainAmt = origAmt % 0.25
    origAmt = remainAmt
  }
  if (origAmt % 0.1 < origAmt) {
    coins[2] = parseInt(origAmt / 0.1)
    remainAmt = origAmt % 0.1
    origAmt = remainAmt
  }
  if (origAmt % 0.05 < origAmt) {
    coins[1] = parseInt(origAmt / 0.05)
    remainAmt = origAmt % 0.05
    origAmt = remainAmt
  }
  coins[0] = parseInt(origAmt / 0.01)
}

/**
 * 贪心算法
 * 背包问题
 */
function ksack(values, weights, capacity) {
  // 初始化剩余容量，物品数量，装入背包的物品价值
  let load = 0, i = 0, w = 0
  while (load < capacity && i < 4) {
    if (weights[i] <= (capacity - load)) {
      w += values[i]
      load += weights[i]
    } else {
      // 如果当前物品容量大于背包剩余容量
      // 计算背包剩余容量和当前物品容量的比率
      // 物品总价值加上当前物品的价值乘以容量比率
      let r = (capacity - load) / weights[i]
      w += r * values[i]
      load += weights[i]
    }
    i++
  }
  return w
}

/**
 * tests
 */
// console.log(dynFib(20))
// let value = [4, 5, 10, 11, 13]
// let size = [3, 4, 7, 8, 9]
// const capacity = 16, n = 5
// console.log(knapsack(capacity, size, value, n))
// makeChange(0.63, [])
// let items = ['A','B','C','D']
// let values = [50, 140, 60, 60]
// let weights = [5, 20, 10, 12]
// let capacity = 30
// console.log(ksack(values, weights, capacity))
const gap = [5,3,1]
const arr = [19, 29, 10, 20, 31, 8, 14]
// console.log(insertSort(arr))
// console.log(shellSort(arr, gap))
// console.log(shellSort1(arr))
console.log(quickSort(arr))
