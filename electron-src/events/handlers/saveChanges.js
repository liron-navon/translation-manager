"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var eventsEnum_1 = require("../../../shared/eventsEnum");
var createEvent_1 = require("../../helpers/createEvent");
var fs = require("fs");
var jsonStableStringify = require("json-stable-stringify");
var isEmpty = require("lodash/isEmpty");
var isString = require("lodash/isString");
var trim = require("lodash/trim");
var projectConfigurations_1 = require("../../../shared/projectConfigurations");
// filter the request before saving it to file
var filterRequest = function (request) {
    var options = request.options;
    var project = __assign({}, request.project);
    // don't creates a notes file if it's disabled
    if (options.disableNotes) {
        delete project.files[projectConfigurations_1.notesFileName];
    }
    // remove empty objects, to not create empty files
    Object.entries(project.files).forEach(function (_a) {
        var fileKey = _a[0], file = _a[1];
        // delete empty strings
        Object.entries(file.content).forEach(function (_a) {
            var keyword = _a[0], text = _a[1];
            if (trim(text).length === 0) {
                delete file.content[keyword];
            }
        });
        // delete empty objects
        if (isEmpty(file.content)) {
            delete project.files[fileKey];
        }
    });
    return {
        project: project,
        options: options
    };
};
exports.registerSaveChanges = function (window) {
    createEvent_1.createEvent(eventsEnum_1.Events.saveChanges, function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, project, options, replacer;
        return __generator(this, function (_b) {
            _a = filterRequest(request), project = _a.project, options = _a.options;
            replacer = function (name, value) {
                // if the trim option is active, we can trim all spaces
                if (options.trim && isString(value)) {
                    // don't store empty strings for no reason
                    if (value.length === 0) {
                        return undefined;
                    }
                    value = trim(value);
                }
                return value;
            };
            Object.values(project.files).forEach(function (file) {
                // json-stable-stringify sorts the keys alphabetically for us
                // uppercase first, and than lower cased character
                //
                // {
                //   "$": 'special characters goes first',
                //   "A": 'HELLO',
                //   "B": 'WORLD'
                //   "a": 'hello'
                //   "b": 'world'
                // }
                var contentString = jsonStableStringify(file.content, {
                    space: options.prettySource ? 2 : 0,
                    replacer: replacer
                });
                fs.writeFileSync(file.path, contentString);
            });
            return [2 /*return*/, {
                    success: true
                }];
        });
    }); });
};
//# sourceMappingURL=saveChanges.js.map