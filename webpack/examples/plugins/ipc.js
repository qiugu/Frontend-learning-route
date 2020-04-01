const ipc = require('node-ipc');

const DEFAULT_OPTIONS = {
  networkId: 'dashboard',
  autoConnect: true,
  disconnectIdle: false,
  idleTimeout: 3000,
  namespaceOnProject: true
};

exports.IpcMessenger = class IpcMessenger {
  constructor(options = {}) {
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    ipc.config.id = this.id = options.networkId;
    ipc.config.retry = 1500;
    ipc.config.silent = true;

    this.connected = false;
    this.connecting = false;
    this.disconnecting = false;
    this.listeners = [];
    this.queue = null;
    this.options = options;
  }

  checkConnection() {
    if (!ipc.of[this.id]) {
      this.connected = false;
    }
  }

  send(data, type = 'message') {
    this.checkConnection();
    if (this.connected) {
      ipc.of[this.id].emit(type, data);
    } else {
      this.queue.push(data);
    }
  }

  connect() {
    this.checkConnection();
    if (this.connected || this.connecting) return;
    this.connecting = true;
    this.disconnecting = false;
    ipc.connectTo(this.id, () => {
      this.connected = true;
      this.connecting = false;
      this.queue && this.queue.forEach(data => this.send(data));
      this.queue = null;

      ipc.of[this.id].on('message', this._onMessage);
    })
  }

  _onMessage(data) {
    this.listeners.forEach(fn => {
      fn(data);
    })
  }
}