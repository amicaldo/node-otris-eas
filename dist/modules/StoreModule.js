"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = void 0;
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
    return StoreModule;
}());
exports.StoreModule = StoreModule;
