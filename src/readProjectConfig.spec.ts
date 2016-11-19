import test from 'ava'
import fixture from 'ava-fixture'

import { readProjectConfig, ConfigError } from './index'

const ftest = fixture(test, '../fixtures/cases')

ftest('readProjectConfig', 'custom-config-empty', (t, casePath) => {
  return readProjectConfig({ cwd: casePath })
    .then(projectInfo => {
      t.deepEqual(
        projectInfo,
        {
          jspmPackageJson: {
            directories: {
              baseURL: 'www',
              packages: 'www/cust_jspm_packages'
            },
            configFiles: {
              jspm: 'jspm.config.js',
              'jspm:dev': 'jspm.dev.js',
              'jspm:browser': 'jspm.browser.js',
              'jspm:node': 'jspm.node.js'
            },
            name: 'my-module',
            main: 'app.js',
            version: '0.1.2',
            browser: 'browser info',
            typings: 'dist/app.d.ts',
            browserTypings: 'dist/browser/app.d.ts'
          },
          jspmConfigs: {
            jspm: { packageConfigPaths: [], map: {}, packages: {} },
            browser: {
              baseURL: '/',
              paths: { 'app/': 'src/' }
            },
            dev: {
            },
            node: { paths: { 'app/': 'src/' } }
          },
          dependenciesJson: {}
        },
        'should work with full custom configuration')
    })
})

ftest('readyProjectConfig', 'empty', (t, casePath) => {
  return readProjectConfig({ cwd: casePath })
    .then(projectInfo => {
      t.deepEqual(projectInfo, undefined, 'should return undefined when the folder is empty')
    })
})

ftest('readProjectConfig', 'non-jspm-empty', (t, cwd) => {
  t.throws(readProjectConfig({ cwd: cwd }), ConfigError, 'This is not a jspm project')
})

ftest('custom baseURL', 'custom-baseurl', (t, cwd) => {
  return readProjectConfig({ cwd })
    .then(projectInfo => {
      t.deepEqual(projectInfo, {
        jspmPackageJson: {
          main: 'index.ts',
          name: 'app',
          directories: {
            baseURL: 'src'
          },
          dependencies: {
            'make-error': 'npm:make-error@^1.2.1'
          }
        },
        jspmConfigs: {
          jspm: {
            paths: {
              'github:': 'jspm_packages/github/',
              'npm:': 'jspm_packages/npm/',
              'app/': 'src/'
            },
            browserConfig: {
              'baseURL': '.'

            },
            packageConfigPaths: [
              'github:*/*.json',
              'npm:@*/*.json',
              'npm:*.json'

            ],
            map: {
              'make-error': 'npm:make-error@1.2.1'
            }
          }
        },
        dependenciesJson: undefined
      })
    })
})
