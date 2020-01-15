function Node(data) {
  this.data = data
  this.left = null
  this.right = null
}

function BST() {
  this.root = null
}

BST.prototype.insert = function(data) {
  const newNode = new Node(data)

  if (!this.root) {
    this.root = newNode
  } else {
    // 使用递归方法遍历二叉树，插入合适的位置
    insertNode(this.root, newNode)

    // 使用循环的方法
    // let current = this.root
    // let parent
    // while(true) {
    //   parent = current
    //   if (data < current.data) {
    //     current = current.left
    //     if (current === null) {
    //       parent.left = newNode
    //       break
    //     }
    //   } else {
    //     current = current.right
    //     if (current === null) {
    //       parent.right = newNode
    //       break
    //     }
    //   }
    // }
  }
}

// 先序遍历
BST.prototype.preOrder = function() {
  preOrderTraverse(this.root)
}

// 中序遍历
BST.prototype.inOrder = function() {
  inOrderTraverse(this.root)
}

// 后序遍历
BST.prototype.postOrder = function() {
  postOrderTraverse(this.root)
}

BST.prototype.min = function() {
  let node = this.root
  while (true) {
    node = node.left
    if (node.left === null) {
      return node.data
    }
  }
}

BST.prototype.max = function() {
  let node = this.root
  let parent
  while (node !== null) {
    parent = node
    node = node.right
  }
  return parent.data
}

BST.prototype.has = function(data) {
  let node = this.root

  while (node !== null) {
    if (data < node.data) {
      node = node.left
    } else if (data > node.data) {
      node = node.right
    } else {
      return true
    }
  }

  return false
}

BST.prototype.remove = function(data) {
  let current = this.root
  // 保存删除节点的父节点以及删除节点位于父节点的左边还是右边
  let parent, isLeft

  // 查找要删除的值
  while (current.data !== data) {
    parent = current
    if (data < current.data) {
      current = current.left
      isLeft = true
    } else {
      current = current.right
      isLeft = false
    }
  }

  // 如果删除的值不存在
  if (current === null) return false

  // 如果删除的是叶子节点
  if (current.left === null && current.right === null) {
    // 如果删除的节点是根节点
    // 如果删除的节点是父节点的左子节点
    // 如果删除的节点是父节点的右子节点
    if (current === this.root) {
      this.root = null
    } else if (isLeft) {
      parent.left = null
    } else {
      parent.right = null
    }
  }

  // 如果删除的节点只有一个子节点
  else if (current.left === null) {
    if (current === this.root) {
      this.root = current.right
    } else if (isLeft) {
      parent.left = current.right
    } else {
      parent.right = current.right
    }
  }
  else if (current.right === null) {
    if (current === this.root) {
      this.root = current.left
    } else if (isLeft) {
      parent.left = current.left
    } else {
      parent.right = current.left
    }
  }

  // 删除的节点有两个子节点（查找后继节点为例）
  // 需要改变父节点的指向，指向后继节点
  // 需要将后继节点的左子节点指向删除节点的左子节点，
  else {
    const subsequent = getSubsequent(current)
    if (current === this.root) {
      this.root = subsequent
    } else if (isLeft) {
      parent.left = subsequent
    } else {
      parent.right = subsequent
    }
    subsequent.left = current.left
  }
}

function insertNode(current, newNode) {
  if (newNode.data < current.data) {
    if (current.left === null) {
      current.left = newNode
    } else {
      insertNode(current.left, newNode)
    }
  } else {
    if (current.right === null) {
      current.right = newNode
    } else {
      insertNode(current.right, newNode)
    }
  }
}

function preOrderTraverse(node) {
  if (node !== null) {
    console.log('preOrder:' + node.data)
    preOrderTraverse(node.left)
    preOrderTraverse(node.right)
  }
}

function inOrderTraverse(node) {
  if (node !== null) {
    inOrderTraverse(node.left)
    console.log('inOrder:' + node.data)
    inOrderTraverse(node.right)
  }
}

function postOrderTraverse(node) {
  if (node !== null) {
    postOrderTraverse(node.left)
    postOrderTraverse(node.right)
    console.log('postOrder:' + node.data)
  }
}

// 查找当前节点的后继节点
// 使用后继节点来替换删除的节点，并改变节点指向
function getSubsequent(node) {
  // 保存后继节点、后继节点的父节点
  let subsequentParent
  let subsequent = node
  let current = node.right

  while (current !== null) {
    subsequentParent = subsequent
    subsequent = current
    current = current.left
  }

  // 如果查找的后继节点不是需要删除节点的右节点
  if (subsequent !== node.right) {
    // 将后继节点的父节点的左子节点指向后继节点的右子节点
    subsequentParent.left = subsequent.right
    // 将后继节点的右子节点指向删除节点的右子节点
    subsequent.right = node.right
  }

  return subsequent
}

// 测试
const bst = new BST()
bst.insert(23)
bst.insert(45)
bst.insert(16)
bst.insert(37)
bst.insert(3)
bst.insert(99)
bst.insert(22)
bst.preOrder(23)
bst.inOrder(23)
bst.postOrder(23)
console.log(bst.min())
console.log(bst.max())
console.log(bst.has(45))
