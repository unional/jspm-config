import path = require('path');
import Promise = require('any-promise');
import extend = require('xtend');
import pick = require('object.pick');

import { readJson } from './utils/fs';
import { Options, DependenciesJson } from './interfaces';

export function readDependenciesJson(packagesPath: string, options: Options): Promise<DependenciesJson> {
  return readJson(path.join(options.cwd, packagesPath, '.dependencies.json'));
}

export function readJspmPackageJson(options: Options): any {
  return readJson(path.join(options.cwd, 'package.json'))
    .then(pjson => {
      return extractJspmPackageJson(pjson);
    });
}

export function extractJspmPackageJson(packageJson: any): any {
  return extend(
    {
      directories: {
        baseURL: '.',
        packages: 'jspm_packages'
      },
      // The default value shows where the config files can be.
      // Except `jspm.config.js`, other files may not exist.
      configFiles: {
        jspm: 'jspm.config.js',
        'jspm:browser': 'jspm.browser.js',
        'jspm:dev': 'jspm.dev.js',
        'jspm:node': 'jspm.node.js'
      }
    },
    (typeof packageJson.jspm === 'object') ?
      packageJson.jspm :
      pick(packageJson, [
        'name',
        'main',
        'directories',
        'configFiles',
        'dependencies',
        'peerDependencies',
        'devDependencies'
      ]));
}
