import Promise = require('any-promise')
import extend = require('xtend')

import {
  Options, DependencyBranch, DependencyTree, DependencyInfo, PackageMap, PathMap, ModuleMap, Configs,
  JspmPackageJson
} from './interfaces'
import { readJspmPackageJson, readJspmConfigs } from './readProjectConfig'
import { ModuleNotFoundError } from './error'

export function resolveAll(options: Options): Promise<DependencyBranch> {
  return readJspmPackageJson(options)
    .then(pjson => {
      return resolveByPackageJson(pjson, options)
    })
}

export function resolveByPackageJson(pjson: JspmPackageJson, options: Options): Promise<DependencyBranch> {
  return readJspmConfigs(pjson, options)
    .then(configs => {
      const dependencyInfo = getDependencyInfo(configs)
      return readMap(
        dependencyInfo.map,
        dependencyInfo.paths,
        dependencyInfo.packages)
    })
}

export function resolve(moduleName: string, options: Options): Promise<DependencyTree> {
  return readJspmPackageJson(options)
    .then(pjson => {
      return readJspmConfigs(pjson, options)
    })
    .then(configs => {
      const dependencyInfo = getDependencyInfo(configs)
      const packageName = dependencyInfo.map[moduleName]

      if (!packageName) {
        throw new ModuleNotFoundError(moduleName)
      }

      return readMap(
        { [moduleName]: packageName },
        dependencyInfo.paths,
        dependencyInfo.packages)[moduleName]
    })
}

function readMap(map: ModuleMap, paths: PathMap, packages: PackageMap) {
  const result: DependencyBranch = {}
  for (let moduleName in map) {
    const node: DependencyTree = {} as any
    const packageName = map[moduleName]
    node.path = getModulePath(packageName, paths)
    const pkg = packages[packageName]
    if (pkg && pkg.map) {
      node.map = readMap(pkg.map, paths, packages)
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
