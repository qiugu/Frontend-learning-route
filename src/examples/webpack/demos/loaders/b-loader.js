module.exports = function(content) {
  console.log('b-loader ->');
  return `${content} b-loader ->`;
}