import Promise = require('any-promise');

import { Options } from './interfaces';
import { readProjectConfig } from './project';

export function resolve(options: Options): Promise<void> {
  return readProjectConfig(options)
    .then((config) => {
      console.log(config);
    });
}
