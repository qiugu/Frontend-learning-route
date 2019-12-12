/**
 * 验证输入的字符串是否与内置组件名重名
 * @param {string} str 检测的内置组件的名称 
 * @param {boolean} expectsLowerCase 是否需要转换成小写
 * @returns 返回一个方法来验证输入的字符串
 */
export function makeMap (str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0;i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : map[val]
}

export const isBuiltInTag = makeMap('slot,component', true)

/**
 * 总是返回false
 * @param {object} a 可选参数
 * @param {object} b 可选参数
 * @param {object} c 可选参数
 */
export const no = (a,b,c) => false

/**
 * 删除数组中指定的某项
 * @param {array} arr 要删除的数组
 * @param {any} item 指定的某项
 */
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

// 空方法
export function noop () {}

// 输入值，返回相同的值
export const identity = (_) => _

// 混入属性到目标对象中
export function extend (to, from) {
  for (const key in from) {
    to[key] = from[key]
  }
  return to
}