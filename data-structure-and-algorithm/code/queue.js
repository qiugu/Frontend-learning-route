function Queue () {
  this.data = []

  Queue.prototype.enqueue = function (ele) {
    this.data.push(ele)
  }

  Queue.prototype.dequeue = function () {
    return this.data.shift()
  }

  Queue.prototype.front = function () {
    return this.data[0]
  }

  Queue.prototype.isEmpty = function () {
    return this.data.length === 0
  }

  Queue.prototype.size = function () {
    return this.data.length
  }

  Queue.prototype.toString = function () {
    let ret = ''
    for (let i = 0; i < this.data.length; i++) {
      ret += this.data[i] + ''
    }
    return ret
  }
}

// 击鼓传花
function passGame(list, num) {
  const queue = new Queue()
  // 将成员入列
  list.forEach(i => {
    queue.enqueue(i)
  })
  // 当队列成员数量大于1的时候，继续传花
  while (queue.size() > 1) {
    // 将规定num前面的成员放入到队列尾部
    for (let i = 0;i < num - 1;i++) {
      queue.enqueue(queue.dequeue())
    }
    // 剩下正好是当前规定num的成员淘汰
    queue.dequeue()
    console.log(queue.data)
  }
  return queue.front()
}

const members = ['a','b','c','d','e']
// console.log(passGame(members,10))

// 优先级队列
function PriorityQueue () {
  function QueueElem (elem, priority) {
    this.elem = elem
    this.priority = priority
  }
  this.data = []

  PriorityQueue.prototype.enqueue = function (elem, priority) {
    const priorityElem = new QueueElem(elem, priority)

    // 优先级队列长度为0时，直接将元素添加进去
    if (this.data.length === 0) {
      this.data.push(priorityElem)
    } else {
      let isAdd = false
      for (let i = 0; i < this.data.length;i++) {
        // 如果插入的元素的优先级比当前的元素高，那么就插入当前元素的前面的位置
        if (priority < this.data[i].priority) {
          this.data.splice(i, 0, priorityElem)
          isAdd = true
          break
        }
      }

      // 如果插入的元素比当前队列中的所有的元素优先级都要低，那么就插入队尾
      if (!isAdd) {
        this.data.push(priorityElem)
      }
    }
  }

  PriorityQueue.prototype.dequeue = function () {
    return this.data.shift()
  }

  PriorityQueue.prototype.front = function () {
    return this.data[0]
  }

  PriorityQueue.prototype.isEmpty = function () {
    return this.data.length === 0
  }

  PriorityQueue.prototype.size = function () {
    return this.data.length
  }

  PriorityQueue.prototype.toString = function () {
    let ret = ''
    for (let i = 0; i < this.data.length; i++) {
      ret += this.data[i].elem + this.data[i].priority + '\n'
    }
    return ret
  }
}

const pq = new PriorityQueue()
pq.enqueue('abc',920)
pq.enqueue('a2c',2)
pq.enqueue('adc',1020)
pq.enqueue('ccc',200)
pq.enqueue('9bc',220)
pq.enqueue('rbc',10)

console.log(pq.toString())
