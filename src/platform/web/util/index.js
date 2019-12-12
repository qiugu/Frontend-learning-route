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

let div
function getShouldDecode (href) {
  div = div || document.createElement('div')
  div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`
  return div.innerHTML.indexOf('$#10;') > 0
}

export const inBrowser = typeof window !== 'undefined'

export const shouldDecodeNewlines = typeof window !== 'undefined' ? getShouldDecode(false) : false
export const shouldDecodeNewlinesForHref = typeof window !== 'undefined' ? getShouldDecode(false) : false