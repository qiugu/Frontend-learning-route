module.exports = function(content) {
  console.log('a-loader ->');
  return `module.exports = '${content} a-loader'`;
}
