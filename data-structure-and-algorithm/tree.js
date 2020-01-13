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
