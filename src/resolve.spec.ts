import test from 'ava'
import fixture from 'ava-fixture'

import { resolve, resolveAll, DependencyBranch, DependencyTree, ModuleNotFoundError } from './index'

const ftest = fixture(test, '../fixtures/cases')
ftest('resolveAll', 'custom-config-empty', (t, casePath) => {
  return resolveAll({ cwd: casePath }).then(actual => {
    t.deepEqual(actual, {}, 'should returns {} as there are no dependencies')
  })
})

ftest('resolveAll', 'base-case', (t, casePath) => {
  return resolveAll({ cwd: casePath })
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

ftest('resolve', 'base-case', (t, cwd) => {
  return Promise.all([
    resolve('make-error-cause', { cwd })
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
    t.throws(resolve('not-exist', { cwd }), ModuleNotFoundError, 'not-exist')
  ])
})
