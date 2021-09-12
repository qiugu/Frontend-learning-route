function Stack() {
  // 保存栈中的元素
  this.data = []

  // 元素入栈
  Stack.prototype.push = function (element) {
    this.data.push(element)
  }

  // 元素出栈
  Stack.prototype.pop = function () {
    return this.data.pop()
  }

  // 查看栈顶元素
  Stack.prototype.peek = function () {
    return this.data[this.data.length - 1] || null
  }

  // 判断栈是否为空
  Stack.prototype.isEmpty = function () {
    return this.data.length === 0
  }

  // 获取栈中元素的个数
  Stack.prototype.size = function () {
    return this.data.length
  }

  // 查看栈中的元素
  Stack.prototype.toString = function () {
    let ret = ''
    for (let i = 0; i < this.data.length; i++) {
      ret += this.data[i] + ''
    }
    return ret
  }
}

// const stack = new Stack()
// stack.push(200)
// stack.push(200)
// stack.push(220)
// stack.push(100)
// stack.push(300)
// stack.push(400)
// stack.pop()
// stack.pop()
// stack.pop()
// stack.pop()
// stack.pop()
// stack.pop()
// console.log(stack.size())
// console.log(stack.peek())
// console.log(stack.isEmpty())
// console.log(stack)

/**
 * 十进制转二进制的利用栈的数据结构
 * @param {number} decNumer 需要进行转换的数字
 */
function dec2bin(decNumer) {
  const stack = new Stack()
  while (decNumer > 0) {
    stack.push(decNumer % 2)
    decNumer = Math.floor(decNumer / 2)
  }
  let binStr = ''
  while (!stack.isEmpty()) {
    binStr += stack.pop() 
  }
  return binStr
}

console.log(dec2bin(100))
console.log(dec2bin(1000))
console.log(dec2bin(10))
