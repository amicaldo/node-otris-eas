"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasApi = void 0;
var got_1 = __importDefault(require("got"));
var ArchivesModule_1 = require("./modules/ArchivesModule");
var AttachmentModule_1 = require("./modules/AttachmentModule");
var PoliciesModule_1 = require("./modules/PoliciesModule");
var RecordModule_1 = require("./modules/RecordModule");
var StoreModule_1 = require("./modules/StoreModule");
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
        this.archivesModule = new ArchivesModule_1.ArchivesModule(this);
        this.attachmentModule = new AttachmentModule_1.AttachmentModule(this);
        this.policiesModule = new PoliciesModule_1.PoliciesModule(this);
        this.recordModule = new RecordModule_1.RecordModule(this);
        this.storeModule = new StoreModule_1.StoreModule(this);
    }
    // Get API clients
    EasApi.prototype.getApiClient = function () {
        return this.apiClient;
    };
    EasApi.prototype.getApiJsonClient = function () {
        return this.apiJsonClient;
    };
    // Get API modules
    EasApi.prototype.archives = function () {
        return this.archivesModule;
    };
    EasApi.prototype.attachments = function () {
        return this.attachmentModule;
    };
    EasApi.prototype.policies = function () {
        return this.policiesModule;
    };
    EasApi.prototype.records = function () {
        return this.recordModule;
    };
    EasApi.prototype.stores = function () {
        return this.storeModule;
    };
    return EasApi;
}());
exports.EasApi = EasApi;
