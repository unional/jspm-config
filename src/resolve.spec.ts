import ava from 'ava';
import fixture from 'ava-fixture';

import { resolve } from './index';

const ftest = fixture(ava, '../fixtures/cases');
ftest('resolve', '0.17-custom', (t, casePath) => {
  return resolve({ cwd: casePath }).then(() => {
    t.pass('it passed');
  });
});

ftest('resolve', '0.17-base', (t, casePath) => {
  return resolve({ cwd: casePath })
    .then(actual => {
      t.deepEqual(actual, {
        paths: {
          'npm:': 'jspm_packages/npm/'
        },
        map: {
          'make-error-cause': 'npm:make-error-cause@1.2.1',
          'nop': 'npm:nop@1.0.0'
        },
        packages: {
          'npm:make-error-cause@1.2.1': {
            map: {
              'make-error': 'npm:make-error@1.2.0'
            }
          }
        }
      }, '0.17-base resolve() works');
    });
});
