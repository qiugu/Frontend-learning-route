/*
 * @lc app=leetcode.cn id=1410 lang=javascript
 *
 * [1410] HTML 实体解析器
 */

// @lc code=start
/**
 * @param {string} text
 * @return {string}
 */
var entityParser = function(text) {
  const map = {
    '&quot;': '\"',
    '&apos;': '\'',
    '&amp;': '&',
    '&gt;': '>',
    '&lt;': '<',
    '&frasl;': '/'
  };
  let res = '', i = 0, len = text.length;
  while(i < len) {
    let begin = -1;
    while(i < len && text[i] !== '&') res += text[i++];
    begin = i;
    while(i < len && text[i] !== ';') i++;
    if (begin === len) break;
    else if (i === len) res += text.substring(begin, i);
    else {
      let match = map[text.substring(begin, i + 1)];
      if (!match) res += text.substring(begin, i + 1);
      else res += match;
    }
    i++;
  }
  return res;
};
// @lc code=end

