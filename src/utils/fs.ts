import * as fs from 'graceful-fs'
import * as Promise from 'any-promise'
import * as thenify from 'thenify'
import stripBom = require('strip-bom')
import parse = require('parse-json')
import Throat = require('throat')

const throat = Throat(Promise)

export type ReadFileOp = (path: string, encoding: string) => Promise<string>

/**
 * Parse a string as JSON.
 */
export function parseJson(contents: string, path: string, allowEmpty: boolean): any {
  if (contents === '' && allowEmpty) {
    return {}
  }

  return parse(contents, undefined, path)
}

export const readFile: ReadFileOp = throat(10, thenify<string, string, string>(fs.readFile))

/**
 * Read JSON from a path.
 */
export function readJson(path: string, allowEmpty: boolean = false): Promise<any> {
  return readFile(path, 'utf8')
    .then(stripBom)
    .then(contents => parseJson(contents, path, allowEmpty))
}

