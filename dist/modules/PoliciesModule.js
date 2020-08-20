"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesModule = void 0;
var PoliciesModule = /** @class */ (function () {
    function PoliciesModule(apiClient) {
        this.apiStore = apiClient;
    }
    PoliciesModule.prototype.get = function (store, policyId) {
        return this.apiStore.getApiJsonClient()
            .get("eas/archives/" + store.name + "/accesscontrolpolicy/" + policyId);
    };
    PoliciesModule.prototype.delete = function (store, policyId) {
        return this.apiStore.getApiJsonClient()
            .delete("eas/archives/" + store.name + "/accesscontrolpolicy/" + policyId);
    };
    return PoliciesModule;
}());
exports.PoliciesModule = PoliciesModule;
