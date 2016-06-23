import fs = require('fs');
import path = require('path');
import Promise = require('any-promise');
import extend = require('xtend');
import pick = require('object.pick');

import { JspmConfig, DependenciesJson } from './interfaces';
import { readJson } from './utils/fs';
import { readDependenciesJson } from './project';


interface ConfigFiles {
  jspm: string;
  'jspm:browser': string;
  'jspm:dev': string;
  'jspm:node': string;
}

interface Configs {
  jspm?: Object;
  browser?: Object;
  dev?: Object;
  node?: Object;
}

function readConfigs(baseURL: string, configFiles: ConfigFiles, options: Options): Configs {
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

export interface Options {
  cwd: string;
}

function extractJsomPackageJson(packageJson: any): any {
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

function createJspmConfig(
  packageJson: any,
  jspmPackageJson: any,
  jspmConfigs: Configs,
  dependenciesJson: DependenciesJson): JspmConfig {
  return null;
};

export default function resolve(options: Options = { cwd: __dirname }): Promise<JspmConfig> {
  return readJson(path.join(options.cwd, 'package.json'))
    .then((pjson) => {
      if (!pjson.jspm) {
        return;
      }

      const jspmPackageJson = extractJsomPackageJson(pjson);

      return Promise.all(
        [
          readConfigs(jspmPackageJson.directories.baseURL, jspmPackageJson.configFiles, options),
          readDependenciesJson(jspmPackageJson.directories.packages, options)
        ])
        .then(([jspmConfigs, dependenciesJson]) => {

          return createJspmConfig(
            pjson,
            jspmPackageJson,
            jspmConfigs,
            dependenciesJson);
        });
    });
}
