function Graph() {
  this.vertexes = []
  this.edges = new Map()
  // 标记访问过的顶点
  this.marked = []
  // 初始化所有顶点标记为未访问
  for (let i = 0; i < this.vertexes.length; i++) {
    this.marked[this.vertexes[i]] = false
  }
}

// 添加顶点
Graph.prototype.addVertexes = function(v) {
  this.vertexes.push(v)
  // 初始化边为空数组
  this.edges.set(v, [])
}

// 添加边
Graph.prototype.addEdges = function(v1, v2) {
  this.edges.get(v1).push(v2)
  this.edges.get(v2).push(v1)
}

Graph.prototype.toString = function() {
  let ret = ''
  for (let i = 0; i < this.vertexes.length; i++) {
    ret += this.vertexes[i] + '->'
    const edges = this.edges.get(this.vertexes[i])
    for (let j = 0; j < edges.length; j++) {
      ret += edges[j] + ' '
    }
    ret += '\n'
  }
  return ret
}

// bfs
Graph.prototype.bfs = function(s) {
  let queue = []
  this.marked[s] = true
  queue.push(s)
  while(queue.length > 0) {
    const v = queue.shift()
    const edges = this.edges.get(v)
    if (edges !== undefined) {
      console.log('Visited vertex: ' + v)
    }
    for (let i = 0; i < edges.length; i++) {
      if (!this.marked[edges[i]]) {
        this.marked[edges[i]] = true
        queue.push(edges[i])
      }
    }
  }
}

// dfs
Graph.prototype.dfs = function(s) {
  this.marked[s] = true
  const edges = this.edges.get(s)
  if (edges !== undefined) {
    console.log('Visited vertex: ' + s)
  }
  for (let i = 0; i < edges.length; i++) {
    if (!this.marked[edges[i]]) {
      this.dfs(edges[i])
    }
  }
}

// 测试
const graph = new Graph()
graph.addVertexes('0')
graph.addVertexes('1')
graph.addVertexes('2')
graph.addVertexes('3')
graph.addVertexes('4')
graph.addEdges('0', '1')
graph.addEdges('0', '2')
graph.addEdges('1', '3')
graph.addEdges('2', '4')
// console.log(graph.toString())
// graph.bfs('0')
graph.dfs('0')
