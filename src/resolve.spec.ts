import { join } from 'path';
import fixture from 'blue-tape-fixture';

import { resolve } from './index';


const FIXTURES_DIR = join(__dirname, '_fixture_/cases');
const ftest = fixture(FIXTURES_DIR);
ftest('jspm resolve()', '0.17-custom', (t, cwd) => {
  return resolve({ cwd });
});
