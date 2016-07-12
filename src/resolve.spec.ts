import fixture from 'blue-tape-fixture';

import { resolve } from './index';


const FIXTURES_DIR = './src/_fixture_/cases';
const ftest = fixture(FIXTURES_DIR);
ftest('jspm resolve()', '0.17-custom', (t, cwd) => {
  return resolve({ cwd });
});
