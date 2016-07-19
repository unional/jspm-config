import fixture from 'blue-tape-fixture';

import { readProjectConfig, JspmProjectInfo } from './index';

const ftest = fixture('fixtures/cases');

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
          browser: { baseURL: '/', paths: { 'app/': 'src/' } },
          dev: {},
          node: { paths: { 'app/': 'src/'} }
        },
        dependenciesJson: {}
      } as JspmProjectInfo, 'should work with ...');
    });
});
