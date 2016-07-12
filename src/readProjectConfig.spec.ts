import { join } from 'path';
import fixture from 'blue-tape-fixture';

import { readProjectConfig, JspmProjectInfo } from './index';


const FIXTURES_DIR = join(__dirname, '_fixture_/cases');
const ftest = fixture(FIXTURES_DIR);
ftest('readProjectConfig()', '0.17-custom', (t, cwd) => {
  return readProjectConfig({ cwd })
    .then((projectInfo) => {
      t.deepEqual(projectInfo, {
        jspmPackageJson: {
          directories: {
            baseURL: 'www',
            packages: 'www/cust_jspm_packages'
          },
          configFiles: {
            jspm: 'jspm.config.js',
            'jspm:dev': 'jspm.dev.js',
            'jspm:browser': 'jspm.browser.js',
            'jspm:node': 'jspm.node.js'
          },
          name: 'app',
          main: 'app.js'
        },
        jspmConfigs: {
          jspm: { packageConfigPaths: [], map: {}, packages: {} },
          browser: { baseURL: '/', paths: [Object] },
          dev: {},
          node: { paths: [Object] }
        },
        dependenciesJson: {}
      } as JspmProjectInfo, 'should work with ...');
    });
});
