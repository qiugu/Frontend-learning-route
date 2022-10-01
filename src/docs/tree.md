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

## 字典树（Trie树）

```js
class TrieNode {
  constructor (data) {
    // 存储的字符
    this.data = data;
    // 子节点
    this.children = new Arrary(26).fill(new TrieNode);
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
