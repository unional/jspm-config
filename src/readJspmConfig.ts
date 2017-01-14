'use strict'
import extend = require('xtend')

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

    // Workaround "Object is possibly 'undefined'"" error
    // `process.send` is defined only in child process
    // There is no good way to indicate this is running under child process thus this method exists
    ; (process as any).send(config)
})
