import ava from 'ava';
import fixture from 'ava-fixture';

import { resolve, DependencyTree } from './index';

const ftest = fixture(ava, '../fixtures/cases');
ftest('resolve', '0.17-custom', (t, casePath) => {
  return resolve({ cwd: casePath }).then(() => {
    t.pass('it passed');
  });
});

ftest('resolve', '0.17-base', (t, casePath) => {
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

      t.deepEqual(actual, expected, '0.17-base resolve() works');
    });
});
