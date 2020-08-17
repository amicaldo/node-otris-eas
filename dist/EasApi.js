"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasApi = void 0;
var got_1 = __importDefault(require("got"));
var RecordModule_1 = require("./modules/RecordModule");
var SpoolModule_1 = require("./modules/SpoolModule");
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
        this.recordModule = new RecordModule_1.RecordModule(this);
        this.spoolModule = new SpoolModule_1.SpoolModule(this);
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
    EasApi.prototype.records = function () {
        return this.recordModule;
    };
    EasApi.prototype.spools = function () {
        return this.spoolModule;
    };
    EasApi.prototype.stores = function () {
        return this.storeModule;
    };
    return EasApi;
}());
exports.EasApi = EasApi;
