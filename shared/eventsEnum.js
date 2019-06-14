"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Events;
(function (Events) {
    Events["selectFolder"] = "selectFolder";
    Events["openFolder"] = "openFolder";
    Events["saveChanges"] = "saveChanges";
    Events["uploadCSV"] = "uploadCSV";
    Events["uploadPO"] = "uploadPO";
    Events["uploadXML"] = "uploadXML";
    Events["downloadFile"] = "downloadFile";
    Events["openTranslationCollection"] = "openTranslationCollection";
})(Events = exports.Events || (exports.Events = {}));
exports.getEventID = function (name) {
    return {
        event: name,
        done: name + ":done"
    };
};
//# sourceMappingURL=eventsEnum.js.map