export interface Options {
  cwd: string;
}

/**
 * Interface for `<jspm_packages>/.dependencies.json`.
 */
export interface DependenciesJson {
  [index: string]: {
    deps: { [index: string]: string },
    peerDeps: { [index: string]: string }
  };
}

/**
 * Interface for the resolved JSPM config.
 */
export interface JspmConfig {
  getDependencyTree(moduleName: string): any;
}
