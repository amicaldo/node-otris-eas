"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eas = void 0;
var got_1 = __importDefault(require("got"));
var form_data_1 = __importDefault(require("form-data"));
var Eas = /** @class */ (function () {
    function Eas(base, username, password) {
        var token = Buffer.from(username + ":" + password).toString('base64');
        this.apiClient = got_1.default.extend({
            prefixUrl: base,
            headers: {
                'x-otris-eas-user': 'manager',
                'Accept': 'application/json',
                'Authorization': "Basic " + token
            }
        });
        this.apiJsonClient = this.apiClient.extend({
            responseType: 'json',
            resolveBodyOnly: true
        });
    }
    /**
     * Stores
     */
    Eas.prototype.getStores = function () {
        return this.apiJsonClient.get('eas/archives');
    };
    Eas.prototype.createStore = function (storeName, iniData) {
        return this.apiClient.put("eas/archives/" + storeName, {
            body: iniData
        });
    };
    Eas.prototype.deleteStore = function (store) {
        return this.apiClient.delete("eas/archives/" + store.name);
    };
    Eas.prototype.activateStore = function (store) {
        return this.apiClient.put("eas/archives/" + store.name + "/active");
    };
    Eas.prototype.deactivateStore = function (store) {
        return this.apiClient.delete("eas/archives/" + store.name + "/active");
    };
    Eas.prototype.getStoreConfiguration = function (store) {
        return this.apiJsonClient.get("eas/archives/" + store.name + "/configuration")
            .then(function (res) { return res.configuration; });
    };
    Eas.prototype.updateStoreConfiguration = function (store, iniData) {
        return this.apiClient.put("eas/archives/" + store.name + "/configuration");
    };
    /**
     * Spool
     */
    Eas.prototype.spoolFiles = function (store, files) {
        var form = new form_data_1.default();
        for (var i = 0; i < files.length; i++) {
            form.append((i > 0) ? "attachment" + i : 'attachment', files[i]);
        }
        return this.apiJsonClient.post("eas/archives/" + store.name + "/spool", {
            body: form,
            headers: form.getHeaders()
        }).then(function (res) { return res.spool; });
    };
    Eas.prototype.createRecords = function (store, recordFile, recordIndexMode, attachmentIndexMode) {
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = new form_data_1.default();
        form.append('record', recordFile);
        form.append('recordIndexMode', recordIndexMode);
        form.append('attachmentIndexMode', attachmentIndexMode);
        return this.apiJsonClient.post("eas/archives/" + store.name + "/record", {
            body: form,
            headers: form.getHeaders()
        }).then(function (res) { return res.records; });
    };
    Eas.prototype.updateRecords = function (store, recordId, recordFile, recordIndexMode, attachmentIndexMode) {
        if (recordIndexMode === void 0) { recordIndexMode = 0; }
        if (attachmentIndexMode === void 0) { attachmentIndexMode = 0; }
        var form = new form_data_1.default();
        form.append('record', recordFile);
        form.append('recordIndexMode', recordIndexMode);
        form.append('attachmentIndexMode', attachmentIndexMode);
        return this.apiJsonClient
            .post("eas/archives/" + store.name + "/record/" + recordId, {
            body: form,
            headers: form.getHeaders()
        }).then(function (res) { return res.records; });
    };
    Eas.prototype.getRecords = function (store, recordId) {
        return this.apiJsonClient
            .get("eas/archives/" + store.name + "/record/" + recordId);
    };
    return Eas;
}());
exports.Eas = Eas;
