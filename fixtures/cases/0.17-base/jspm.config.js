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
    "make-error-cause": "npm:make-error-cause@1.2.1",
    "nop": "npm:nop@1.0.0"
  },
  packages: {
    "npm:make-error-cause@1.2.1": {
      "map": {
        "make-error": "npm:make-error@1.2.0"
      }
    }
  }
});
