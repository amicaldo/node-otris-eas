"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = void 0;
var URLParams_1 = require("../helpers/URLParams");
var form_data_1 = __importDefault(require("form-data"));
/**
 * Module to handle stores
 *
 * Each store can contain records.
 */
var StoreModule = /** @class */ (function () {
    function StoreModule(apiClient) {
        this.apiStore = apiClient;
    }
    /**
     * Gets all existing stores.
     *
     * @returns Array of all existing stores with name and URL
     */
    StoreModule.prototype.getAll = function () {
        return this.apiStore.getApiJsonClient()
            .get('eas/archives')
            .then(function (res) { return res.stores; });
    };
    /**
     * Creates a store.
     *
     * @param storeName - Name of the new store
     * @param iniData - Configuration of the new store as INI
     * @returns Empty
     */
    StoreModule.prototype.create = function (storeName, iniData) {
        return this.apiStore.getApiClient()
            .put("eas/archives/" + storeName, {
            body: iniData
        });
    };
    /**
     * Deletes a store.
     *
     * @param store - Store to be deleted
     * @returns Empty
     */
    StoreModule.prototype.delete = function (store) {
        return this.apiStore.getApiClient()
            .delete("eas/archives/" + store.name);
    };
    /**
     * Activates a store.
     *
     * @param store - Store to activate
     * @returns Empty
     */
    StoreModule.prototype.activate = function (store) {
        return this.apiStore.getApiClient()
            .put("eas/archives/" + store.name + "/active");
    };
    /**
     * Deactivates a store.
     *
     * @param store - Store to deactivate
     * @returns Empty
     */
    StoreModule.prototype.deactivate = function (store) {
        return this.apiStore.getApiClient()
            .delete("eas/archives/" + store.name + "/active");
    };
    /**
     * Requests a stores configuration.
     *
     * @param store - The store to request the configuration from
     * @returns Configuration object of the store
     */
    StoreModule.prototype.getConfiguration = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/configuration")
            .then(function (res) { return res.configuration; });
    };
    /**
     * Changes the configuration of a store.
     *
     * @param store - The store to update the configuration of
     * @param iniData - The updated configuration of the store as INI
     * @returns Empty
     */
    StoreModule.prototype.updateConfiguration = function (store, iniData) {
        return this.apiStore.getApiClient()
            .put("eas/archives/" + store.name + "/configuration");
    };
    /**
     * Spools a file to later attach it to a record.
     *
     * @param store - The store to spool the file in
     * @param files - The file to spool as ReadStream
     * @returns List of the spooled files
     */
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
    /**
     * Retrieves the references to the list of deletable records.
     *
     * @param store - Store to search for deletable
     * @returns List of deletable records
     */
    StoreModule.prototype.getRetentions = function (store) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/retention")
            .then(function (res) { return res.list; });
    };
    /**
     * Retrieves a list of terms from the index that start with a certain character string (prefix)
     * and for which the number of entries in the index exceeds the specified threshold.
     *
     * @param store - Store to query the index of
     * @param query - Data to query
     * @returns List of queried terms
     */
    StoreModule.prototype.getTermList = function (store, query) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/termlist?" + URLParams_1.URLParams.getParamsString(query));
    };
    return StoreModule;
}());
exports.StoreModule = StoreModule;
