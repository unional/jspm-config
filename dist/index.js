"use strict";
var path_1 = require('path');
var fs_1 = require('./utils/fs');
var JspmConfig = (function () {
    function JspmConfig(rootDir) {
        if (rootDir === void 0) { rootDir = __dirname; }
        this.rootDir = rootDir;
        this.ready = fs_1.readJson(path_1.join(rootDir, 'package.json'))
            .then(function (pjson) {
        });
    }
    return JspmConfig;
}());
exports.JspmConfig = JspmConfig;
//# sourceMappingURL=index.js.map