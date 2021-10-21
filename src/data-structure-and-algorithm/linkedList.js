/**
 * 链表节点
 * @param {any} element 链表节点保存数据
 */
function Node(element) {
  this.element = element
  this.next = null
}

// 单向链表
function LinkedList() {
  this.head = null
  this.length = 0
}

LinkedList.prototype.append = function (element) {
  const newNode = new Node(element)
  if (this.length === 0) {
    this.head = newNode
  } else {
    // 从头部开始，判断下一个节点是否为空，如果为空，则代表当前节点为链表的最后一个节点
    // 则把当前节点的next引用赋给新节点
    let currentNode = this.head
    while (currentNode.next) {
      currentNode = currentNode.next
    }
    currentNode.next = newNode
  }
  this.length++
}

LinkedList.prototype.toString = function () {
  let currentNode = this.head
  let lists = ''
  while (currentNode) {
    lists += currentNode.element + ' -> '
    currentNode = currentNode.next
  }
  return lists.slice(0, -4)
}

// 插入到指定元素的后面
// linkedList.prototype.insert = function (element) {
//   const newNode = new Node(element)
//   let currentNode = this.head
//   while (currentNode.element !== element) {
//     currentNode = currentNode.next
//   }
//   newNode.next = currentNode.next
//   currentNode.next = newNode
// }

/**
 * @param {number} position 要插入的元素位置
 * @param {element} element 要插入链表的元素
 */
LinkedList.prototype.insert = function (position, element) {
  if (position < 0 || position > this.length) return false
  const newNode = new Node(element)
  if (position === 0) {
    newNode.next = this.head
    this.head = newNode
  } else {
    // 从1开始计数，因为position为0时的情况上面已经处理过了
    // let count = 0
    // let previous = null
    // let currentNode = this.head
    // while (count++ < position) {
    //   previous = currentNode
    //   currentNode = currentNode.next
    // }
    // newNode.next = currentNode
    // previous.next = newNode

    let count = 1
    let currentNode = this.head
    while (count++ < position) {
      currentNode = currentNode.next
    }
    newNode.next = currentNode.next
    currentNode.next = newNode
  }
  this.length++
  return true
}

LinkedList.prototype.get = function (position) {
  if (position < 0 || position > this.length - 1) return false
  let count = 0
  let currentNode = this.head
  while (count++ < position) {
    currentNode = currentNode.next
  }
  return currentNode
}

LinkedList.prototype.indexOf = function (element) {
  let currentNode = this.head
  let index = 0
  while (currentNode) {
    if (currentNode.element === element) {
      return index
    }
    currentNode = currentNode.next
    index++
  }
  return -1
}

LinkedList.prototype.update = function (position, element) {
  if (this.get(position)) {
    const updateNode = this.get(position)
    updateNode.element = element
    return true
  }
  return false
}

LinkedList.prototype.removeAt = function (position) {
  if (position < 0 || position > this.length - 1) return false
  let currentNode = this.head
  if (position === 0) {
    this.head = this.head.next
  } else {
    let count = 0
    let previous = null
    while (count++ < position) {
      previous = currentNode
      currentNode = currentNode.next
    }
    previous.next = currentNode.next
  }
  this.length--
  return true
}

LinkedList.prototype.remove = function (element) {
  const index = this.indexOf(element)
  return this.removeAt(index)
}


// 单向链表测试
const linkedList = new LinkedList()
linkedList.append(1)
linkedList.append(3)
linkedList.insert(1,2);
linkedList.get(1);
linkedList.removeAt(1);
console.log(linkedList.get(1));
// console.log(linkedList.toString())
// linkedList.insert(0, 'stu')
// linkedList.insert(7, 'wxy')
// console.log(linkedList.indexOf('stu'))
// console.log(linkedList.update(0, 'aaa'))
// console.log(linkedList.update(7, 'aaa'))
// linkedList.removeAt(0)
// linkedList.removeAt(1)
// linkedList.remove('abc')
console.log(linkedList.toString())


// 双向链表
function DNode (element) {
  this.element = element
  this.next = null
  this.prev = null
}

function DoublyLinkedList () {
  this.head = null
  this.tail = null
  this.length = 0
}

DoublyLinkedList.prototype.append = function (element) {
  const newNode = new DNode(element)
  if (this.length === 0) {
    this.head = newNode
    this.tail = newNode
  } else {
    let currentNode = this.head
    while (currentNode.next) {
      currentNode = currentNode.next
    }
    currentNode.next = newNode
    newNode.prev = currentNode
    this.tail = newNode
  }
  this.length++
}

DoublyLinkedList.prototype.toString = function () {
  let currentNode = this.head
  let lists = ''
  while (currentNode) {
    lists += currentNode.element + ' <--> '
    currentNode = currentNode.next
  }
  return lists.slice(0, -5)
}

DoublyLinkedList.prototype.insert = function (position, element) {
  const newNode = new DNode(element)
  if (position < 0 || position > this.length) return false
  if (this.length === 0) {
    this.head = newNode
    this.tail = newNode
  } else {
    if (position === 0) {
      newNode.next = this.head
      this.head.prev = newNode
      this.head = newNode
    } else if (position === this.length) {
      this.tail.next = newNode
      newNode.prev = this.tail
      this.tail = newNode
    } else {
      let currentNode = this.head
      let count = 0
      while (count++ < position) {
        currentNode = currentNode.next
      }
      newNode.next = currentNode
      newNode.prev = currentNode.prev
      currentNode.prev.next = newNode
      currentNode.prev = newNode
    }
  }
  this.length++
  return true
}

DoublyLinkedList.prototype.get = function (position) {
  if (position < 0 || position > this.length - 1) return false
  let count = 0
  let currentNode = this.head
  while (count++ < position) {
    currentNode = currentNode.next
  }
  return currentNode
}

DoublyLinkedList.prototype.indexOf = function (element) {
  let currentNode = this.head
  let index = 0
  while (currentNode) {
    if (currentNode.element === element) {
      return index
    }
    currentNode = currentNode.next
    index++
  }
  return -1
}

DoublyLinkedList.prototype.update = function (position, element) {
  if (position < 0 || position > this.length - 1) return false
  let currentNode = this.head
  let index = 0
  while (index++ < position) {
    currentNode = currentNode.next
  }
  currentNode.element = element
  // 也可以使用get方法找到相应位置的元素，然后替换数据值
  return true
}

DoublyLinkedList.prototype.removeAt = function (position) {
  if (position < 0 || position > this.length - 1) return null
  let currentNode = this.head
  // 删除元素的时候，当链表长度为0时返回null
  if (this.length === 1) {
    this.head = null
    this.tail = null
  } else {
    if (position === 0) {
      this.head.next.prev = null
      this.head = this.head.next
    } else if (position === this.length - 1) {
      this.tail.prev.next = null
      this.tail = this.tail.prev
    } else {
      let index = 0
      while (index++ < position) {
        currentNode = currentNode.next
      }
      currentNode.prev.next = currentNode.next
      currentNode.next.prev = currentNode.prev
    }
  }
  this.length--
  return currentNode.element
}

DoublyLinkedList.prototype.remove = function (element) {
  const index = this.indexOf(element)
  return this.removeAt(index)
}

// const doublyLinkedList = new DoublyLinkedList()
// doublyLinkedList.append('a')
// doublyLinkedList.append('b')
// doublyLinkedList.append('c')
// doublyLinkedList.append('d')
// doublyLinkedList.append('e')
// console.log(doublyLinkedList.toString())
// doublyLinkedList.insert(0,'g')
// doublyLinkedList.insert(3,'f')
// doublyLinkedList.insert(7,'h')
// console.log(doublyLinkedList.get(8))
// console.log(doublyLinkedList.toString())
// console.log(doublyLinkedList.indexOf('c'))
// console.log(doublyLinkedList.removeAt(0))
// console.log(doublyLinkedList.toString())
