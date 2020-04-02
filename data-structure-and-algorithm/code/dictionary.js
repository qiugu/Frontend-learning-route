function Dictionary() {
  this.data = {}
}

Dictionary.prototype.has = function (element) {
  return this.data.hasOwnProperty(element)
}

Dictionary.prototype.add = function (element) {
  if (this.has(element)) return false
  this.data[element] = element
  return true
}

Dictionary.prototype.delete = function (element) {
  if (!this.has(element)) return false
  delete this.data[element]
  return true
}

Dictionary.prototype.clear = function () {
  this.data = {}
}

Dictionary.prototype.size = function () {
  return Object.keys(this.data).length
}

Dictionary.prototype.values = function () {
  return Object.keys(this.data)
}
