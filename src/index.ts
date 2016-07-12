import fs = require('fs');
import path = require('path');
import Promise = require('any-promise');
import extend = require('xtend');
import pick = require('object.pick');

import { Options } from './interfaces';
import { readProjectConfig } from './project';

export function resolve(options: Options) {
  return readProjectConfig(options)
    .then((config) => {
      console.log(config);
    });
}
