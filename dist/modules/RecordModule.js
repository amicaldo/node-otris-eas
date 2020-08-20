"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordModule = void 0;
var url_1 = require("url");
var xmlbuilder2 = __importStar(require("xmlbuilder2"));
var tmp_1 = __importDefault(require("tmp"));
var fs_1 = __importDefault(require("fs"));
var form_data_1 = __importDefault(require("form-data"));
/**
 * Module to handle records
 *
 * Each record can contain fields and attachments.
 */
var RecordModule = /** @class */ (function () {
    function RecordModule(apiClient) {
        this.apiStore = apiClient;
    }
    RecordModule.prototype.get = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId)
            .then(function (res) { return res; });
    };
    RecordModule.prototype.getAll = function (store) {
        return this.search(store, {
            query: 'record',
            itemsPerPage: Math.pow(2, 32) / 2 - 1 // Max int value
        });
    };
    RecordModule.prototype.create = function (store, record, recordIndexMode, attachmentIndexMode) {
        if (record === void 0) { record = {}; }
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = new form_data_1.default();
        var xmlFile = tmp_1.default.fileSync({ postfix: '.xml' });
        var xmlData = this.generateRecordXml(record);
        fs_1.default.writeFileSync(xmlFile.name, xmlData);
        form.append('record', fs_1.default.createReadStream(xmlFile.name));
        form.append('recordIndexMode', recordIndexMode);
        form.append('attachmentIndexMode', attachmentIndexMode);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/record", {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res.records; });
    };
    RecordModule.prototype.update = function (store, recordId, record, recordIndexMode, attachmentIndexMode) {
        if (record === void 0) { record = {}; }
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = new form_data_1.default();
        var xmlFile = tmp_1.default.fileSync({ postfix: '.xml' });
        var xmlData = this.generateRecordXml(record);
        fs_1.default.writeFileSync(xmlFile.name, xmlData);
        form.append('record', fs_1.default.createReadStream(xmlFile.name));
        form.append('recordIndexMode', recordIndexMode);
        form.append('attachmentIndexMode', attachmentIndexMode);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/record/" + recordId, {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res.records; });
    };
    RecordModule.prototype.search = function (store, query) {
        return this.searchDetails(store, query)
            .then(function (res) { return res.result; });
    };
    RecordModule.prototype.searchDetails = function (store, query) {
        var params = new url_1.URLSearchParams();
        Object.entries(query).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return params.set(key, value);
        });
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/?" + params.toString())
            .then(function (res) { return res; });
    };
    RecordModule.prototype.getVersion = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/version")
            .then(function (res) { return res; });
    };
    RecordModule.prototype.verify = function (store, recordId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/record/" + recordId + "/verify")
            .then(function (res) { return res; });
    };
    RecordModule.prototype.generateRecordXml = function (record) {
        var xmlRecord = xmlbuilder2
            .create({ version: '1.0' })
            .ele('records', { xmlns: 'http://namespace.otris.de/2010/09/archive/recordIntern ' })
            .ele('record');
        if (record.title) {
            xmlRecord.ele('title').txt(record.title);
        }
        if (record.attachments) {
            for (var _i = 0, _a = record.attachments; _i < _a.length; _i++) {
                var attachment = _a[_i];
                xmlRecord
                    .ele('attachment')
                    .ele('name').txt(attachment.name)
                    .up()
                    .ele('path').txt(attachment.path);
            }
        }
        return xmlRecord.end({ prettyPrint: true });
    };
    return RecordModule;
}());
exports.RecordModule = RecordModule;
