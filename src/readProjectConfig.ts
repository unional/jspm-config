import path = require('path');
import fs = require('fs');
import Promise = require('any-promise');
import extend = require('xtend');
import pick = require('object.pick');

import { readJson } from './utils/fs';
import { JspmPackageJson, ConfigFiles, Configs, Options, DependenciesJson, JspmProjectInfo } from './interfaces';

export function readProjectConfig(options: Options): Promise<JspmProjectInfo> {
  return readJspmPackageJson(options)
    .then((jspmPackageJson) => {
      return Promise.all(
        [
          readJspmConfigs(jspmPackageJson.directories.baseURL, jspmPackageJson.configFiles, options),
          readDependenciesJson(jspmPackageJson.directories.packages, options)
        ])
        .then(([jspmConfigs, dependenciesJson]) => {

          return {
            jspmPackageJson,
            jspmConfigs,
            dependenciesJson
          };

        });
    });
}

function readDependenciesJson(packagesPath: string, options: Options): Promise<DependenciesJson> {
  return readJson(path.join(options.cwd, packagesPath, '.dependencies.json'));
}

function readJspmPackageJson(options: Options): Promise<JspmPackageJson> {
  return readJson(path.join(options.cwd, 'package.json'))
    .then(pjson => {
      return extractJspmPackageJson(pjson);
    });
}

function readJspmConfigs(baseURL: string, configFiles: ConfigFiles, options: Options): Configs {
  let g: any = global;
  let sys = g.System;
  let sysjs = g.SystemJS;
  let config: any;

  g.System = {
    config(conf: Object): any {
      config = conf;
    }
  };
  g.SystemJS = g.System;

  const configs: Configs = {};

  let filePath = path.resolve(options.cwd, baseURL, configFiles['jspm']);
  if (fs.existsSync(filePath)) {
    require(filePath);
    configs.jspm = config;
    delete require.cache[require.resolve(filePath)];
  }

  filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:browser']);
  if (fs.existsSync(filePath)) {
    require(filePath);
    configs.browser = config;
    delete require.cache[require.resolve(filePath)];
  }

  filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:dev']);
  if (fs.existsSync(filePath)) {
    require(filePath);
    configs.dev = config;
    delete require.cache[require.resolve(filePath)];
  }

  filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:node']);
  if (fs.existsSync(filePath)) {
    require(filePath);
    configs.node = config;
    delete require.cache[require.resolve(filePath)];
  }

  g.System = sys;
  g.SystemJS = sysjs;
  return configs;
}


function extractJspmPackageJson(packageJson: any): JspmPackageJson {
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
