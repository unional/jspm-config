import Promise = require('any-promise');
import extend = require('xtend');

import { Options, DependencyInfo } from './interfaces';
import { readProjectConfig } from './readProjectConfig';

export function resolve(options: Options): Promise<DependencyInfo> {
  return readProjectConfig(options)
    .then(projectInfo => {
      const config = extend(
        projectInfo.jspmConfigs.browser,
        projectInfo.jspmConfigs.dev,
        projectInfo.jspmConfigs.jspm,
        projectInfo.jspmConfigs.node);
      return {
        paths: config.paths,
        map: config.map,
        packages: config.packages
      };
    });
}
