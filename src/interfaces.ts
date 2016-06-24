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

export interface JspmPackageJson {
  name: string;
  main: string;
  directories: { baseURL: string, packages: string };
  configFiles: ConfigFiles;
  dependencies: { [index: string]: string };
  peerDependencies: { [index: string]: string };
  devDependencie: { [index: string]: string };
  overrides: { [index: string]: any };
}

/**
 * Interface for the resolved JSPM config.
 */
export interface JspmConfig {
  getDependencyTree(moduleName: string): any;
}

export interface ConfigFiles {
  jspm: string;
  'jspm:browser': string;
  'jspm:dev': string;
  'jspm:node': string;
}

export interface Configs {
  jspm?: any;
  browser?: any;
  dev?: any;
  node?: any;
}

export interface JspmProjectInfo {
  jspmPackageJson: JspmPackageJson;
  jspmConfigs: Configs;
  dependenciesJson: DependenciesJson;
}
