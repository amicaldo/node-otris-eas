"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyModule = void 0;
var PolicyModule = /** @class */ (function () {
    function PolicyModule(apiClient) {
        this.apiStore = apiClient;
    }
    PolicyModule.prototype.get = function (store, policyId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/accesscontrolpolicy/" + policyId);
    };
    PolicyModule.prototype.delete = function (store, policyId) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/accesscontrolpolicy/" + policyId);
    };
    return PolicyModule;
}());
exports.PolicyModule = PolicyModule;
