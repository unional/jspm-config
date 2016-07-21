import ava from 'ava';
import fixture from 'ava-fixture';

import { readProjectConfig, ConfigError } from './index';

const ftest = fixture(ava, '../fixtures/cases');

ftest('readProjectConfig', 'custom-config-empty', (t, casePath) => {
  return readProjectConfig({ cwd: casePath })
    .then(projectInfo => {
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
          browser: {
            baseURL: '/',
            paths: { 'app/': 'src/' }
          },
          dev: {
          },
          node: { paths: { 'app/': 'src/' } }
        },
        dependenciesJson: {}
      }, 'should work with full custom configuration');
    });
});

ftest('readyProjectConfig', 'empty', (t, casePath) => {
  return readProjectConfig({ cwd: casePath })
    .then(projectInfo => {
      t.deepEqual(projectInfo, undefined, 'should return undefined when the folder is empty');
    });
});

ftest('readProjectConfig', 'non-jspm-empty', (t, casePath) => {
  return readProjectConfig({ cwd: casePath })
    .catch(err => {
      t.true(err instanceof ConfigError, 'error is instance of ConfigError');
      t.is(err.message, 'This is not a jspm project', 'error with not jspm project message');
    });
});

