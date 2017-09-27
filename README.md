# @unional/jspm-config

[![Greenkeeper badge](https://badges.greenkeeper.io/unional/jspm-config.svg)](https://greenkeeper.io/)

[![unstable][unstable-image]][unstable-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
![badge-size-es5-url]
![badge-size-es2015-url]

## Roadmap

- [x] `resolve()` and `resolveAll()`
  - for `typings i jspm:<pkg>`
- [ ] `discoverTypings()` or `configSystemJS()` or `configJspm()`
  - For <https://github.com/frankwallis/plugin-typescript/issues/102>

## Reference

[SystemJS Resolution Specification](https://github.com/systemjs/systemjs/blob/599d89cbe9f4fb39a39f6c52b619cbd1f1da6ffc/docs/resolution-algorithm.md#resolution-specification)

## Contribute

```sh
# right after clone
npm install

# begin making changes
git checkout -b <branch>
npm run watch

# edit `webpack.config.es5.js` and `rollup.config.es2015.js` to exclude dependencies for the bundle if needed

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

## Npm Commands

There are a few useful commands you can use during development.

```sh
# Run tests (and lint) automatically whenever you save a file.
npm run watch

# Run tests with coverage stats (but won't fail you if coverage does not meet criteria)
npm run test

# Manually verify the project.
# This will be ran during 'npm preversion' so you normally don't need to run this yourself.
npm run verify

# Build the project.
# You normally don't need to do this.
npm run build

# Run tslint
# You normally don't need to do this as `npm run watch` and `npm version` will automatically run lint for you.
npm run lint
```

Generated by [`generator-unional@0.9.0`](https://github.com/unional/unional-cli)

[unstable-image]: http://badges.github.io/stability-badges/dist/unstable.svg
[unstable-url]: http://github.com/badges/stability-badges
[npm-image]: https://img.shields.io/npm/v/jspm-config.svg?style=flat
[npm-url]: https://npmjs.org/package/jspm-config
[downloads-image]: https://img.shields.io/npm/dm/jspm-config.svg?style=flat
[downloads-url]: https://npmjs.org/package/jspm-config
[travis-image]: https://img.shields.io/travis/unional/jspm-config.svg?style=flat
[travis-url]: https://travis-ci.org/unional/jspm-config
[coveralls-image]: https://coveralls.io/repos/github/unional/jspm-config/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/jspm-config
[badge-size-es5-url]: http://img.badgesize.io/unional/jspm-config/master/dist/jspm-config.es5.js.svg?label=es5_size
[badge-size-es2015-url]: http://img.badgesize.io/unional/jspm-config/master/dist/jspm-config.es2015.js.svg?label=es2015_size
