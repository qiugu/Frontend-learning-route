export function query (el) {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    // 如果传入的el元素不存在，提出警告，并且新建一个div的元素
    if (!selected) {
      process.env.NODE_ENV !== 'production' && console.warn('Cannot find element: ' + el)
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}