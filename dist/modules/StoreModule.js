"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = void 0;
var form_data_1 = __importDefault(require("form-data"));
var URLParams_1 = require("../helpers/URLParams");
/**
 * Module to handle stores
 *
 * Each store can contain records.
 */
var StoreModule = /** @class */ (function () {
    function StoreModule(apiClient) {
        this.apiStore = apiClient;
    }
    StoreModule.prototype.getAll = function () {
        return this.apiStore.getApiJsonClient()
            .get('eas/archives')
            .then(function (res) { return res.stores; });
    };
    StoreModule.prototype.create = function (storeName, iniData) {
        return this.apiStore.getApiClient()
            .put("eas/archives/" + storeName, {
            body: iniData
        });
    };
    StoreModule.prototype.delete = function (store) {
        return this.apiStore.getApiClient()
            .delete("eas/archives/" + store.name);
    };
    StoreModule.prototype.activate = function (store) {
        return this.apiStore.getApiClient()
            .put("eas/archives/" + store.name + "/active");
    };
    StoreModule.prototype.deactivate = function (store) {
        return this.apiStore.getApiClient()
            .delete("eas/archives/" + store.name + "/active");
    };
    StoreModule.prototype.getConfiguration = function (store) {
        return this.apiStore.getApiClient()
            .get("eas/archives/" + store.name + "/configuration")
            .then(function (res) { return res.configuration; });
    };
    StoreModule.prototype.updateConfiguration = function (store, iniData) {
        return this.apiStore.getApiClient()
            .put("eas/archives/" + store.name + "/configuration");
    };
    StoreModule.prototype.spoolFiles = function (store, files) {
        var form = new form_data_1.default();
        for (var i = 0; i < files.length; i++) {
            form.append((i > 0) ? "attachment" + i : 'attachment', files[i]);
        }
        return this.apiStore.getApiJsonClient()
            .post("eas/archives/" + store.name + "/spool", {
            body: form,
            headers: form.getHeaders()
        })
            .then(function (res) { return res.spool; });
    };
    StoreModule.prototype.getRetentions = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention")
            .then(function (res) { return res.list; });
    };
    StoreModule.prototype.getRecordsMarkedDeleted = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention/marked-deleted")
            .then(function (res) { return res.list; });
    };
    StoreModule.prototype.getRecordsExpiredMin = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention/expired-min")
            .then(function (res) { return res.list; });
    };
    StoreModule.prototype.deleteRecordsExpiredMin = function (store) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/retention/expired-min");
    };
    StoreModule.prototype.getRecordsExpiredMax = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention/expired-max")
            .then(function (res) { return res.list; });
    };
    StoreModule.prototype.deleteRecordsExpiredMax = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention/expired-max");
    };
    StoreModule.prototype.getTermList = function (store, query) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/termlist?" + URLParams_1.URLParams.getParamsString(query));
    };
    StoreModule.prototype.getRetentionPolicy = function (store, retentionPolicyId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retentionPolicy/" + retentionPolicyId);
    };
    StoreModule.prototype.deleteRetentionPolicy = function (store, retentionPolicyId) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/retentionPolicy/" + retentionPolicyId);
    };
    return StoreModule;
}());
exports.StoreModule = StoreModule;
