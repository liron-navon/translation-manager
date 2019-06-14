"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// events
var selectFolder_1 = require("./handlers/selectFolder");
var saveChanges_1 = require("./handlers/saveChanges");
var uploadCSV_1 = require("./handlers/uploadCSV");
var downloadFile_1 = require("./handlers/downloadFile");
var openFolder_1 = require("./handlers/openFolder");
var uploadPO_1 = require("./handlers/uploadPO");
var uploadXML_1 = require("./handlers/uploadXML");
var openTranslationCollection_1 = require("./handlers/openTranslationCollection");
exports.registerEvents = function (window) {
    selectFolder_1.registerSelectFolder(window);
    saveChanges_1.registerSaveChanges(window);
    uploadCSV_1.registerUploadCSV(window);
    downloadFile_1.registerDownloadCSV(window);
    openFolder_1.registerOpenFolder(window);
    uploadPO_1.registerUploadPo(window);
    uploadXML_1.registerUploadXML(window);
    openTranslationCollection_1.registerOpenTranslationCollection(window);
};
//# sourceMappingURL=index.js.map