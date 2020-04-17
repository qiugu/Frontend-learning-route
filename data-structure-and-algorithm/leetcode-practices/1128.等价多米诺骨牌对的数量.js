/*
 * @lc app=leetcode.cn id=1128 lang=javascript
 *
 * [1128] 等价多米诺骨牌对的数量
 */

// @lc code=start
/**
 * @param {number[][]} dominoes
 * @return {number}
 */
var numEquivDominoPairs = function(dominoes) {
  let res = 0;
  for(let i = 0; i < dominoes.length; i++) {
    for(let j = i + 1; j < dominoes.length; j++) {
      if (
        (dominoes[i][0] === dominoes[j][0]
        && dominoes[i][1] === dominoes[j][1])
        || (dominoes[i][0] === dominoes[j][1]
        && dominoes[i][1] === dominoes[j][0])
      ) {
        res++;
      }
    }
  }
  return res;
};
// @lc code=end

