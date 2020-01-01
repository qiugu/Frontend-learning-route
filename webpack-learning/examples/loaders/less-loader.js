const less = require('less')

module.exports = function loader (code) {
  let css
  less.render(code, function(err, code) {
    css = code.css
  })
  css = css.replace(/\n/g,'\\n')
  return css
}