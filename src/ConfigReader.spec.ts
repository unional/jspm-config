import { resolve } from 'path'
import ava from 'ava'
import fixture from 'ava-fixture'

import { ConfigReader } from './ConfigReader'

const ftest = fixture(ava, '../fixtures/cases')

ftest('ConfigReader', 'quick-empty', (t, cwd) => {
  const target = new ConfigReader()
  return target.read(resolve(cwd, 'jspm.config.js'))
    .then(config => {
      t.deepEqual(config, {
        browserConfig: { baseURL: '/' },
        packageConfigPaths: [],
        map: {},
        packages: {}
      })

      target.close()
    })
})
