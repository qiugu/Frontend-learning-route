export function stateMixin (Vue) {
  const dataDef = {}
  dataDef.get = function () {
    return this._data
  }
  const propsDef = {}
  propsDef.get = function () {
    return this._props
  }

  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      console.warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () {
      console.warn(`$props is readonly.`, this)
    }
  }

  // 在Vue的原型上添加了$data和$props属性，并且设置了getter和setter方法
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)
}