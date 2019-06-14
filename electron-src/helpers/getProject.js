"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("path");
exports.getProject = function (path) {
    var files = {};
    fs.readdirSync(path).forEach(function (file) {
        if (file.endsWith('.json')) {
            try {
                var name_1 = file.replace('.json', '');
                var filePath = path_1.join(path, file);
                var fileContent = fs.readFileSync(filePath, 'utf8');
                files[name_1] = {
                    name: name_1,
                    path: filePath,
                    content: JSON.parse(fileContent)
                };
            }
            catch (e) {
                console.error(e);
            }
        }
    });
    return {
        folder: path,
        files: files
    };
};
//# sourceMappingURL=getProject.js.map