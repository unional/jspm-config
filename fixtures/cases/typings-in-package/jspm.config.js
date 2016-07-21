SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/"
  },
  browserConfig: {
    "baseURL": "/"
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "lower-case": "npm:lower-case@1.1.3"
  },
  packages: {}
});
