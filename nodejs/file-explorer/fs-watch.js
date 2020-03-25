const fs = require('fs')

const files = fs.readdirSync(process.cwd());
files.forEach(file => {
  fs.watch(`${process.cwd()}/file`, () => {
    console.log(' - ' + file + '  changed!');
  });
})
