"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasApi = void 0;
var got_1 = __importDefault(require("got"));
var ArchiveModule_1 = require("./modules/ArchiveModule");
var AttachmentModule_1 = require("./modules/AttachmentModule");
var PolicyModule_1 = require("./modules/PolicyModule");
var RecordModule_1 = require("./modules/RecordModule");
var StoreModule_1 = require("./modules/StoreModule");
var AnnotationModule_1 = require("./modules/AnnotationModule");
var EasApi = /** @class */ (function () {
    function EasApi(base, username, password) {
        var token = Buffer.from(username + ":" + password).toString('base64');
        this.apiClient = got_1.default.extend({
            prefixUrl: base,
            headers: {
                'X-Otris-Eas-User': 'manager',
                'Accept': 'application/json',
                'Authorization': "Basic " + token
            }
        });
        this.apiJsonClient = this.apiClient.extend({
            responseType: 'json',
            resolveBodyOnly: true
        });
        this.annotationModule = new AnnotationModule_1.AnnotationModule(this);
        this.archiveModule = new ArchiveModule_1.ArchiveModule(this);
        this.attachmentModule = new AttachmentModule_1.AttachmentModule(this);
        this.policyModule = new PolicyModule_1.PolicyModule(this);
        this.recordModule = new RecordModule_1.RecordModule(this);
        this.storeModule = new StoreModule_1.StoreModule(this);
    }
    // Get API clients
    /**
     * Gets the regular API client.
     */
    EasApi.prototype.getApiClient = function () {
        return this.apiClient;
    };
    /**
     * Gets the API client that resolves JSON
     */
    EasApi.prototype.getApiJsonClient = function () {
        return this.apiJsonClient;
    };
    // Get API modules
    /**
     * Gets the module to handle annotations.
     */
    EasApi.prototype.annotations = function () {
        return this.annotationModule;
    };
    /**
     * Gets the module to handle archives.
     */
    EasApi.prototype.archives = function () {
        return this.archiveModule;
    };
    /**
     * Gets the module to handle attachments.
     */
    EasApi.prototype.attachments = function () {
        return this.attachmentModule;
    };
    /**
     * Gets the module to handle policies.
     */
    EasApi.prototype.policies = function () {
        return this.policyModule;
    };
    /**
     * Gets the module to handle records.
     */
    EasApi.prototype.records = function () {
        return this.recordModule;
    };
    /**
     * Gets the module to handle stores.
     */
    EasApi.prototype.stores = function () {
        return this.storeModule;
    };
    return EasApi;
}());
exports.EasApi = EasApi;
