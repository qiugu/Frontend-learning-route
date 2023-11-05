# 树

## 概念

* 树的概念：n（n &gt;= 0）个节点构成的有限集合，n = 0时成为空树
* 根（Root）
* 子树（SubTree）
* 父节点
* 子节点
* 兄弟节点
* 节点的度（Degree）：节点的子树个数
* 树的度：树的节点中最大的度
* 叶节点（Leaf）：度为0的节点
* 路径和路径长度
* 节点的层次：根节点在1层，其他各层在父节点的层次+1
* 树的深度：树中节点的最大层次
* 完全二叉树：除最后一层节点外，其他节点都有两个子节点。最后一层从左向右的叶节点连续存在，只缺右侧若干节点
* 完美二叉树：每层节点都有2个子节点的二叉树
* 二叉搜索树
* 平衡数
* 红黑树

## 树的遍历

* 前、中、后序遍历（深度优先遍历）
* 层序遍历（广度优先遍历）

因为树的特殊结构就是一个标准的递归结构，因此一般深度优先遍历都是使用递归。递归的特点：首先要有退出条件，另外就是自己调用自己，可以想象成自底向上的过程，退出条件就是base case，从这个case开始逐渐向上计算，得到最终的结果。

### 中序遍历（左根右）

递归方法：

```js
var inorderTraversal = function(root) {
  const res = [];
  const inorder = node => {
    if (!node) return;
    inorder(node.left);
    res.push(node.val);
    inorder(node.right);
  };

  inorder(root);
  return res;
};
```

迭代方法：

```js
var inorderTraversal = function(root) {
  const res = [];
  const stack = [];
  while (root || stack.length) {
      while (root) {
          stack.push(root);
          root = root.left;
      }
      root = stack.pop();
      res.push(root.val);
      root = root.right;
  }
  return res;
};
```

## 二叉树的最大深度

递归方法：

```js
var maxDepth = function(root) {
  // 递归退出条件
  if (!root) return 0;
  // 二叉树的最大深度，就是二叉树的左右子树的深度的较大值+1
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
};
```

迭代方法：层序遍历每一层，每遍历一层，深度+1

```js
var maxDepth = function(root) {
  if (!root) return 0;
  const queue = [root];
  let res = 0;
  while (queue.length) {
      const n = queue.length;
      for (let i = 0; i < n; i++) {
          const node = queue.shift();
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
      }
      res++;
  }
  return res;
};
```

## 翻转二叉树

```js
// 递归，后序遍历
var invertTree = function (root) {
  const dfs = (node) => {
      if (!node) return null;
      const left = dfs(node.left);
      const right = dfs(node.right);
      node.left = right;
      node.right = left;
      return node;
  };
  dfs(root);
  return root;
};

// 迭代，广度优先遍历
var invertTree = function (root) {
  if (root == null) return null;
  const queue = [root];
  while (queue.length !== 0) {
      const temp = queue.shift();
      const left = temp.left;
      temp.left = temp.right;
      temp.right = left;

      if (temp.left != null) {
          queue.push(temp.left);
      }
      if (temp.right != null) {
          queue.push(temp.right);
      }
  }
  return root;
}
```

## 对称二叉树

```js
/**
    分析：
    1. 左子树和右子树进行对比，即左子树的左子节点和右子树的右子节点，左子树的右子节点和右子树的左子节点
    2. 后续遍历
 */
var isSymmetric = function(root) {
  const dfs = (l, r) => {
      if (!l && !r) return true;
      if (!l || !r) return false;
      if (l.val !== r.val) return false;
      return dfs(l.left, r.right) && dfs(l.right, r.left);
  };
  return dfs(root.left, root.right);
};

// 迭代遍历
var isSymmetric = function(root) {
  const q = [root,root];
  while (q.length) {
      const l = q.shift();
      const r = q.shift();

      if (!l && !r) continue;
      if (!l || !r) return false;
      if (l.val !== r.val) return false;

      q.push(l.left);
      q.push(r.right);
      q.push(l.right);
      q.push(r.left);
  }
  return true;
}
```

## 二叉树的直径

```js
var diameterOfBinaryTree = function(root) {
  // 求二叉树的直径长度可以理解为求每个节点左右子树的深度
  // 当前节点的直径就是左右子树的深度
  // 使用一个值，记录每个节点的直径
  // 找到最大的直径返回
  // 记录所有节点中最大直径的值
  let ans = 0;
  const dfs = node => {
   // 节点为空，其直径为0
   if (!node) return 0;
   // 求左右子树的深度
   const L = dfs(node.left);
   const R = dfs(node.right);
   // 当前节点的直径就是左右子树的深度
   ans = Math.max(ans, L+R);
   // 当前节点的深度就是左右子树中较大的深度+1
   return Math.max(L, R) + 1;
  };
  dfs(root);
  return ans;
};
```

## 将有序数组转换为二叉搜索树

```js
var sortedArrayToBST = function(nums) {
  // 左右子树高度差不超过1，说明节点必须均分数组的剩余元素
  const dfs = (arr) => {
    if (!arr.length) return null;
    const start = 0;
    const end = arr.length - 1;
    const mid = (start + end) >> 1;
    const newNode = new TreeNode(arr[mid]);
    newNode.left = dfs(arr.slice(start, mid));
    newNode.right = dfs(arr.slice(mid + 1, end + 1));
    return newNode;
  };
  return dfs(nums);
};
```

## 字典树（Trie树）

```js
class TrieNode {
  constructor (data) {
    // 存储的字符
    this.data = data;
    // 子节点
    this.children = new Arrary(26);
    // 标记是否到达字符串的结尾
    this.isEndingChar = false;
  }
}

class Trie {
  constructor () {
    this.root = new TrieNode('/');
  }

  insert (text) {
    let p = this.root;
    for (let i = 0; i < text.length; i++) {
      // 找到插入字符在26个字母中的位置
      const index = text[i].charCodeAt() - 'a'.charCodeAt();
      if (p.children == null) {
        const newNode = new TrieNode(text[i]);
        p.children[index] = newNode;
      }
      // 当前存在子节点的话，继续遍历子节点
      p = p.children[index];
    }
    // 改变结束标记
    p.isEndingChar = true;
  }

  find (pattern) {
    let p = this.root;
    for (let i = 0; i < pattern.length; i++) {
      const index = pattern[i].charCodeAt() - 'a'.charCodeAt();
      if (p.children[index] == null) return false;
      p = p.children[index];
    }
    if (p.isEndingChar) return true;
    else return false;
  }
}
```
