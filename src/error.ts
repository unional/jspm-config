import { BaseError } from 'make-error-cause'

/**
 * This error signifies there are issue with the jspm configuration.
 */
export class ConfigError extends BaseError {
}

/**
 * This error signifies the module requested is not found.
 */
export class ModuleNotFoundError extends BaseError {
  constructor(moduleName: string) {
    super(`${moduleName} not found`)
  }
}
