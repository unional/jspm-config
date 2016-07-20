import ava from 'ava';
import fixture from 'ava-fixture';

import { readProjectConfig } from './index';

const ftest = fixture(ava, '../fixtures/cases');

ftest('readProjectConfig()', '0.17-custom', (t, casePath) => {
  return readProjectConfig({ cwd: casePath })
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
          browser: { baseURL: '/', paths: { 'app/': 'src/' } },
          dev: {},
          node: { paths: { 'app/': 'src/' } }
        },
        dependenciesJson: {}
      }, 'should work with full custom configuration');
    });
});

ftest('readyProjectConfig()', 'empty', (t, casePath) => {
  return readProjectConfig({ cwd: casePath })
    .then((projectInfo) => {
      t.deepEqual(projectInfo, undefined, 'should return undefined when the folder is empty');
    });
});

ftest('readProjectConfig()', 'non-jspm-empty', (t, casePath) => {
  return readProjectConfig({ cwd: casePath })
    .then((projectInfo) => {
      t.deepEqual(projectInfo, {
        jspmPackageJson: {
          name: 'non-jspm',
          main: 'index.js'
        },
        jspmConfigs: undefined,
        dependenciesJson: undefined
      }, 'should work with non-jspm empty library');
    });
});
