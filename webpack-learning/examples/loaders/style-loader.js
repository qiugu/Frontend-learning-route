module.exports = function loader (code) {
  const styleStr = `
    const style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(code)}
    document.head.appendChild(style)
  `
  return styleStr
}