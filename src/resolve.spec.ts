import ava from 'ava'
import fixture from 'ava-fixture'

import { resolve, resolveAll, DependencyBranch, DependencyTree } from './index'

const ftest = fixture(ava, '../fixtures/cases')
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

ftest('resolve', 'base-case', (t, casePath) => {
  return Promise.all([
    resolve('make-error-cause', { cwd: casePath })
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
    resolve('not-exist', { cwd: casePath })
      .then(actual => {
        t.deepEqual(actual, {}, 'base-case resolveOne() for not-exist module returns {}')
      })
  ])
})
