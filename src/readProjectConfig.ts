import path = require('path');
import fs = require('fs');
import Promise = require('any-promise');
import extend = require('xtend');
import pick = require('object.pick');

import { readJson } from './utils/fs';
import { JspmPackageJson, ConfigFiles, Configs, Options, DependenciesJson, JspmProjectInfo } from './interfaces';
import { JSPM_PACKAGE_JSON_DEFAULT } from './constants';
import { ConfigError } from './error';

export function readProjectConfig(options: Options): Promise<JspmProjectInfo> {
  return readJspmPackageJson(options)
    .then((jspmPackageJson) => {
      return Promise.all(
        [
          readJspmConfigs(jspmPackageJson, options),
          readDependenciesJson(jspmPackageJson, options)
        ])
        .then((results) => {
          return {
            jspmPackageJson,
            jspmConfigs: results[0],
            dependenciesJson: results[1]
          };
        });
    })
    .catch<JspmProjectInfo | void>(err => {
      if (err.code === 'ENOENT') {
        // package.json does not exist. Returns undefined.
        return;
      }

      throw err;
    });
}

function readDependenciesJson(jspmPackageJson: JspmPackageJson, options: Options): Promise<DependenciesJson> {
  const packages = jspmPackageJson.directories ? jspmPackageJson.directories.packages : JSPM_PACKAGE_JSON_DEFAULT.directories.packages;
  return readJson(path.join(options.cwd, packages, '.dependencies.json')).catch<DependenciesJson | void>(err => {
    if (err.code === 'ENOENT') {
      // <jspm_packages>/.dependencies.json does not exist. Returns undefined.
      return;
    }

    throw err;
  });
}

function readJspmPackageJson(options: Options): Promise<JspmPackageJson> {
  return readJson(path.join(options.cwd, 'package.json'))
    .then(pjson => {
      return extractJspmPackageJson(pjson);
    });
}

function readJspmConfigs(jspmPackageJson: JspmPackageJson, options: Options): Configs {
  const baseURL = jspmPackageJson.directories ? jspmPackageJson.directories.baseURL : JSPM_PACKAGE_JSON_DEFAULT.directories.baseURL;
  const configFiles = extend(
    JSPM_PACKAGE_JSON_DEFAULT.configFiles,
    jspmPackageJson.configFiles
  );
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

  let hasConfig = false;
  let filePath = path.resolve(options.cwd, baseURL, configFiles['jspm']);
  if (fs.existsSync(filePath)) {
    require(filePath);
    hasConfig = true;
    configs.jspm = config;
    delete require.cache[require.resolve(filePath)];
  }

  filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:browser']);
  if (fs.existsSync(filePath)) {
    require(filePath);
    hasConfig = true;
    configs.browser = config;
    delete require.cache[require.resolve(filePath)];
  }

  filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:dev']);
  if (fs.existsSync(filePath)) {
    require(filePath);
    hasConfig = true;
    configs.dev = config;
    delete require.cache[require.resolve(filePath)];
  }

  filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:node']);
  if (fs.existsSync(filePath)) {
    require(filePath);
    hasConfig = true;
    configs.node = config;
    delete require.cache[require.resolve(filePath)];
  }

  g.System = sys;
  g.SystemJS = sysjs;
  return hasConfig ? configs : undefined;
}


function extractJspmPackageJson(packageJson: any): JspmPackageJson {
  if (packageJson.jspm === true) {
    return pick(packageJson, [
      'name',
      'main',
      'directories',
      'configFiles',
      'dependencies',
      'peerDependencies',
      'devDependencies'
    ]);
  }
  else if (typeof packageJson.jspm === 'object') {
    return packageJson.jspm;
  }
  else {
    throw new ConfigError('This is not a jspm project');
  }
}
