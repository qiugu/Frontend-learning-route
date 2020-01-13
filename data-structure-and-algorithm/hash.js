function HashTable () {
  // 存储数据的数组
  this.storage = []
  // 哈希表中已经存在的元素个数
  this.count = 0
  // 哈希表的初始容量
  this.capacity = 7
}

// 哈希函数
HashTable.prototype.hashFn = function (str, size) {
  let hashCode = 0
  for (let i = 0; i < str.length; i++) {
    hashCode = 37 * hashCode + str.charCodeAt(i) 
  }
  return hashCode % size
}

HashTable.prototype.put = function (key, val) {
  const index = this.hashFn(key, this.capacity)
  let bucket = this.storage[index]

  if (!bucket) {
    bucket = []
    this.storage[index] = bucket
  }

  for (let i = 0; i < bucket.length; i++) {
    const tuple = bucket[i]
    if (tuple[0] === key) {
      tuple[1] = val
      return
    }
  }

  bucket.push([key, val])
  this.count++

  // 如果存储数据的数量大于哈希表容量的0.75，则容量进行扩容，扩容后的容量为质数
  if (this.count > this.capacity * 0.75) {
    const prime = this.getPrime(this.capacity * 2)
    this.capacity(prime)
  }
}

HashTable.prototype.get = function (key) {
  const index = this.hashFn(key, this.capacity)

  const bucket = this.storage[index]

  if (!bucket) return null

  for (let i = 0; i < bucket.length; i++) {
    const tuple = bucket[i]
    if (tuple[0] === key) {
      return tuple[1]
    }
  }

  return null
}

HashTable.prototype.remove = function (key) {
  const index = this.hashFn(key, this.capacity)

  const bucket = this.storage[index]

  if (!bucket) return null

  for (let i = 0; i < bucket.length; i++) {
    const tuple = bucket[i]
    if (tuple[0] === key) {
      bucket.splice(i, 1)
      this.count--

      // 如果存储数据的数量小于哈希表容量的0.25，则减少容量，减少后的容量为一个质数
      if (this.capacity > 7 && this.count < this.capacity * 0.25) {
        const prime = this.getPrime(Math.floor(this.capacity / 2))
        this.capacity(prime)
      }

      return tuple[1]
    }
  }

  return null
}

HashTable.prototype.capacity = function (capacity) {
  const oldStorage = this.storage
  this.storage = []
  this.count = 0
  this.capacity = capacity

  for (let i = 0; i < oldStorage.length; i++) {
    const bucket = oldStorage[i]

    if (!bucket) continue

    for (let j = 0; j < bucket.length;j++) {
      const tuple = bucket[j]
      this.put(tuple[0], tuple[1])
    }
  }
}

// 判断一个数是否是质数
HashTable.prototype.isPrime = function (num) {
  // 如果一个数可以被因式分解的话，则这两个相乘的数字，
  // 其中一个一定小于等于这个数，另外一个一定大于等于这个数
  // 所以我们只要取这个数的平方根，计算2到平方根之间是否可以被整除
  const temp = parseInt(Math.sqrt(num))

  for (let i = 2; i < temp; i++) {
    if (num % i === 0) {
      return false
    }
  }

  return true
}

HashTable.prototype.getPrime = function (num) {
  while (!this.isPrime(num)) {
    num++
  }
  return num
}

// 测试
const hashtable = new HashTable()
hashtable.put('asdasd', 'aaa')
hashtable.put('qweeqw', 'bbb')
hashtable.put('aseryy', 'ccc')
hashtable.put('azxvxz', 'ddd')

console.log(hashtable.get('qweeqw'))
console.log(hashtable.remove('qweeqw'))
console.log(hashtable.get('qweeqw'))
