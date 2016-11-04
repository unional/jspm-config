import test from 'ava'
import * as E from './error'

test('ConfigError', t => {
  const e = new E.ConfigError('asdf')
  t.is(e.name, 'ConfigError')
})
