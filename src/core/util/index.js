import { isBuiltInTag, no } from '../../shared/util'
/**
 * 遍历检查组件中的components的名称是否合法
 * @param {object} options 组件实例的选项 
 */
function checkComponents (options) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}

export function validateComponentName (name) {
  const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
    console.warn(`Invalid component name: ${name} . Component names...`)
  }

  // 这里isBuiltIntag方法是指验证组件名是否为内置的组件名slot或者是component
  // 源码config.isReservedTag实际是引用的no方法，总是返回false
  if (isBuiltInTag(name) || false) {
    console.warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + name)
  }
}

export function mergeOptions (parent, child, vm) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }
}