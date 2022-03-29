#! /usr/bin/env node

const path = require('path')
const config = require(path.resolve('webpack.config.js'))
const Compiler = require('../lib/Compiler.js')

const compiler = new Compiler(config)
compiler.hooks.entryOptions.call()
compiler.run()
