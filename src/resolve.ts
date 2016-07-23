import Promise = require('any-promise')
import extend = require('xtend')

import { Options, DependencyTree, DependencyNode, DependencyInfo, PackageMap, PathMap, ModuleMap, JspmProjectInfo } from './interfaces'
import { readProjectConfig } from './readProjectConfig'

export function resolveAll(options: Options): Promise<DependencyTree> {
  return readProjectConfig(options)
    .then(projectInfo => {
      const dependencyInfo = getDependencyInfo(projectInfo)
      return readMap(
        dependencyInfo.map,
        dependencyInfo.paths,
        dependencyInfo.packages)
    })
}

export function resolve(moduleName: string, options: Options): Promise<DependencyTree> {
  return readProjectConfig(options)
    .then(projectInfo => {
      const dependencyInfo = getDependencyInfo(projectInfo)
      const packageName = dependencyInfo.map[moduleName]
      if (packageName) {
        return readMap(
          { [moduleName]: packageName },
          dependencyInfo.paths,
          dependencyInfo.packages)
      }
      else {
        return {}
      }
    })
}

function readMap(map: ModuleMap, paths: PathMap, packages: PackageMap) {
  const result: DependencyTree = {}
  for (let moduleName in map) {
    const node: DependencyNode = {} as any
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
function getDependencyInfo(projectInfo: JspmProjectInfo): DependencyInfo {
  const config = extend(
    projectInfo.jspmConfigs.browser,
    projectInfo.jspmConfigs.dev,
    projectInfo.jspmConfigs.jspm,
    projectInfo.jspmConfigs.node)
  return {
    paths: config.paths,
    map: config.map,
    packages: config.packages
  }
}
