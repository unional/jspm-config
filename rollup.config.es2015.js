import paramCase from 'param-case'
import pascalCase from 'pascal-case'
import commonjs from 'rollup-plugin-commonjs'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import nodeGlobals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'
import sourcemaps from 'rollup-plugin-sourcemaps'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js'

const pkg = require('./package')

const moduleName = pascalCase(pkg.name)

export default {
  dest: `dist/${paramCase(pkg.name)}.es2015.js`,
  entry: 'dist/es2015/index.js',
  external: [
    TODO: list external dependencies, e.g.:
    // 'lodash',
    // 'aurelia-logging'
  ],
  exports: 'named',
  format: 'iife',
  globals: {
    TODO: list global variables, e.g.:
    // lodash: '_',
    // 'aurelia-logging': 'AureliaLogging'
  },
  moduleId: pkg.name,
  moduleName,
  // This may comes handy
  // onwarn(warning) {
  //   // Suppress this error message: "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten"
  //   // https://github.com/rollup/rollup/issues/794
  //   if (warning.code === 'THIS_IS_UNDEFINED') {
  //     return
  //   }

  //   console.error(warning.message)
  // },
  plugins: [
    sourcemaps(),
    nodeResolve({
      jsnext: true,
      skip: [
        TODO: list external dependencies to skip, e.g.:
        // 'lodash',
        // 'aurelia-logging'
      ]
    }),
    nodeGlobals(),
    nodeBuiltins(),
    commonjs(),
    uglify({}, minify)
  ],
  sourceMap: true
}
