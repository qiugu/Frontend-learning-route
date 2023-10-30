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

## 回文链表

存储所有的节点，利用双指针首尾比较
```js
var isPalindrome = function(head) {
  const visited = [];
  while (head) {
    visited.push(head.val);
    head = head.next;
  }
  const n = visited.length;
  for (let i = 0, j = n - 1; i < n, j >= 0; i++, j--) {
    if (visited[i] !== visited[j]) return false;
  }

  return true;
};
```

利用快慢指针找到中间节点，再反转后半部分的链表，同前半部分对比
```js
var isPalindrome = function(head) {
  let slow = head, fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const reverseList = (node) => {
    let prev = null, cur = node;
    while (cur) {
      const next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    return prev;
  };
  let halfLink = reverseList(slow.next);
  while(halfLink) {
    if (halfLink.val !== head.val) return false;
    halfLink = halfLink.next;
    head = head.next;
  }
  return true;
};
```

## 链表有环

通过快慢指针，快慢指针相遇则说明链表存在环
```js
var hasCycle = function(head) {
  if (!head || !head.next) return false;
  let slow = head, fast = head.next;
  while (fast && fast.next) {
      if (slow == fast) return true;
      slow = slow.next;
      fast = fast.next.next;
  }
  return false;
};
```

## 合并两个有序链表

迭代：双指针不停进行比较
```js
var mergeTwoLists = function(list1, list2) {
  const piovt = new ListNode(-1);
  let l1 = list1, l2 = list2, l0 = piovt;
  while (l1 && l2) {
      if (l1.val > l2.val) {
          l0.next = l2;
          l2 = l2.next;
      } else {
          l0.next = l1;
          l1 = l1.next;
      }
      l0 = l0.next;
  }

  l0.next = l1 ? l1 : l2;

  return piovt.next;
};
```

递归：找出递推公式，每次合并应该返回新链表的节点
const newNode = mergeTwoLists(l1, l2);
更新节点指针：l1.val < l2.val ? l1.next : l2.next;
```js
var mergeTwoLists = function(list1, list2) {
  if (!list1 && list2) return null;
  if (!list1) return list2;
  if (!list2) return list1;
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  }
  l2.next = mergeTwoLists(l1, l2.next);
  return l2;
};
```
