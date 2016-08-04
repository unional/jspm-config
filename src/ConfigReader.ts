import { existsSync } from 'fs'
import { fork, ChildProcess } from 'child_process'

export class ConfigReader {
  private child: ChildProcess

  constructor() {
    this.child = fork('./readJspmConfig.js')
  }

  read(filePath: string): Promise<any> {
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
    this.child.kill()
  }
}
