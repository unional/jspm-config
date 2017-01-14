import { resolve } from 'path'
import test from 'ava'
import fixture from 'ava-fixture'

import { ConfigReader } from './ConfigReader'

const ftest = fixture(test, './fixtures/cases')

ftest('ConfigReader', 'quick-empty', (t, d) => {
  const target = new ConfigReader()
  return target.read(resolve(d.casePath, 'jspm.config.js'))
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
