import { existsSync } from 'fs'
import { fork, ChildProcess } from 'child_process'
import Promise = require('any-promise')

/**
 * Read jspm config in separate process.
 * Should call `close()` when you are done.
 */
export class ConfigReader {
  private child: ChildProcess
  private timer: NodeJS.Timer

  constructor() {
    this.child = fork('./readJspmConfig')
    this.startTimeBomb()
  }

  read(filePath: string): Promise<any> {
    this.restartTimeBomb()
    if (!existsSync(filePath)) {
      return Promise.resolve()
    }
    else {
      return new Promise((resolve, reject) => {
        this.child.on('message', (config: any) => {
          resolve(config)
        })

        this.child.send(filePath)
      })
    }
  }

  close() {
    this.stopTimeBomb()
    this.child.kill()
  }

  private startTimeBomb() {
    this.timer = setTimeout(
      () => {
        this.child.kill()
      },
      10000)
  }
  private stopTimeBomb() {
    clearTimeout(this.timer)
  }

  private restartTimeBomb() {
    this.stopTimeBomb()
    this.startTimeBomb()
  }
}
