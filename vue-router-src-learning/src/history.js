export default class History {
  listen (callback) {
    window.addEventListener('hashchange',function() {
      callback && callback(window.location.hash)
    })
  }
}