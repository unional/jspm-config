import ava from 'ava';
import fixture from 'ava-fixture';

import { resolve, resolveOne, DependencyTree } from './index';

const ftest = fixture(ava, '../fixtures/cases');
ftest('resolve', 'custom-config-empty', (t, casePath) => {
  return resolve({ cwd: casePath }).then(() => {
    t.pass('it passed');
  });
});

ftest('resolve', 'base-case', (t, casePath) => {
  return resolve({ cwd: casePath })
    .then(actual => {
      const expected: DependencyTree = {
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
      };

      t.deepEqual(actual, expected, 'base-case resolve() works');
    });
});

ftest('resolveOne', 'base-case', (t, casePath) => {
  return Promise.all([
    resolveOne('make-error-cause', { cwd: casePath })
      .then(actual => {
        const expected: DependencyTree = {
          'make-error-cause': {
            path: 'jspm_packages/npm/make-error-cause@1.2.1',
            map: {
              'make-error': {
                path: 'jspm_packages/npm/make-error@1.2.0'
              }
            }
          }
        };

        t.deepEqual(actual, expected, 'base-case resolveOne() works');
      }),
    resolveOne('not-exist', { cwd: casePath })
      .then(actual => {
        t.deepEqual(actual, {}, 'base-case resolveOne() for not-exist module returns {}');
      })
  ]);
});
