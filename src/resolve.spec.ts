import ava from 'ava';
import fixture from 'ava-fixture';

import { resolve } from './index';

const ftest = fixture(ava, '../fixtures/cases');
ftest('jspm resolve()', '0.17-custom', (t, casePath) => {
  return resolve({ cwd: casePath }).then(() => {
    t.pass('it passed');
  });
});
