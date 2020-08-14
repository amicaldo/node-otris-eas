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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eas = void 0;
var digest_fetch_1 = __importDefault(require("digest-fetch"));
var Eas = /** @class */ (function () {
    function Eas(base, username, password) {
        this.defaultHeaders = {
            'x-otris-eas-user': 'manager',
            'accept': 'application/json'
        };
        this.base = base;
        this.api = new digest_fetch_1.default(username, password, { algorithm: 'MD5' });
    }
    /**
     * Stores
     */
    Eas.prototype.getStores = function () {
        return this.get('/eas/archives')
            .then(function (res) { return res.json(); })
            .then(function (res) { return res.stores; });
    };
    Eas.prototype.createStore = function (storeName, iniData) {
        return this.put("/eas/archives/" + storeName, iniData, {
            'Content-Type': 'plain/text'
        });
    };
    Eas.prototype.deleteStore = function (store) {
        return this.delete("/eas/archives/" + store.name)
            .then(function (res) { return res.text(); });
    };
    Eas.prototype.getStoreConfiguration = function (store) {
        return this.get("/eas/archives/" + store.name + "/configuration")
            .then(function (res) { return res.json(); })
            .then(function (res) { return res.configuration; });
    };
    Eas.prototype.activateStore = function (store) {
        return this.put("/eas/archives/" + store.name + "/active")
            .then(function (res) { return res.text(); });
    };
    Eas.prototype.deactivateStore = function (store) {
        return this.delete("/eas/archives/" + store.name + "/active")
            .then(function (res) { return res.text(); });
    };
    Eas.prototype.post = function (endpoint, body, headers) {
        if (body === void 0) { body = ''; }
        if (headers === void 0) { headers = {}; }
        return this.api.fetch("" + this.base + endpoint, {
            method: 'post',
            headers: __assign(__assign({}, this.defaultHeaders), headers),
            body: body
        });
    };
    Eas.prototype.get = function (endpoint, headers) {
        if (headers === void 0) { headers = {}; }
        return this.api.fetch("" + this.base + endpoint, {
            method: 'get',
            headers: __assign(__assign({}, this.defaultHeaders), headers)
        });
    };
    Eas.prototype.put = function (endpoint, body, headers) {
        if (body === void 0) { body = ''; }
        if (headers === void 0) { headers = {}; }
        return this.api.fetch("" + this.base + endpoint, {
            method: 'put',
            headers: __assign(__assign({}, this.defaultHeaders), headers),
            body: body
        });
    };
    Eas.prototype.delete = function (endpoint, headers) {
        if (headers === void 0) { headers = {}; }
        return this.api.fetch("" + this.base + endpoint, {
            method: 'delete',
            headers: __assign(__assign({}, this.defaultHeaders), headers)
        });
    };
    return Eas;
}());
exports.Eas = Eas;
