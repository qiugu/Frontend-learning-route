// 构建堆
function Heap () {
  this.data = [];
  this.size = this.data.length;
}

Heap.prototype.getLeftChildIndex = function (index) {
  return 2 * index + 1;
}

Heap.prototype.getRightChildIndex = function (index) {
  return 2 * index + 2;
}

Heap.prototype.getParentIndex = function (index) {
  return (index - 1) >> 1;
}

Heap.prototype.hasParent = function (index) {
  return this.getParentIndex(index) >= 0;
}

Heap.prototype.hasLeftChild = function (index) {
  return this.getLeftChildIndex(index) < this.size;
}

Heap.prototype.hasRightChild = function (index) {
  return this.getRightChildIndex(index) < this.size;
}

Heap.prototype.swap = function (index1, index2) {
  const temp = this.data[index1];
  this.data[index1] = this.data[index2];
  this.data[index2] = temp;
}

Heap.prototype.add = function (node) {
  this.data.push(node);
  this.heapifyUp();
  return this;
}

Heap.prototype.remove = function (node) {}

Heap.prototype.heapifyUp = function () {}

Heap.prototype.heapifyDown = function () {}
