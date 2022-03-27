# 字符串匹配算法

## BM 算法

```js
const SIZE = 256;
/**
 * 生成坏字符串hash表
 * @param {string[]} 模式字符串
 * @param {number} 模式字符串的长度
 * @param {number[]} 存储字符的散列表
 */
function generateBC(b, m, bc) {
    for (let i = 0; i < SIZE; i++) {
        bc[i] = -1;
    }
    for (let i = 0; i < m; i++) {
        const code = b[i].charCodeAt();
        bc[code] = i;
    }
}

/**
 * BM算法，只考虑坏字符，并且不考虑移动会是负数的情况
 * @param {string[]} a 主字符串
 * @param {number} n 主字符串的长度
 * @param {string[]} b 模式字符串
 * @param {number} m 模式字符串的长度
 */
function bm(a, n, b, m) {
    const bc = new Array(SIZE);
    generateBC(b, m, bc);
    
    // 表示主字符串与模式串对齐的第一个字符
    let i = 0;
    while (i <= n - m) {
        // 表示模式字符串的最后一个位置
        let j;
        // 从模式字符串最后一个位置向前查找坏字符
        for (let j = m - 1; j >= 0; j--) {
            if (a[i+j] !== b[j]) break;
        }
        // 表示模式字符串匹配了主字符串，返回开始匹配的位置
        if (j < 0) {
            return i;
        }
        // 把比较的主字符串向后移动了j - bc[a[i+j].charCodeAt()]个位置
        // 实际相当于将模式字符串向后移动了j - bc[a[i+j].charCodeAt()]个位置
        i = i + (j - bc[a[i+j].charCodeAt()]);
    }
    return -1;
}

/**
 * 存储后缀子串的位置和前缀子串是否和后缀子串匹配的布尔值
 * @param {string[]} b 模式字符串
 * @param {number} m 模式字符串的长度
 * @param {number[]} suffix 后缀子串
 * @param {boolean[]} prefix 前缀子串匹配结果
 */
function generateGS(b, m, suffix, prefix) {
    // 初始化sffix数组和prefix数组分别为-1和false
    for(let i = 0; i < m; i++) {
        suffix[i] = -1;
        prefix[i] = false;
    }
    // 用b[0, i]和b[0, m - 1]求公共后缀子串
    for (let i = 0; i < m - 1; i++) {
        // k表示公共后缀子串的长度
        let j = i, k = 0;
        while(j >= 0 && b[j] === b[m-1-k]) {
            j--;
            k++;
            suffix[k] = j + 1;
        }
        if (j === -1) prefix[k] = true;
    }
}

/**
 * 计算模式字符串移动的距离
 * @param {number} j 坏字符对应模式字符串的下标
 * @param {number} m 模式字符串的长度
 * @param {number[]} suffix 后缀子串
 * @param {boolean[]} prefix 前缀子串匹配结果
 */
function moveByGS(j, m, suffix, prefix) {
    let k = m - 1 - j;
    if (suffix[k] !== -1 ) return j - suffix[k] + 1;
    for(let r = j + 2; r <= m - 1; r++) {
        if(prefix[m-r]) return r;
    }
    return m;
}

/**
 * 完整的BM算法
 * @param {string[]} a 主字符串
 * @param {number} n 主字符串的长度
 * @param {string[]} b 模式字符串
 * @param {number} m 模式字符串的长度
 */
function bm(a, n, b, m) {
    const bc = new Array(SIZE);
    generateBC(b, m, bc);
    const suffix = new Array(m);
    const prefix = new Array(m);
    generateGS(b, m, suffix, prefix);
    
    // 表示主字符串与模式串对齐的第一个字符
    let i = 0;
    while (i <= n - m) {
        // 表示模式字符串的最后一个位置
        let j;
        // 从模式字符串最后一个位置向前查找坏字符
        for (let j = m - 1; j >= 0; j--) {
            if (a[i+j] !== b[j]) break;
        }
        // 表示模式字符串匹配了主字符串，返回开始匹配的位置
        if (j < 0) {
            return i;
        }
        let x = j - bc[a[i+j].charCodeAt()];
        let y = 0;
        if (y < m - 1) {
            y = moveByGS(j, m, suffix, prefix);
        }
        i = i + Math.max(x, y);
    }
    return -1;   
}

```
