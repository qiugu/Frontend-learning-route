/*
 * @lc app=leetcode.cn id=1019 lang=javascript
 *
 * [1019] 链表中的下一个更大节点
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * 枚举法，时间复杂度n^2
 * @param {ListNode} head
 * @return {number[]}
 */
// var nextLargerNodes = function(head) {
//   let cur = head, res = [];
//   while (cur) {
//     let longerNode = cur.next;
//     while(longerNode) {
//       if (longerNode.val > cur.val) {
//         res.push(longerNode.val);
//         break;
//       }
//       longerNode = longerNode.next;
//       if (!longerNode) res.push(0);
//     }
//     cur = cur.next;
//     if (!cur) res.push(0);
//   }
//   return res;
// };

// 单调栈
function ListNode(val) {
  this.val = val;
  this.next = null;
}
var nextLargerNodes = function(head) {
  let res = [], cur = head, hash = new Map, stack = [];
  while (cur) {
    while(stack.length !== 0 && stack[stack.length - 1].val < cur.val) {
      hash.set(stack.pop(), cur.val);
    }

    stack.push(cur);
    cur = cur.next;
  }

  while(head) {
    if (hash.has(head)) res.push(hash.get(head));
    else res.push(0);
    head = head.next;
  }

  return res;
};
let head = new ListNode(1)
let head1 = new ListNode(7)
let head2 = new ListNode(5)
let head3 = new ListNode(1)
let head4 = new ListNode(9)
let head5 = new ListNode(2)
let head6 = new ListNode(5)
let head7 = new ListNode(1)
head.next = head1
head1.next = head2
head2.next = head3
head3.next = head4
head4.next = head5
head5.next = head6
head6.next = head7
console.log(nextLargerNodes(head))
// @lc code=end

