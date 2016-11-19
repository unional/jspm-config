import Promise = require('any-promise')
import extend = require('xtend')
import path = require('path')

import {
  Options, DependencyBranch, DependencyTree, DependencyInfo, PathMap, ModuleMap, Configs,
  JspmPackageJson
} from './interfaces'
import { readProjectConfig, readJspmConfigs } from './readProjectConfig'
import { ModuleNotFoundError } from './error'

export function resolveAll(options: Options): Promise<DependencyBranch> {
  return readProjectConfig(options)
    .then(config => {
      const dependencyInfo = getDependencyInfo(config.jspmConfigs)
      return readMap(
        dependencyInfo.map,
        config.jspmPackageJson,
        dependencyInfo)
    })
}

export function resolveByPackageJson(pjson: JspmPackageJson, options: Options): Promise<DependencyBranch> {
  return readJspmConfigs(pjson, options)
    .then(configs => {
      const dependencyInfo = getDependencyInfo(configs)
      return readMap(
        dependencyInfo.map,
        pjson,
        dependencyInfo)
    })
}

export function resolve(moduleName: string, options: Options): Promise<DependencyTree> {
  return readProjectConfig(options)
    .then(config => {
      const dependencyInfo = getDependencyInfo(config.jspmConfigs)
      const packageName = dependencyInfo.map[moduleName]
      if (!packageName) {
        throw new ModuleNotFoundError(moduleName)
      }
      const map = readMap(
        { [moduleName]: packageName },
        config.jspmPackageJson,
        dependencyInfo)
      return map[moduleName]
    })
}

function readMap(map: ModuleMap, pjson: JspmPackageJson, dependencyInfo: DependencyInfo) {
  const { paths, packages } = dependencyInfo
  const baseURL = pjson.directories && pjson.directories.baseURL
  const result: DependencyBranch = {}
  for (let moduleName in map) {
    const node: DependencyTree = {} as any
    const packageName = map[moduleName]
    node.path = path.join(baseURL || '', getModulePath(packageName, paths))
    const pkg = packages[packageName]
    if (pkg && pkg.map) {
      node.map = readMap(pkg.map, pjson, dependencyInfo)
    }
    result[moduleName] = node
  }

  return result
}
function getModulePath(packageName: string, paths: PathMap) {
  for (let prefix in paths) {
    if (packageName.indexOf(prefix) === 0) {
      return packageName.replace(prefix, paths[prefix])
    }
  }
  return packageName
}
function getDependencyInfo(jspmConfigs: Configs): DependencyInfo {
  const config = extend(
    jspmConfigs.browser,
    jspmConfigs.dev,
    jspmConfigs.jspm,
    jspmConfigs.node)
  return {
    paths: config.paths,
    map: config.map,
    packages: config.packages
  }
}
