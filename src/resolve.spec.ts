import test from 'ava'
import fixture from 'ava-fixture'

import { resolve, resolveAll, DependencyBranch, DependencyTree, ModuleNotFoundError } from './index'

const ftest = fixture(test, './fixtures/cases')
ftest('resolveAll', 'custom-config-empty', (t, d) => {
  return resolveAll({ cwd: d.casePath }).then(actual => {
    t.deepEqual(actual, {}, 'should returns {} as there are no dependencies')
  })
})

ftest('resolveAll', 'base-case', (t, d) => {
  return resolveAll({ cwd: d.casePath })
    .then(actual => {
      const expected: DependencyBranch = {
        'make-error-cause': {
          path: 'jspm_packages/npm/make-error-cause@1.2.1',
          map: {
            'make-error': {
              path: 'jspm_packages/npm/make-error@1.2.0'
            }
          }
        },
        'nop': {
          path: 'jspm_packages/npm/nop@1.0.0'
        }
      }

      t.deepEqual(actual, expected, 'base-case resolve() works')
    })
})

ftest('resolve', 'base-case', (t, d) => {
  return Promise.all([
    resolve('make-error-cause', { cwd: d.casePath })
      .then(actual => {
        const expected: DependencyTree = {
          path: 'jspm_packages/npm/make-error-cause@1.2.1',
          map: {
            'make-error': {
              path: 'jspm_packages/npm/make-error@1.2.0'
            }
          }
        }

        t.deepEqual(actual, expected, 'base-case resolveOne() works')
      }),
    t.throws(resolve('not-exist', { cwd: d.casePath }), ModuleNotFoundError, 'not-exist')
  ])
})

ftest('resolve', 'custom-baseurl', (t, d) => {
  return resolve('make-error', { cwd: d.casePath })
    .then(actual => {
      t.deepEqual(
        actual,
        {
          path: 'src/jspm_packages/npm/make-error@1.2.1'
        }
      )
    })
})

ftest('resolving scoped package', 'scoped-package', (t, cwd) => {
  return resolve('@extjs/reactor', { cwd })
  .then(actual => {
    t.is(actual.path, 'jspm_packages/npm/@extjs/reactor@0.2.3')
    t.not(actual.map, {})
    t.not(actual.map, undefined)
  })
})
