const { EventEmitter } = require('events')

class Application extends EventEmitter {
  listen (eventName, cb) {
    this.on(eventName, cb)
  }

  dispatch(eventName) {
    this.emit(eventName)
  }
}

const app = new Application()

app.on('start', () => {
  console.log('监听start事件')
})



app.emit('start')
app.emit('start')
app.emit('start')
app.emit('start')

app.once('init', () => {
  console.log('监听init事件')
})
app.emit('init')
app.emit('init')
app.emit('init')
