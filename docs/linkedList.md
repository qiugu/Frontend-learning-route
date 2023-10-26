# 链表

## 链表相交

利用 hash 存储其中一个链表的节点，然后遍历另外一个链表，如果另外一个链表的节点存在于 hash 中，则为相交节点

```js
var getIntersectionNode = function(headA, headB) {
  // 存储链表节点的hash
  const visited = new Set();
  while (headA) {
    visited.add(headA);
    headA = headA.next;
  }
  while (headB) {
    if (visited.has(headB)) return headB;
    headB = headB.next;
  }
  // 不存在相交节点，返回null
  return null;
};
```

利用双指针，一个指针遍历完 A 链表以后，继续遍历 B 链表，另外一个指针遍历完 B 链表以后遍历 A 链表，这时两个指针相等，则为相交链表

```js
var getIntersectionNode = function(headA, headB) {
  let l1 = headA, l2 = headB;
  while (l1 != l2) {
    l1 = l1 ? l1.next : headB;
    l2 = l2 ? l2.next : headA;
  }
  return l1;
}
```

## 链表反转

迭代的思路：当前节点的下一个节点保存，当前节点的下一个节点指向前一个节点
```js
var reverseList = function(head) {
  let prev = null, cur = head;
  while (cur) {
    // 保存当前节点的下一个节点
    const next = cur.next;
    // 当前节点的下一个节点指向上一个节点
    cur.next = prev;
    // 更新上一个节点
    prev = cur;
    // 更新当前节点
    cur = next;
  }
};
```

递归的思路：当前节点的下一个节点的下一个节点指向当前节点
```js
var reverseList = function(head) {
  // 定义递归退出条件
  if (!head || !head.next) return head;
  const newNode = reverseList(head.next);
  // head.next.next = head 完成反转
  head.next.next = head;
  // 要断开原来的指向
  head.next = null;
  return newNode;
};
```
