import fs = require('fs');
import path = require('path');
import Promise = require('any-promise');
import extend = require('xtend');
import pick = require('object.pick');

import { Options } from './interfaces';
import { readProjectConfig } from './project';

export default function resolve(options: Options = { cwd: __dirname }) {
    return readProjectConfig(options)
    .then((config) => {

    });
}
