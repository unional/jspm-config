import path = require('path')
import Promise = require('any-promise')
import extend = require('xtend')
import pick = require('object.pick')

import { readJson } from './utils/fs'
import { JspmPackageJson, Configs, Options, DependenciesJson, JspmProjectInfo } from './interfaces'
import { JSPM_PACKAGE_JSON_DEFAULT } from './constants'
import { ConfigError } from './error'
import { ConfigReader } from './ConfigReader'

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
          }
        })
    })
    .catch<JspmProjectInfo | void>(err => {
      if (err.code === 'ENOENT') {
        // package.json does not exist. Returns undefined.
        return
      }

      throw err
    })
}

export function readDependenciesJson(jspmPackageJson: JspmPackageJson, options: Options): Promise<DependenciesJson> {
  const packages = jspmPackageJson.directories ?
    jspmPackageJson.directories.packages :
    JSPM_PACKAGE_JSON_DEFAULT.directories.packages
  return readJson(path.join(options.cwd, packages, '.dependencies.json')).catch<DependenciesJson | void>(err => {
    if (err.code === 'ENOENT') {
      // <jspm_packages>/.dependencies.json does not exist. Returns undefined.
      return
    }

    throw err
  })
}

export function readJspmPackageJson(options: Options): Promise<JspmPackageJson> {
  return readJson(path.join(options.cwd, 'package.json'))
    .then(pjson => {
      return extractJspmPackageJson(pjson)
    })
}

export function readJspmConfigs(jspmPackageJson: JspmPackageJson, options: Options): Promise<Configs> {
  const baseURL = jspmPackageJson.directories ?
    jspmPackageJson.directories.baseURL :
    JSPM_PACKAGE_JSON_DEFAULT.directories.baseURL
  const configFiles = extend(
    JSPM_PACKAGE_JSON_DEFAULT.configFiles,
    jspmPackageJson.configFiles
  )
  const { cwd } = options
  const configs: Configs = {}
  const reader = new ConfigReader()
  let hasConfig = false

  return Promise.resolve()
    .then(() => {
      let filePath = path.resolve(cwd, baseURL, configFiles['jspm'])
      return reader.read(filePath).then(config => {
        if (config) {
          configs.jspm = config
          hasConfig = true
        }
      })
    })
    .then(() => {
      let filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:browser'])
      return reader.read(filePath).then(config => {
        if (config) {
          configs.browser = config
          hasConfig = true
        }
      })
    })
    .then(() => {
      let filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:dev'])
      return reader.read(filePath).then(config => {
        if (config) {
          configs.dev = config
          hasConfig = true
        }
      })
    })
    .then(() => {
      let filePath = path.resolve(options.cwd, baseURL, configFiles['jspm:node'])
      return reader.read(filePath).then(config => {
        if (config) {
          configs.node = config
          hasConfig = true
        }
      })
    })
    .then(
    () => {
      reader.close()
      return hasConfig ? configs : undefined
    },
    () => {
      reader.close()
    })
}

function extractJspmPackageJson(packageJson: any): JspmPackageJson {
  const result = pick(packageJson, [
    'name',
    'version',
    'main',
    'browser',
    'typings',
    'browserTypings',
    'directories',
    'configFiles',
    'dependencies',
    'peerDependencies',
    'devDependencies'
  ])
  if (packageJson.jspm === true) {
    return result
  }
  else if (typeof packageJson.jspm === 'object') {
    return extend(result, packageJson.jspm)
  }
  else {
    throw new ConfigError('This is not a jspm project')
  }
}
