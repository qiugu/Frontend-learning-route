function CustomSet () {
  this.element = {}
}

CustomSet.prototype.has = function (element) {
  return this.element.hasOwnProperty(element)
}

CustomSet.prototype.add = function (element) {
  if (this.has(element)) return false
  this.element[element] = element
  return true
}

CustomSet.prototype.delete = function (element) {
  if (!this.has(element)) return false
  delete this.element[element]
  return true
}

CustomSet.prototype.clear = function () {
  this.element = {}
}

CustomSet.prototype.size = function () {
  return Object.keys(this.element).length
}

CustomSet.prototype.values = function () {
  return Object.keys(this.element)
}

// 并集
CustomSet.prototype.union = function (another) {
  const elems = this.values()
  const ret = new CustomSet()
  for (let i = 0; i < elems.length; i++) {
    ret.add(elems[i])
  }
  const anotherValues = another.values()
  for (let i = 0; i < anotherValues.length; i++) {
    ret.add(anotherValues[i])
  }
  return ret
}

// 交集
CustomSet.prototype.intersection = function (another) {
  const elems = this.values()
  const ret = new CustomSet()
  for (let i = 0; i < elems.length; i++) {
    if (another.has(elems[i])) {
      ret.add(elems[i])
    }
  }
  return ret
}

// 补集
CustomSet.prototype.complement = function (another) {
  const elems = this.values()
  const ret = new CustomSet()
  for (let i = 0; i < elems.length; i++) {
    if (!another.has(elems[i])) {
      ret.add(elems[i])
    }
  }
  return ret
}

// 子集
CustomSet.prototype.sub = function (another) {
  const ret = new CustomSet()
  const elems = this.values()
  for (let i = 0; i < elems.length; i++) {
    if (!another.has(elems[i])) {
      return false
    }
  }
  return true
}

// 测试
const set = new CustomSet()
// set.add('a')
// set.add('b')
set.add('c')
set.add('d')
const set1 = new CustomSet()
set1.add('c')
set1.add('d')
set1.add('e')
set1.add('f')
// console.log(set.union(set1).values())
console.log(set.sub(set1))
