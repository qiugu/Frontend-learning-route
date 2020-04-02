const { IpcMessenger } = require('./ipc');
const webpack = require('webpack');

const ipc = new IpcMessenger();

function getTimeMessage(timer) {
  let time = Date.now() - timer;

  if (time >= 1000) {
    time /= 1000;
    time = Math.round(time);
    time += 's';
  } else {
    time += 'ms';
  }

  return ` (${time})`;
}

module.exports = class DashboardPlugin {
  constructor(options) {
    this.type = options.type;
    this.watching = false;
    this.autoDisconnect = !options.keepAlive;
  }

  apply(compiler) {
    console.log('DashboardPlugin执行了----------------------------');
    let sendData = this.sendData;
    let timer;

    let assetSources = new Map();
    if (!sendData) {
      sendData = data => ipc.send({
        webpackDashBoardData: {
          type: this.type,
          value: data
        }
      })
    }

    let progressTime = Date.now();
    const progressPlugin = new webpack.ProgressPlugin((percent, msg) => {
      const time = Date.now();
      if (time - progressTime > 300) {
        sendData([
          {
            type: 'status',
            value: 'Compiling'
          },
          {
            type: 'progress',
            value: percent
          },
          {
            type: 'operations',
            value: msg + getTimeMessage(timer)
          }
        ])
      }
    });

    progressPlugin.apply(compiler);
    compiler.hooks.watchRun.tap('dashboard', c => {
      this.watching = true;
    });
    compiler.hooks.run.tap('dashboard', c => {
      this.watching = false;
    });

    compiler.hooks.compile.tap('dashboard', () => {
      timer = Date.now();

      sendData([
        {
          type: 'status',
          value: 'Compiling'
        },
        {
          type: 'progress',
          value: 0
        }
      ])
    });

    compiler.hooks.afterEmit.tap('dashboard', compilation => {
      assetSources = new Map();
      for (const name in compilation.assets) {
        const asset = compilation.assets[name];
        assetSources.set(name.replace(/\?.*/, ''), asset.source());
      }
    })
  }
}