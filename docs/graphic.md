# 图

## 岛屿数量

深度优先遍历

```js
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    const m = grid.length;
    const n = grid[0].length;
    // dfs(x,y) 表示x，y
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === '0') return false;
        // 遍历过的节点修改为'0'，防止重复遍历
        grid[i][j] = '0';
        dfs(i+1, j);
        dfs(i-1, j);
        dfs(i, j+1);
        dfs(i, j-1);
    };
    let ans = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                // 记录岛屿数量
                ans++;
                // 从当前岛屿开始深度优先遍历
                dfs(i, j);
            }
        }
    }

    return ans;
};
```

## 腐烂的橘子

广度优先搜索

```js
var orangesRotting = function(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const dirs = [[-1,0],[1,0],[0,-1],[0, 1]];
    // 经历多少分钟
    let ans = 0;
    // 新鲜橘子的数量
    let count = 0;
    // 存储腐烂橘子的坐标队列，以该坐标为起点，遍历四个方向上的橘子
    const q = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                count++;
            } else if (grid[i][j] === 2) {
                q.push([i, j]);
            }
        }
    }
    while (count > 0 && q.length) {
        ans++;
        const len = q.length;
        // 遍历腐烂橘子的队列
        for (let i = 0; i < len; i++) {
            // 取出队首的腐烂橘子的坐标
            const tmp = q.shift();
            // 朝四个方向遍历
            for (const [x, y] of dirs) {
                const row = tmp[0] + x;
                const col = tmp[1] + y;
                if (row >= 0 && row < m && col >= 0 && col < n && grid[row][col] === 1) {
                    // 开始腐烂
                    grid[row][col] = 2;
                    // 新鲜橘子数量减1
                    count--;
                    // 当前腐烂橘子入列
                    q.push([row, col]);
                }
            }
        }
    }
    // count 大于0 表示还有新鲜橘子，返回-1
    return count > 0 ? -1 : ans;
};
```