import fixture from 'blue-tape-fixture';

import { resolve } from './index';

const ftest = fixture('fixtures/cases');
ftest('jspm resolve()', '0.17-custom', (t, cwd) => {
  return resolve({ cwd });
});
