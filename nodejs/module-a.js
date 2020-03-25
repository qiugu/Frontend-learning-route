const add = (n1,n2) => n1 + n2
const minus = (n1, n2) => n1 - n2
exports.minus = minus
// module.exports.add = add
// exports只是module.exports的一个引用，当module.exports的引用指向一个新地址的时候，那么exports的引用无法导出了
// 并且一下这种写法也是无法导出的
/**
 * exports = {
 *  add: add
 * }
 */
module.exports = add
