"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordModule = void 0;
var form_data_1 = __importDefault(require("form-data"));
var url_1 = require("url");
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
    RecordModule.prototype.create = function (store, recordFile, recordIndexMode, attachmentIndexMode) {
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = new form_data_1.default();
        form.append('record', recordFile);
        form.append('recordIndexMode', recordIndexMode);
        form.append('attachmentIndexMode', attachmentIndexMode);
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/record", {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res.records; });
    };
    RecordModule.prototype.update = function (store, recordId, recordFile, recordIndexMode, attachmentIndexMode) {
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = new form_data_1.default();
        form.append('record', recordFile);
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
    return RecordModule;
}());
exports.RecordModule = RecordModule;
