'use strict'
const extend = require('xtend')

process.on('message', (filePath: string) => {
  let g: any = global
  let config: any

  g.System = {
    config(conf: Object): any {
      config = extend(config, conf)
    }
  }
  g.SystemJS = g.System

  require(filePath)
  process.send(config)
})
